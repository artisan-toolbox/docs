# Artisan Toolbox Documentation

Centralized documentation for Artisan Toolbox packages, guides, and resources.

The site is built with [Astro Starlight](https://starlight.astro.build/) and configured for publication at [artisantoolbox.wsssoftware.com.br](https://artisantoolbox.wsssoftware.com.br).

## Requirements

- Node.js 22.12 or later
- npm 11 or later

## Local Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The local site is available at `http://localhost:4321` by default.

## Project Structure

```text
src/content/docs/
├── getting-started/
├── packages/
│   └── <package>/
└── project/
```

Each Markdown or MDX file under `src/content/docs/` becomes a documentation page. Package documentation belongs under `packages/<package>/`.

## Commands

| Command                | Purpose                                 |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Start the local development server      |
| `npm run check`        | Validate Astro content and TypeScript   |
| `npm run format`       | Format supported project files          |
| `npm run format:check` | Check formatting without changing files |
| `npm run build`        | Build the production site               |
| `npm test`             | Run the complete validation suite       |

## Deployment

The repository includes an [NGINX server block](deploy/nginx/artisantoolbox.wsssoftware.com.br.conf) for `artisantoolbox.wsssoftware.com.br`. It assumes the production build is available at `/var/www/artisantoolbox/dist`; update the `root` directive when the server uses a different deployment path.

## Contributing

See the [contribution guide](CONTRIBUTING.md) before opening a pull request.

## Versioning

The documentation site follows Semantic Versioning independently from the packages it documents. See [VERSIONING.md](VERSIONING.md) for the complete policy.

## License

This project is open-sourced software licensed under the [MIT license](LICENSE.md).
