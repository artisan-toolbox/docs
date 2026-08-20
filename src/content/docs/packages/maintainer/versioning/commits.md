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

## Push the commit

After Git creates the commit, Maintainer offers to push `HEAD` to `origin`. The default is no, and pushing always requires confirmation.

The complete workflow requires interactive input. It does not create a commit when no files are selected or when message generation fails.
