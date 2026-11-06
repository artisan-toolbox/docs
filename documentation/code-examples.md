# Maintain code examples

Use `CodeExample` for source and terminal examples. Its existing `code`, `label`, and `language` props define the example. The default slot provides an optional explanation. Keep install steps and expected results in the surrounding guide.

```vue
<CodeExample
    label="Install Core"
    language="bash"
    code="composer require artisan-toolbox/core"
/>
```

Set a descriptive label such as a filename or the task the command performs. Use the example's actual language. Do not add decorative shell prompts, line numbers, or escape sequences to the source. Readers copy the exact `code` prop, including tabs, blank lines, and line endings.

## Select a language

`resources/js/lib/codeLanguages.js` owns language names, aliases, and whether the toolbar identifies shell commands or source. The existing default is `bash`.

| Language    | Accepted labels                             |
| ----------- | ------------------------------------------- |
| Shell       | `shellscript`, `bash`, `sh`, `shell`, `zsh` |
| PHP         | `php`                                       |
| JavaScript  | `javascript`, `js`                          |
| TypeScript  | `typescript`, `ts`                          |
| Vue         | `vue`                                       |
| Blade       | `blade`                                     |
| HTML        | `html`                                      |
| CSS         | `css`                                       |
| JSON        | `json`                                      |
| YAML        | `yaml`, `yml`                               |
| Environment | `dotenv`                                    |
| Nginx       | `nginx`                                     |

Use `text` for output or other plain text. Unknown labels remain plain text without language detection or arbitrary imports. Add a supported language to the registry and its explicit grammar loader together, with a representative example test.

## Preserve the rendering boundary

The component loads Shiki only when a supported example needs highlighting. `codeHighlighter.js` shares the JavaScript regex engine and loads selected grammars through explicit public imports. Its custom TextMate theme maps token colors to literal Tailwind classes. The dark code canvas keeps the same token contrast in both site themes. Native code scrollbars use a dark color scheme, a thin track, and explicit Tailwind scrollbar colors even when the surrounding site uses its light theme. Preserve keyboard scrolling and horizontal overflow; do not replace the scrollbar with a custom drag widget. The terminal toolbar uses a terminal icon; source blocks identify their language and use a file icon. Both come from the shared Font Awesome adapter.

Render token content through Vue text interpolation. Do not use `v-html`, inject Shiki's HTML output, add inline color styles, or execute authored examples. The token adapter preserves original source slices so CRLF and trailing blank lines survive highlighting. The prose component styles inline code separately from block code.

The current plain source appears immediately while highlighting loads. A stale asynchronous result cannot replace a newer example. Failed initialization and grammar loads can be retried; the component leaves the source readable and reports unavailable highlighting. Clipboard behavior remains available independently of tokenization, with accessible success and manual-copy failure feedback.

Search reads the original `CodeExample` props and explanation, not the rendered tokens or toolbar. Keep that semantic adapter when changing presentation. Do not add copied search text or page-specific renderers.

## Verify a change

```sh
npm test -- resources/js/lib/codeHighlighter.test.js resources/js/components/docs/CodeExample.test.js
php artisan docs:search:index --no-interaction
php artisan docs:search:index --check --no-interaction
composer ci:check
npm run build
```

Inspect actual shell, PHP, and Vue examples on desktop and mobile. Check token colors, long-line scrolling, readable labels, keyboard focus, both themes, and the copy result. A mocked highlighter verifies component lifecycle behavior; the helper tests must also exercise real grammars.

The implementation follows Shiki's [fine-grained bundles](https://shiki.style/guide/bundles), [JavaScript regex engine](https://shiki.style/guide/regex-engines), and [custom theme API](https://shiki.style/guide/load-theme). Front Awesome's public exports were reviewed and provide no code-display component, so this presentation belongs to the documentation application.
