# Maintain code examples

Use `CodeExample` for source and terminal examples. Its existing `code`, `label`, and `language` props define the example. The default slot provides an optional explanation. Keep install steps and expected results in the surrounding guide.

```vue
<CodeExample label="Install Core" language="bash" code="composer require artisan-toolbox/core" />
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

Changing the `code` prop clears the previous clipboard feedback. The copy control returns to **Copy** so a success message never describes source the reader has not copied. Each source owns its public Front Awesome `CopyButton` instance. A pending clipboard operation can still finish for the previous source, but its success or failure cannot change the current source's feedback or block its copy control. Keyboard focus remains on the replacement copy control when the previous control held focus. Source rendering and highlighting retain their existing component state.

Search reads the original `CodeExample` props and explanation, not the rendered tokens or toolbar. Keep that semantic adapter when changing presentation. Do not add copied search text or page-specific renderers.

## Start highlighting when readers need it

`CodeExample` renders the complete plain source and copy control immediately. It waits until its figure first intersects the viewport with a 200-pixel vertical margin before importing the highlighter. This margin starts the work shortly before the reader reaches the block; it is not a measured performance optimum. Deferred code remains readable and does not announce a loading state. Only an active highlighting request sets `aria-busy`.

First intersection admits the component once. Scrolling away and back does not discard tokens or repeat work for unchanged code. Later source or language changes retain the existing stale-result protection and use the latest authored text. VueUse's installed `useIntersectionObserver` owns observation and scope cleanup. Do not add a second observer controller, scroll polling, timers, or a highlighter instance to each page.

`DemoFrame` keeps its source examples mounted inside native `details`. It passes `highlightEnabled=false` until the reader first opens **View source**, then permanently enables those examples for that mounted demo. Each source still waits for its own first intersection. Closing and reopening the disclosure retains admitted work and completed tokens. Native pointer, keyboard, and browser disclosure behavior remain intact.

Ordinary pages need no new prop. The optional `highlightEnabled` prop defaults to `true` and lets an owning disclosure delay permission without removing source text from the DOM. Keep that permission in the shared disclosure component rather than adding switches to individual documentation pages. A browser without Intersection Observer highlights permitted examples eagerly; unopened demo sources remain plain until first opening. No observer polyfill is required to read or copy code.

## Verify a change

```sh
npm test -- resources/js/lib/codeHighlighter.test.js resources/js/components/docs/CodeExample.test.js resources/js/components/demo/DemoFrame.test.js
php artisan docs:search:index --no-interaction
php artisan docs:search:index --check --no-interaction
composer ci:check
npm run build
```

Inspect actual shell, PHP, and Vue examples on desktop and mobile. Check token colors, long-line scrolling, readable labels, keyboard focus, both themes, and the copy result. A mocked highlighter verifies component lifecycle behavior; the helper tests must also exercise real grammars.

On a fresh QZ Tray overview, inspect the plain offscreen examples before scrolling. Approach each block and confirm highlighting appears without changing its exact source. Keep the demo source closed until its turn, then open it with the keyboard. Confirm closing and reopening retains its tokens and that the label renderer still waits for its separate **Preview label** action. Compare actual work and source preservation before reporting a performance gain; token counts do not establish a Lighthouse or CPU-time improvement.

The implementation follows Shiki's [fine-grained bundles](https://shiki.style/guide/bundles), [JavaScript regex engine](https://shiki.style/guide/regex-engines), and [custom theme API](https://shiki.style/guide/load-theme). The activation boundary uses VueUse's [intersection observer](https://vueuse.org/core/useIntersectionObserver/) and the native [details disclosure](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details). Verify observer behavior against the installed VueUse version when changing it. Front Awesome's public exports were reviewed and provide no code-display component, so this presentation belongs to the documentation application.
