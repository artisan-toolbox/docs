---
title: HTML Git Diffs
description: Render working-tree or Git-reference comparisons and review them in a browser.
sidebar:
  order: 2
---

Compare `HEAD` with the working tree and open the report:

```bash
vendor/bin/maintainer diff:html
```

Pass one reference to use it as the base for a working-tree comparison or two references to compare them directly:

```bash
vendor/bin/maintainer diff:html main
vendor/bin/maintainer diff:html v1.0.0 v1.1.0
```

Working-tree comparisons include staged and unstaged changes to tracked files. Add new files to Git before generating the report when they should be included.

## Output path and browser

Reports use the operating system's temporary directory by default. Choose a destination or suppress browser opening with:

```bash
vendor/bin/maintainer diff:html main --output=artifacts/main-diff.html --no-open
```

A relative output is resolved from the consuming project. Maintainer creates its parent directory and appends `.html` when the filename has no HTML extension.

## Layout

Set `git.diff.output_format` to `line_by_line` or `side_by_side` in `config/maintainer.php`:

```php
<?php

return [
    'git' => [
        'diff' => [
            'output_format' => 'side_by_side',
        ],
    ],
];
```

The generated report loads the pinned diff2html 3.4.56 browser assets from jsDelivr when opened.
