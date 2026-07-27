import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renderiza la aplicación de gestión del minimarket", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Mercado Uno \| Gestión de minimarket<\/title>/i);
  assert.match(html, /Mercado Uno/);
  assert.match(html, /Punto de venta/);
  assert.match(html, /Preparando el minimarket/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("mantiene el cliente API y los módulos principales", async () => {
  const [app, api, packageJson] = await Promise.all([
    readFile(new URL("../app/minimarket-app.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  for (const moduleName of [
    "dashboard",
    "checkout",
    "catalog",
    "inventory",
    "supply",
    "clients",
    "access",
    "reports",
  ]) {
    assert.match(app, new RegExp(`id: "${moduleName}"`));
  }

  assert.match(api, /http:\/\/localhost:5001\/api\/v1/);
  assert.match(api, /NEXT_PUBLIC_API_URL/);
  assert.match(packageJson, /"lucide-react"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(
    access(new URL("app/_sites-preview/SkeletonPreview.tsx", projectRoot)),
  );
  await assert.rejects(
    access(new URL("app/_sites-preview/preview.css", projectRoot)),
  );
});
