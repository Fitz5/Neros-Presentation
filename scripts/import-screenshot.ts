import fs from "node:fs/promises";
import path from "node:path";

const sourceArg = process.argv[2];
const nameArg = process.argv[3];
const force = process.argv.includes("--force");

if (!sourceArg) {
  throw new Error(
    "Usage: npm run import:screenshot -- <source-path> [output-name] [--force]",
  );
}

const sourcePath = path.resolve(sourceArg);
const extension = path.extname(sourcePath).toLowerCase();
const supportedExtensions = new Set([".png", ".jpg", ".jpeg"]);

if (!supportedExtensions.has(extension)) {
  throw new Error("Screenshots must be .png, .jpg, or .jpeg for reliable PPTX export.");
}

const requestedName = nameArg && nameArg !== "--force" ? nameArg : path.parse(sourcePath).name;
const safeName = requestedName
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

if (!safeName) {
  throw new Error("Output name must contain at least one letter or number.");
}

const outputDir = path.resolve("public", "screenshots", "deck");
const outputPath = path.join(outputDir, `${safeName}${extension}`);

await fs.mkdir(outputDir, { recursive: true });

if (!force) {
  try {
    await fs.access(outputPath);
    throw new Error(
      `Screenshot already exists: ${path.relative(process.cwd(), outputPath)}. Use --force to replace it.`,
    );
  } catch (error) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") {
      throw error;
    }
  }
}

await fs.copyFile(sourcePath, outputPath);

console.log(`Imported screenshot: ${path.relative(process.cwd(), outputPath)}`);
