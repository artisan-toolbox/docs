import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const dist = new URL("../dist/", import.meta.url);
const packageDocs = new URL("../src/content/docs/packages/", import.meta.url);

function loadPage(route) {
  return readFile(new URL(`${route}index.html`, dist), "utf8");
}

function mainContent(html) {
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(main, "The built page has a main landmark.");
  return main;
}

function links(html, base = "/") {
  return new Map(
    [...html.matchAll(/<a\s[^>]*\bhref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)].map(
      ([, href, content]) => [
        new URL(href, `https://docs.example${base}`).pathname,
        content,
      ],
    ),
  );
}

test("Every package is discoverable from the home, catalog, chooser, and sidebar", async () => {
  const entries = await readdir(packageDocs, { withFileTypes: true });
  const packageRoutes = [];
  for (const { name } of entries.filter((entry) => entry.isDirectory())) {
    const pages = await readdir(new URL(`${name}/`, packageDocs));
    if (pages.includes("index.md") || pages.includes("index.mdx")) {
      packageRoutes.push(`/packages/${name}/`);
    }
  }
  const catalog = await loadPage("packages/");
  const sidebar = catalog.slice(0, catalog.indexOf("<main"));
  const locations = {
    home: links(mainContent(await loadPage(""))),
    catalog: links(mainContent(catalog), "/packages/"),
    chooser: links(
      mainContent(await loadPage("getting-started/choose-a-package/")),
    ),
    sidebar: links(sidebar),
  };

  for (const [location, found] of Object.entries(locations)) {
    for (const route of packageRoutes) {
      assert.ok(found.has(route), `${location} links to ${route}`);
    }

    if (location !== "sidebar") {
      assert.match(found.get("/packages/front-awesome/"), /\bWIP\b/, location);
    }
  }

  const frontAwesomeGroup = [
    ...sidebar.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/g),
  ].find(([, content]) => content.includes(">Front Awesome<"));
  assert.ok(frontAwesomeGroup, "Front Awesome has a sidebar group.");
  assert.match(frontAwesomeGroup[1], /\bWIP\b/, "sidebar group");
});

test("Front Awesome guides are reachable from the overview and sidebar", async () => {
  const overviewRoute = "/packages/front-awesome/";
  const overview = await loadPage(overviewRoute.slice(1));
  const overviewLinks = links(mainContent(overview), overviewRoute);
  const sidebarLinks = links(overview.slice(0, overview.indexOf("<main")));
  const guides = [
    "installation/",
    "web-awesome/",
    "configuration/",
    "vue-plugin/",
    "button/",
    "toasts/laravel/",
    "toasts/vue/",
    "development/",
  ];

  for (const guide of guides) {
    const route = `${overviewRoute}${guide}`;
    assert.ok(overviewLinks.has(route), `The overview links to ${route}.`);
    assert.ok(sidebarLinks.has(route), `The sidebar links to ${route}.`);
  }

  for (const guide of ["", ...guides]) {
    const route = `${overviewRoute}${guide}`;
    const page = await loadPage(route.slice(1));

    for (const [, href] of mainContent(page).matchAll(
      /<a\b[^>]*\bhref="([^"]+)"/g,
    )) {
      const target = new URL(href, `https://docs.example${route}`);
      if (
        target.origin !== "https://docs.example" ||
        !target.pathname.startsWith("/packages/")
      )
        continue;
      const destination =
        target.pathname === route
          ? page
          : await loadPage(target.pathname.slice(1));
      if (target.hash) {
        assert.ok(
          destination.includes(
            `id="${decodeURIComponent(target.hash.slice(1))}"`,
          ),
          `${route} links to ${href}.`,
        );
      }
    }
  }

  for (const anchor of [
    "frontend-distribution",
    "configure-vite",
    "render-a-button",
    "validate-a-checkout",
    "use-the-frontend-agent-skills",
  ]) {
    assert.ok(
      overview.includes(`id="${anchor}"`),
      `The overview keeps the #${anchor} link.`,
    );
  }
});

test("The old Maintainer integration page links to the current guide", async () => {
  const legacy = "packages/maintainer/project-integration/";
  const guide = "packages/maintainer/versioning/project-integration/";
  const oldPage = mainContent(await loadPage(legacy));

  assert.ok(links(oldPage, `/${legacy}`).has(`/${guide}`));
  assert.match(mainContent(await loadPage(guide)), /WithReadmeHead/);
});
