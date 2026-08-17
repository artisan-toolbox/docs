## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

This repository is the canonical source of truth for complete Artisan Toolbox documentation.

- Keep package documentation under `src/content/docs/packages/<package>/` synchronized with the implementation, tests, changelog, compatibility matrix, and observable behavior of its package.
- When a task changes another workspace package, update its documentation in this repository as part of the same task.
- Keep package READMEs concise and use them as entry points to this site. Long-form usage, configuration, troubleshooting, architecture, migration, and API content belongs here.
- Use `https://artisantoolbox.wsssoftware.com.br` as the canonical public documentation URL. Package READMEs must link to the corresponding package page under this URL.
- Preserve established public documentation URLs whenever possible. Document redirects or migration paths before changing them.

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
