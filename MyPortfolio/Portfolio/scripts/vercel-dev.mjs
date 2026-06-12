import { existsSync, readFileSync } from "node:fs";
import { spawn } from "node:child_process";

const envFile = ".env.local";

if (existsSync(envFile)) {
  const lines = readFileSync(envFile, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim();

    if (key && value && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY was not found in the server environment.");
}

const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
const childEnv = Object.fromEntries(
  Object.entries(process.env).filter(([key, value]) => key && !key.startsWith("=") && value !== undefined),
);

const child = spawn(
  npxCommand,
  ["--yes", "vercel", "dev", "--listen", process.env.PORT || "3000", "--yes"],
  {
    env: childEnv,
    shell: process.platform === "win32",
    stdio: ["ignore", "pipe", "pipe"],
  },
);

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
