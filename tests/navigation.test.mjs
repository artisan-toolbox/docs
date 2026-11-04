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
  const locations = {
    home: links(mainContent(await loadPage(""))),
    catalog: links(mainContent(catalog), "/packages/"),
    chooser: links(
      mainContent(await loadPage("getting-started/choose-a-package/")),
    ),
    sidebar: links(catalog.slice(0, catalog.indexOf("<main"))),
  };

  for (const [location, found] of Object.entries(locations)) {
    for (const route of packageRoutes) {
      assert.ok(found.has(route), `${location} links to ${route}`);
    }

    assert.match(found.get("/packages/front-awesome/"), /\bWIP\b/, location);
  }
});

test("The old Maintainer integration page links to the current guide", async () => {
  const legacy = "packages/maintainer/project-integration/";
  const guide = "packages/maintainer/versioning/project-integration/";
  const oldPage = mainContent(await loadPage(legacy));

  assert.ok(links(oldPage, `/${legacy}`).has(`/${guide}`));
  assert.match(mainContent(await loadPage(guide)), /WithReadmeHead/);
});
