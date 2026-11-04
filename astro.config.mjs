// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { packages } from "./src/packages.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://artisantoolbox.wsssoftware.com.br",
  redirects: {
    "/packages/qztray/v1-readiness/": "/packages/qztray/compatibility/",
  },
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
      components: {
        PageTitle: "./src/components/PageTitle.astro",
      },
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
            ...packages.map(({ title, slug, badge, guides }) =>
              guides.length
                ? {
                    label: title,
                    badge,
                    collapsed: true,
                    items: [{ label: "Overview", slug }, ...guides],
                  }
                : { label: title, slug, badge },
            ),
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
