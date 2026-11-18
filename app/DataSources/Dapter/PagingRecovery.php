<?php

namespace App\DataSources\Dapter;

final class PagingRecovery extends PagingCursor
{
    public static int $acquired = 0;

    public function cursorScope(): string
    {
        return 'fictional-notebooks:tenant-'.session('docs.dapter.paging.tenant', 1)
            .':permission-'.session('docs.dapter.paging.revision', 1).':query-v1';
    }

    public function source(): array
    {
        $tenant = (int) session('docs.dapter.paging.tenant', 1);

        self::$acquired++;
        $rows = parent::source();
        $otherTenant = array_map(fn (array $row): array => [...$row, 'id' => $row['id'] + 100, 'tenant' => 2], $rows);

        return array_values(array_filter(array_map(fn (array $row): array => [
            ...$row, 'name' => 'Tenant '.$row['tenant'].' '.$row['name'],
        ], [...$rows, ...$otherTenant]), fn (array $row): bool => $row['tenant'] === $tenant));
    }
}
