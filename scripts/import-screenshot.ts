import fs from "node:fs/promises";
import path from "node:path";

const sourceArg = process.argv[2];
const nameArg = process.argv[3] ?? "demo-screenshot";

if (!sourceArg) {
  throw new Error("Usage: npm run import:screenshot -- <source-path> [output-name]");
}

const sourcePath = path.resolve(sourceArg);
const extension = path.extname(sourcePath).toLowerCase();
const supportedExtensions = new Set([".png", ".jpg", ".jpeg"]);

if (!supportedExtensions.has(extension)) {
  throw new Error("Screenshots must be .png, .jpg, or .jpeg for reliable PPTX export.");
}

const safeName = nameArg
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

if (!safeName) {
  throw new Error("Output name must contain at least one letter or number.");
}

const outputDir = path.resolve("public", "screenshots");
const outputPath = path.join(outputDir, `${safeName}${extension}`);

await fs.mkdir(outputDir, { recursive: true });
await fs.copyFile(sourcePath, outputPath);

console.log(`Imported screenshot: ${path.relative(process.cwd(), outputPath)}`);
