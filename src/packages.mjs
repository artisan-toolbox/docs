const wipBadge = /** @type {const} */ ({ text: "WIP", variant: "caution" });

export const packages = [
  {
    id: "core",
    title: "Core",
    summary:
      "Build conditional arrays, translate model attributes, and share Laravel and Inertia utilities.",
    wordmarkWidth: 183,
    version: "1.x",
    guides: [
      {
        label: "Sift Conditional Arrays",
        slug: "packages/core/conditional-arrays",
      },
      {
        label: "Multi-domain Inertia Visits",
        slug: "packages/core/multi-domain-inertia",
      },
      {
        label: "Translated Model Attributes",
        slug: "packages/core/translated-attributes",
      },
    ],
  },
  {
    id: "dump-to-console",
    title: "Dump to Console",
    summary:
      "Send Laravel dumps to a separate console without changing the application response.",
    wordmarkWidth: 445,
    version: "1.x",
    guides: [
      {
        label: "Usage and Configuration",
        slug: "packages/dump-to-console/usage",
      },
    ],
  },
  {
    id: "front-awesome",
    title: "Front Awesome",
    summary: "Explore reusable Vue components for Laravel and Inertia.",
    wordmarkWidth: 390,
    version: null,
    guides: [],
  },
  {
    id: "maintainer",
    title: "Maintainer",
    summary:
      "Run quality checks, create releases, and automate project maintenance.",
    wordmarkWidth: 289,
    version: "1.x",
    guides: [
      {
        label: "Code Quality",
        collapsed: true,
        items: [
          {
            label: "Overview",
            slug: "packages/maintainer/ci",
          },
          {
            label: "Fixes and CI Checks",
            slug: "packages/maintainer/ci/quality",
          },
        ],
      },
      {
        label: "Configuration",
        collapsed: true,
        items: [
          {
            label: "Overview",
            slug: "packages/maintainer/configuration",
          },
          {
            label: "Configuration Reference",
            slug: "packages/maintainer/configuration/reference",
          },
          {
            label: "Publish Configuration",
            slug: "packages/maintainer/configuration/publishing",
          },
          {
            label: "SSH Keys",
            slug: "packages/maintainer/configuration/ssh-keys",
          },
        ],
      },
      {
        label: "Deployment",
        collapsed: true,
        items: [
          {
            label: "Overview",
            slug: "packages/maintainer/deployment",
          },
          {
            label: "Run a Deployment",
            slug: "packages/maintainer/deployment/deploy",
          },
          {
            label: "Unlock a Deployment",
            slug: "packages/maintainer/deployment/unlock",
          },
          {
            label: "Repository Tag Selection",
            slug: "packages/maintainer/deployment/repository-tags",
          },
          {
            label: "PM2 Configuration",
            slug: "packages/maintainer/deployment/pm2",
          },
        ],
      },
      {
        label: "Versioning",
        collapsed: true,
        items: [
          {
            label: "Overview",
            slug: "packages/maintainer/versioning",
          },
          {
            label: "Create Commits",
            slug: "packages/maintainer/versioning/commits",
          },
          {
            label: "HTML Git Diffs",
            slug: "packages/maintainer/versioning/html-diffs",
          },
          {
            label: "Create Releases",
            slug: "packages/maintainer/versioning/releases",
          },
          {
            label: "Project Integration",
            slug: "packages/maintainer/versioning/project-integration",
          },
        ],
      },
      {
        label: "Development and Building",
        slug: "packages/maintainer/development",
      },
    ],
  },
  {
    id: "mosaicast",
    title: "Mosaicast",
    summary:
      "Deliver Laravel events through Inertia props or a private session broadcast channel.",
    wordmarkWidth: 277,
    version: "1.x",
    guides: [
      {
        label: "Delivery Guarantees",
        slug: "packages/mosaicast/roadmap",
      },
      {
        label: "Session Broadcast Channels",
        slug: "packages/mosaicast/session-channels",
      },
      {
        label: "Inertia Delivery",
        slug: "packages/mosaicast/inertia-delivery",
      },
      {
        label: "Vue Plugin",
        slug: "packages/mosaicast/vue-plugin",
      },
    ],
  },
  {
    id: "qztray",
    title: "QZ Tray Connector",
    summary:
      "Print through QZ Tray and preview ESC/POS receipts, ZPL labels, and PDFs.",
    wordmarkWidth: 451,
    version: "1.x",
    guides: [
      {
        label: "Compatibility and Limits",
        slug: "packages/qztray/compatibility",
      },
    ],
  },
].map((entry) => ({
  ...entry,
  badge: entry.version ?? wipBadge,
  slug: `packages/${entry.id}`,
  href: `/packages/${entry.id}/`,
}));
