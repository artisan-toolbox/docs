---
title: Create Commits
description: Select working-tree changes and create a manual or AI-generated Conventional Commit.
sidebar:
  order: 1
---

Run the interactive commit workflow:

```bash
vendor/bin/maintainer commit
```

## Review and select files

Maintainer first offers to open the [HTML diff workflow](/packages/maintainer/versioning/html-diffs/) in the browser. Its searchable multi-select then lists modified, staged, deleted, renamed, and untracked files, with every change selected by default.

The selection replaces the current staging-area selection. Selected files are staged with their complete working-tree contents; previously staged files that are not selected remain in the working tree but become unstaged.

## Write the message

Choose one of three modes:

- write a message manually in the multiline editor;
- generate a Conventional Commit message from the selected status and diff;
- add user context before generating the message from the same changes.

AI generation uses `ai.providers.commit_message`. Configure that provider and its credentials through the [Configuration Reference](/packages/maintainer/configuration/reference/) before selecting an AI mode.

For large selections, Maintainer limits the amount of status, diff, and optional context sent to the provider. It prioritizes source changes over generated files and dependency lock files in large diffs and marks omitted details in the prompt. If the provider rejects the request because it exceeds the model’s context window, Maintainer retries once when it can send a smaller prompt. All selected changes remain staged in full.

The final commit message always opens in a multiline editor before Git creates the commit. AI modes prefill the editor with the generated result so you can read, refine, or replace it; manual mode opens the same editor empty.

## Push the commit

After Git creates the commit, Maintainer offers to push `HEAD` to `origin`. The default is no, and pushing always requires confirmation.

The complete workflow requires interactive input. It does not create a commit when no files are selected or when message generation fails.
