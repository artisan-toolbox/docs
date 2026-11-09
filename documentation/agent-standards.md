# Install and update shared agent standards

Use this guide to give Artisan Toolbox projects the same documentation and package development workflow.
Start with Node.js 24.11 or newer, a checkout of this documentation repository, and the target project's existing instructions and uncommitted work available for review.
No Composer or npm installation is required to run the synchronizer itself.

## Use the versioned source

The owning source is `documentation/agent-standards/` in the `docs` repository.
Its `manifest.json` identifies a standards version, the included skills, and a SHA-256 fingerprint of their content and the synchronizer.
The current bundle is version `1.0.6`. This is a version of contributor guidance, independent of public package releases.

The bundle contains two skills:

| Skill                     | Use                                                                                                                              |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `atb-documentation`       | Write and maintain guides, README examples, changelogs, references, and documentation learning journeys.                         |
| `atb-package-development` | Implement and verify package changes while keeping public contracts, tests, compatibility, skills, and documentation consistent. |

The writing standard follows Diataxis and Google's developer writing guidance.
The skills include the relevant prose review rules and page patterns, so their operation does not depend on personal `technical-writing` or `unslop` installations.
Existing specialized package skills remain responsible for their own integration, testing, compatibility, and release details.
Repository instructions and the user's task scope continue to govern local work.

## Install into a project

The `docs` repository is the first consumer.
From its root, synchronize the selected version:

```bash
npm run standards:sync -- --version 1.0.6
npm run standards:check
```

The second command reports `Standards 1.0.6: 0 pending files.` when source and installed copies agree.
The check is read-only and exits unsuccessfully when a file is missing, edited, or out of sync.

To adopt the same version in another workspace project, run the synchronizer from `docs`, naming the target checkout explicitly:

```bash
node scripts/sync-agent-standards.mjs --target ../core --write --version 1.0.6
```

Review the resulting files in that project's diff and ensure its ignore rules permit them to be committed:

| Path                      | Ownership                                                   |
| ------------------------- | ----------------------------------------------------------- |
| `.ai/manifest.json`       | Installed bundle identity and fingerprint.                  |
| `.ai/skills/atb-*/`       | Installed sources for Laravel Boost custom skill discovery. |
| `.agents/skills/atb-*/`   | Installed copies for Codex repository discovery.            |
| `.ai/sync.mjs`            | The same version's standalone synchronizer and checker.     |
| `.ai/standards.lock.json` | Selected version and managed file fingerprints.             |

The synchronizer requires an explicit version for writes and preserves unrelated skills.
It refuses to overwrite locally edited or colliding files. It accepts Boost links from a Codex skill directory to the same skill under `.ai/skills/` and rejects other symlinked managed paths.
Review and move intended local changes to the owning source before synchronizing again.
Repeated synchronization of unchanged content does not rewrite managed files.
An upgrade removes obsolete managed resources only when their contents still match the previously installed fingerprints.

When started in the target repository, Codex can discover its committed `.agents/skills` copies.
For another agent supported by the installed Laravel Boost version, run `php artisan boost:install --skills` in the consuming Laravel application and select the desired skills and agent.
Inspect generated changes. Keep agent-specific generated resources separate from the committed standards source.
Existing `boost.json` preferences remain local in `docs`.

## Check a standalone checkout

After installation, the target project can check its selected standards without a sibling `docs` checkout or package-manager dependencies:

```bash
node .ai/sync.mjs --check
```

Add this command to the consuming project's CI after Node setup.
Commit the installed bundle and lock with the adoption change.
The check verifies consistency with the selected version. Adopting a newer version remains an explicit, reviewable change.

In `docs`, `npm run standards:check` also compares the installed copies with the owning source.
Its GitHub Actions workflow runs the check before dependency installation.
The normal frontend test suite covers synchronization, version pins, drift detection, upgrades, conflict preservation, standalone checks, and unsafe paths.

## Release a new standards version locally

Edit the owning skill or synchronizer under `documentation/agent-standards/`.
Use a patch version for compatible wording corrections, a minor version for additional compatible guidance, and a major version for incompatible workflow requirements.
Review the effect on consuming projects before changing their selected version.

From the `docs` root, seal the reviewed content with a higher version, then update its installed copies:

```bash
node scripts/sync-agent-standards.mjs --release 1.0.7
node_modules/.bin/vp fmt documentation/agent-standards/manifest.json
npm run standards:sync -- --version 1.0.7
npm run standards:check
npm test -- scripts/sync-agent-standards.test.mjs
```

The release command updates the manifest. It does not create a Git tag, push changes, or publish a package.
Changed content cannot reuse a sealed version or downgrade it.
Apply formatters to skill content and the synchronizer before sealing because formatting changes their fingerprint. Format the generated manifest before synchronizing; consumers receive its exact source bytes.
Run the complete documentation validation suite before review.

For another consumer, use its installed checker with the reviewed source checkout:

```bash
node .ai/sync.mjs --source ../docs/documentation/agent-standards --write --version 1.0.7
node .ai/sync.mjs --check
```

Review and commit the source release and each consumer update together where practical.
Record projects still using an older version instead of claiming that all projects were upgraded.
Follow [package skill maintenance](package-skills.md) for consumer-facing skills shipped in package Composer distributions and [documentation authoring](authoring.md) for content verification.
