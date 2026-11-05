import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
const remote = "https://github.com/awelynx/awelynx.github.io.git";
const git = (args, cwd = process.cwd()) =>
  execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
const run = (command, args) =>
  execFileSync(command, args, { stdio: "inherit" });
if (git(["status", "--porcelain"]))
  throw new Error("Commit source changes before publishing.");
const source = git(["rev-parse", "HEAD"]);
const sourceRemote = git([
  "ls-remote",
  remote,
  "refs/heads/codex/root-site",
]).split(/\s/)[0];
if (source !== sourceRemote)
  throw new Error(
    "Push the exact reviewed source commit to codex/root-site first.",
  );
if (!process.argv.includes("--skip-build")) {
  run("npm", ["run", "build"]);
  run("npm", ["run", "verify:site"]);
}
const parent = git(["ls-remote", remote, "refs/heads/master"]).split(/\s/)[0];
git(["fetch", remote, "master"]);
const temp = await fs.mkdtemp(path.join(os.tmpdir(), "personal-site-publish-"));
let attached = false;
try {
  git(["worktree", "add", "--detach", temp, parent]);
  attached = true;
  git(["rm", "-r", "--ignore-unmatch", "--", "."], temp);
  for (const entry of await fs.readdir(temp))
    if (entry !== ".git")
      await fs.rm(path.join(temp, entry), { recursive: true, force: true });
  await fs.cp(path.resolve("build"), temp, { recursive: true });
  await fs.writeFile(
    path.join(temp, "README.md"),
    `# Yuxuan Lin\n\nPublished website: https://awelynx.github.io/\n\n[Website source, content and build instructions](https://github.com/awelynx/awelynx.github.io/tree/codex/root-site)\n\nThis branch contains generated GitHub Pages output. Source commit: ${source}.\n`,
  );
  await fs.writeFile(
    path.join(temp, "site-version.json"),
    JSON.stringify(
      { sourceCommit: source, publishedAt: new Date().toISOString() },
      null,
      2,
    ) + "\n",
  );
  git(["add", "-A"], temp);
  const tree = git(["write-tree"], temp);
  const commit = git(
    [
      "commit-tree",
      tree,
      "-p",
      parent,
      "-p",
      source,
      "-m",
      `Publish unified root website from ${source.slice(0, 12)}`,
    ],
    temp,
  );
  // Fast-forward only: another publisher's update must never be overwritten.
  run("git", ["push", remote, `${commit}:refs/heads/master`]);
  console.log(
    JSON.stringify(
      {
        url: "https://awelynx.github.io/",
        sourceCommit: source,
        publishCommit: commit,
      },
      null,
      2,
    ),
  );
} finally {
  if (attached) git(["worktree", "remove", "--force", temp]);
  await fs.rm(temp, { recursive: true, force: true });
}
