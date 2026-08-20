---
title: Create Releases
description: Select a semantic version, generate release content, and publish a GitHub release.
sidebar:
  order: 3
---

Create a release for the consuming project:

```bash
vendor/bin/maintainer release:create
```

## Requirements

Before starting, Maintainer requires:

- a completely clean Git working tree;
- a major branch named `0.x`, `1.x`, `2.x`, and so on;
- a class directly in a production PSR-4 namespace that implements `Versionable`;
- authenticated GitHub CLI access;
- a supported semantic version when the version constant already exists;
- configured AI providers and credentials for release recommendations and generated content.

See [Project Integration](/packages/maintainer/versioning/project-integration/) for the version class, lifecycle hooks, and README badge.

## Find the release baseline

Maintainer reads published GitHub releases, ignores drafts and unsupported tags, and selects the highest valid version for the branch major. A missing local release tag is fetched explicitly from `origin`, supporting shallow and `--no-tags` clones.

When `0.x` has no release, initial choices are `0.1.0`, `0.1.0-alpha.1`, and `0.1.0-beta.1`. Other majors begin at `MAJOR.0.0` with equivalent prerelease choices.

## Version transitions

- A stable release can advance to the next patch, stable minor, minor alpha, or minor beta.
- An alpha can advance to the next alpha, first beta, or stable version of the same version line.
- A beta can advance to the next beta or stable version of the same version line.
- A prerelease line must become stable before another patch or minor begins.
- A major increment requires the matching new major branch.

For a stable baseline, the provider under `ai.providers.release_type_suggestion` recommends patch or minor. Any analyzed fragment recommending minor makes minor the consolidated default; otherwise patch remains the default. AI is not consulted when no baseline exists or a prerelease line must finish.

## Release workflow

After version selection, Maintainer:

1. writes the selected version;
2. runs the optional before-versioning callback;
3. builds context from commits and the diff since the baseline;
4. generates release notes and validated changelog entries;
5. updates the version constant and managed README badge;
6. stages the generated files;
7. optionally opens an HTML review of the proposal;
8. creates `chore(release): prepare VERSION`;
9. pushes the commit to `origin`;
10. publishes with `gh release create`.

Alpha and beta versions use GitHub's prerelease flag. A missing changelog is created; subsequent releases are prepended and grouped by Conventional Commit category.

Git remains authoritative for changelog hashes. Unknown AI hashes are discarded, and every omitted real commit receives a deterministic entry derived from its subject. A release with no commits since the baseline stops before content generation.

## AI context limits

Diffs are divided into fragments of at most 24,000 characters, with no more than 16 fragments analyzed. Generated output, dependencies, coverage, lockfiles, and minified assets are recorded as omitted rather than copied into prompts. When the limit truncates analysis, Maintainer tells the operator to review the remaining changes.

## Failure and rollback

Before the release commit is pushed, a failure restores the captured starting `HEAD` and removes untracked release files. On platforms with `pcntl`, `SIGTERM` performs the same rollback and exits with status `143`.

After a successful push, Maintainer does not attempt local rollback because local changes cannot safely undo remote state.
