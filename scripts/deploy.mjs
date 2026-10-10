// Builds the static site and publishes it to the gh-pages branch (GitHub Pages serves that branch).
import { execSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REPO = process.env.DEPLOY_REPO ?? "septeamone/auto-import-demo";
const BASE = "/" + REPO.split("/")[1];
const URL = `https://${REPO.split("/")[0]}.github.io${BASE}/`;
const run = (cmd, opts = {}) => execSync(cmd, { stdio: "inherit", ...opts });

run("npm run build", { env: { ...process.env, NEXT_PUBLIC_BASE_PATH: BASE, NEXT_PUBLIC_SITE_URL: URL } });
if (!existsSync("out")) throw new Error("out/ was not created");

const dir = mkdtempSync(join(tmpdir(), "pages-"));
cpSync("out", dir, { recursive: true });
writeFileSync(join(dir, ".nojekyll"), "");
const git = (a) => run(`git ${a}`, { cwd: dir });
git("init -q -b gh-pages");
git("add -A");
git('-c user.name="septeamone" -c user.email="stoneregunpa87@gmail.com" commit -q -m "Deploy"');
git(`push -f https://github.com/${REPO}.git gh-pages`);
rmSync(dir, { recursive: true, force: true });
console.log("\nPublished:", URL);
