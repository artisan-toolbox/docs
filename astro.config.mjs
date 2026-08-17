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
          items: [{ autogenerate: { directory: "packages" } }],
        },
        {
          label: "Project",
          items: [{ autogenerate: { directory: "project" } }],
        },
      ],
    }),
  ],
});
