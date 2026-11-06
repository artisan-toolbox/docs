<?php

namespace App\Documentation\Search;

use App\Documentation\PageSlug;
use Illuminate\Support\Facades\File;
use PDO;
use Pdo\Sqlite;
use RuntimeException;
use Throwable;

final class DocumentationSearchIndex
{
    private const int SCHEMA_VERSION = 1;

    /** @param list<SearchDocument> $documents */
    public function publish(array $documents, bool $check = false): bool
    {
        $hash = hash('sha256', self::SCHEMA_VERSION.json_encode($documents, JSON_THROW_ON_ERROR));
        $path = config()->string('documentation.search_index');

        try {
            $connection = $this->open();
            $metadata = $connection->query('SELECT content_hash FROM search_metadata');
            $current = $metadata === false ? null : $metadata->fetchColumn();
            $metadata = null;
            $connection = null;

            if ($current === $hash) {
                return false;
            }
        } catch (Throwable) {
        }

        throw_if($check, RuntimeException::class, 'The documentation search index is missing, invalid, or stale. Run docs:search:index.');

        $directory = dirname($path);

        throw_if(! is_dir($directory) || ($temporary = tempnam($directory, '.documentation-search-')) === false, RuntimeException::class, 'The documentation search index directory must exist and be writable.');

        try {
            $connection = new PDO('sqlite:'.$temporary, options: [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
            $connection->exec('CREATE TABLE search_metadata (schema_version INTEGER NOT NULL, content_hash TEXT NOT NULL)');
            $connection->exec("CREATE VIRTUAL TABLE search_documents USING fts5(id UNINDEXED, slug UNINDEXED, title, package_title, heading, anchor UNINDEXED, body, tokenize='unicode61 remove_diacritics 2')");
            $connection->beginTransaction();
            $metadata = $connection->prepare('INSERT INTO search_metadata VALUES (?, ?)');
            $metadata->execute([self::SCHEMA_VERSION, $hash]);
            $insert = $connection->prepare('INSERT INTO search_documents (id, slug, title, package_title, heading, anchor, body) VALUES (?, ?, ?, ?, ?, ?, ?)');

            foreach ($documents as $document) {
                $insert->execute([$document->id(), $document->slug->value, $document->title, $document->packageTitle, $document->heading, $document->anchor, $document->body]);
            }

            $connection->commit();
            $connection->exec("INSERT INTO search_documents(search_documents) VALUES ('integrity-check')");
            $insert = $metadata = $connection = null;

            throw_unless(chmod($temporary, 0644), RuntimeException::class, 'The documentation search index could not be made readable.');

            throw_unless(rename($temporary, $path), RuntimeException::class, 'The documentation search index could not be published.');
        } finally {
            $insert = $metadata = $connection = null;

            if (is_file($temporary)) {
                File::delete($temporary);
            }
        }

        return true;
    }

    /** @return list<array{id: string, pageTitle: string, sectionTitle: ?string, packageTitle: ?string, href: string, excerpt: string}> */
    public function search(string $query): array
    {
        preg_match_all('/[\p{L}\p{N}_]+/u', $query, $matches);
        $words = array_slice(array_unique($matches[0]), 0, 12);

        if ($words === []) {
            return [];
        }

        $expression = implode(' AND ', array_map(fn (string $word): string => '"'.$word.'"*', $words));
        $connection = $this->open();
        $statement = $connection->prepare("SELECT id, slug, title, package_title, heading, anchor, snippet(search_documents, 6, '', '', '…', 32) AS excerpt FROM search_documents WHERE search_documents MATCH ? ORDER BY bm25(search_documents, 0, 0, 8, 4, 6, 0, 1), id");
        $statement->execute([$expression]);
        $results = [];
        $resultsPerPage = [];

        while (count($results) < 12 && ($row = $statement->fetch(PDO::FETCH_ASSOC))) {
            throw_if(! is_string($row['slug']) || ($slug = PageSlug::tryFrom($row['slug'])) === null, RuntimeException::class, 'The documentation search index has invalid routes.');

            if (($resultsPerPage[$slug->value] ?? 0) >= 3) {
                continue;
            }

            $resultsPerPage[$slug->value] = ($resultsPerPage[$slug->value] ?? 0) + 1;

            $results[] = [
                'id' => (string) $row['id'],
                'pageTitle' => (string) $row['title'],
                'sectionTitle' => $row['heading'] === null ? null : (string) $row['heading'],
                'packageTitle' => $row['package_title'] === null ? null : (string) $row['package_title'],
                'href' => $slug->url(absolute: false).($row['anchor'] === null ? '' : '#'.rawurlencode((string) $row['anchor'])),
                'excerpt' => mb_strimwidth((string) $row['excerpt'], 0, 360, '…'),
            ];
        }

        return $results;
    }

    private function open(): PDO
    {
        $path = config()->string('documentation.search_index');

        throw_unless(is_file($path), RuntimeException::class, 'The documentation search index is unavailable.');

        $connection = new PDO('sqlite:'.$path, options: [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            Sqlite::ATTR_OPEN_FLAGS => Sqlite::OPEN_READONLY,
        ]);

        $schema = $connection->query('SELECT schema_version FROM search_metadata');
        $integrity = $connection->query('PRAGMA quick_check');

        throw_if($schema === false || $integrity === false
            || (int) $schema->fetchColumn() !== self::SCHEMA_VERSION
            || $integrity->fetchColumn() !== 'ok', RuntimeException::class, 'The documentation search index is invalid.');

        $connection->query('SELECT id, slug, title, package_title, heading, anchor, body FROM search_documents WHERE search_documents MATCH \'"indexhealthcheck"\' LIMIT 0');

        return $connection;
    }
}
