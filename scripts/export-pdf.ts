import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { preview } from "vite";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Output path: first CLI arg, else dist/ (mirrors the .pptx export location).
const outFile = path.resolve(
  rootDir,
  process.argv[2] ?? path.join("dist", "neros-technical-interview.pdf"),
);

// Locate a Chromium-family browser for headless "print to PDF".
function findChrome(): string {
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter((candidate): candidate is string => Boolean(candidate));

  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    throw new Error(
      "Could not find Chrome/Edge. Set CHROME_PATH to the browser executable.",
    );
  }
  return found;
}

async function main() {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });

  // Serve the already-built deck (dist/preview, per vite.config). Port 0 lets the
  // OS pick a free port so repeated runs never collide with a stale server.
  const server = await preview({
    preview: { host: "127.0.0.1", port: 0 },
  });

  const baseUrl = server.resolvedUrls?.local[0];
  if (!baseUrl) {
    throw new Error("Preview server did not report a local URL.");
  }
  const printUrl = `${baseUrl.replace(/\/$/, "")}/?print`;
  const chrome = findChrome();

  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      chrome,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        // Give React time to mount and every screenshot/image to load.
        "--virtual-time-budget=20000",
        `--print-to-pdf=${outFile}`,
        printUrl,
      ],
      { stdio: "ignore" },
    );
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`Chrome exited with code ${code}`)),
    );
  });

  await server.httpServer.close();
  console.log(`Wrote ${path.relative(rootDir, outFile)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
