import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const source = resolve(root, ".open-next");
const output = resolve(root, "dist");

await rm(output, { recursive: true, force: true });
await mkdir(resolve(output, "server"), { recursive: true });
await cp(source, resolve(output, "server", "opennext"), { recursive: true });
await cp(resolve(source, "assets"), resolve(output, "assets"), {
  recursive: true,
});

await writeFile(
  resolve(output, "server", "index.js"),
  'export { default } from "./opennext/worker.js";\nexport * from "./opennext/worker.js";\n',
);
