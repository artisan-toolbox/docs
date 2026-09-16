// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://artisantoolbox.wsssoftware.com.br",
  integrations: [
    starlight({
      title: "Artisan Toolbox",
      description:
        "Documentation for Artisan Toolbox Laravel packages and developer tools.",
      favicon: "/favicon.png",
      logo: {
        dark: "./logo/artisan-toolbox-logo-dark.png",
        light: "./logo/artisan-toolbox-logo-light.png",
        alt: "Artisan Toolbox",
        replacesTitle: true,
      },
      customCss: ["./src/styles/custom.css"],
      head: [
        {
          tag: "script",
          content: `
            (() => {
              const synchronizeSidebar = () => {
                const sidebar = document.getElementById("starlight__sidebar");
                const currentPage = sidebar?.querySelector('a[aria-current="page"]');

                if (!sidebar || !currentPage) return;

                const groups = Array.from(sidebar.querySelectorAll("details"));

                groups.forEach((group) => {
                  group.open = group.contains(currentPage);
                });

                const stateContainer = sidebar.querySelector(
                  "sl-sidebar-state-persist",
                );
                const hash = stateContainer?.getAttribute("data-hash");

                if (!hash) return;

                try {
                  sessionStorage.setItem(
                    "sl-sidebar-state",
                    JSON.stringify({
                      hash,
                      open: groups.map((group) => group.open),
                      scroll: sidebar.scrollTop,
                    }),
                  );
                } catch {
                  // Sidebar state persistence is optional.
                }
              };

              document.addEventListener("DOMContentLoaded", synchronizeSidebar);
              document.addEventListener("astro:page-load", synchronizeSidebar);
            })();
          `,
        },
      ],
      editLink: {
        baseUrl: "https://github.com/artisan-toolbox/docs/edit/main/",
      },
      lastUpdated: true,
      social: [
        {
          icon: "github",
          label: "Artisan Toolbox on GitHub",
          href: "https://github.com/artisan-toolbox",
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          collapsed: true,
          items: [
            { label: "Overview", slug: "getting-started" },
            {
              label: "Choose a Package",
              slug: "getting-started/choose-a-package",
            },
          ],
        },
        {
          label: "Packages",
          collapsed: true,
          items: [
            { label: "Overview", slug: "packages" },
            {
              label: "Core",
              badge: "1.x",
              collapsed: true,
              items: [
                { label: "Overview", slug: "packages/core" },
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
              label: "Dump to Console",
              badge: "1.x",
              collapsed: true,
              items: [
                { label: "Overview", slug: "packages/dump-to-console" },
                {
                  label: "Usage and Configuration",
                  slug: "packages/dump-to-console/usage",
                },
              ],
            },
            {
              label: "Maintainer",
              badge: "1.x",
              collapsed: true,
              items: [
                { label: "Overview", slug: "packages/maintainer" },
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
              label: "Mosaicast",
              badge: "1.x",
              collapsed: true,
              items: [
                { label: "Overview", slug: "packages/mosaicast" },
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
          ],
        },
        {
          label: "Project",
          collapsed: true,
          items: [{ autogenerate: { directory: "project", collapsed: true } }],
        },
      ],
    }),
  ],
});
