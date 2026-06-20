import fs from "node:fs/promises";
import path from "node:path";
import { deck } from "../src/deck/content";
import { validateDeck } from "../src/deck/schema";

const archiveRoot = path.resolve("sources", "discord-convo");
const manifestPath = path.join(archiveRoot, "notes", "asset_manifest.csv");
const manifestText = await fs.readFile(manifestPath, "utf8");
const rows = parseCsv(manifestText);
const errors: string[] = [];
const listedPaths = new Set<string>();
const deckAssetPaths = new Set<string>();

for (const [index, row] of rows.entries()) {
  const line = index + 2;
  const type = row.Type;
  const finalPath = row.FinalPath?.replaceAll("\\", "/");

  if (!type || !finalPath) {
    errors.push(`Manifest line ${line} is missing Type or FinalPath.`);
    continue;
  }

  if (listedPaths.has(finalPath)) {
    errors.push(`Manifest line ${line} duplicates ${finalPath}.`);
    continue;
  }
  listedPaths.add(finalPath);

  const expectedPrefix =
    type === "image" ? "images/renamed/" : type === "log" ? "logs/" : undefined;
  if (!expectedPrefix) {
    errors.push(`Manifest line ${line} has unsupported type "${type}".`);
  } else if (!finalPath.startsWith(expectedPrefix)) {
    errors.push(
      `Manifest line ${line} should place ${type} assets under ${expectedPrefix}.`,
    );
  }

  const absolutePath = path.resolve(archiveRoot, finalPath);
  if (!isInside(archiveRoot, absolutePath)) {
    errors.push(
      `Manifest line ${line} points outside the archive: ${finalPath}.`,
    );
    continue;
  }

  try {
    const stat = await fs.stat(absolutePath);
    if (!stat.isFile()) {
      errors.push(
        `Manifest line ${line} does not point to a file: ${finalPath}.`,
      );
    }
  } catch {
    errors.push(
      `Manifest line ${line} points to a missing file: ${finalPath}.`,
    );
  }
}

for (const relativeDir of ["images/renamed", "logs"]) {
  const directory = path.join(archiveRoot, relativeDir);
  const entries = await fs.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && entry.name !== ".gitkeep") {
      const relativePath = `${relativeDir}/${entry.name}`;
      if (!listedPaths.has(relativePath)) {
        errors.push(
          `Archived asset is missing from the manifest: ${relativePath}.`,
        );
      }
    }
  }
}

const validatedDeck = validateDeck(deck);
for (const slide of validatedDeck.slides) {
  for (const block of slide.blocks) {
    if (block.type !== "image") continue;

    const publicPath = block.src.startsWith("/")
      ? block.src.slice(1)
      : block.src;
    const absolutePath = path.resolve("public", publicPath);
    if (!isInside(path.resolve("public"), absolutePath)) {
      errors.push(
        `Slide "${slide.id}" references an asset outside public/: ${block.src}.`,
      );
      continue;
    }

    deckAssetPaths.add(publicPath);
    try {
      const stat = await fs.stat(absolutePath);
      if (!stat.isFile()) {
        errors.push(`Slide "${slide.id}" asset is not a file: ${block.src}.`);
      }
    } catch {
      errors.push(
        `Slide "${slide.id}" references a missing asset: ${block.src}.`,
      );
    }
  }
}

if (errors.length > 0) {
  throw new Error(errors.join("\n"));
}

const imageCount = rows.filter((row) => row.Type === "image").length;
const logCount = rows.filter((row) => row.Type === "log").length;
console.log(
  `Asset archive is valid: ${imageCount} renamed images, ${logCount} logs.`,
);
console.log(
  `Deck assets are valid: ${deckAssetPaths.size} referenced public files.`,
);

function isInside(parent: string, child: string) {
  const relative = path.relative(parent, child);
  return (
    relative.length > 0 &&
    !relative.startsWith("..") &&
    !path.isAbsolute(relative)
  );
}

function parseCsv(input: string) {
  const records: string[][] = [];
  let record: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];

    if (quoted) {
      if (char === '"' && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      record.push(field);
      field = "";
    } else if (char === "\n") {
      record.push(field);
      records.push(record);
      record = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (quoted) {
    throw new Error("Asset manifest contains an unterminated quoted field.");
  }

  if (field.length > 0 || record.length > 0) {
    record.push(field);
    records.push(record);
  }

  const [headers, ...data] = records;
  if (!headers) {
    throw new Error("Asset manifest is empty.");
  }

  return data
    .filter((values) => values.some((value) => value.length > 0))
    .map((values) =>
      Object.fromEntries(
        headers.map((header, index) => [header, values[index] ?? ""]),
      ),
    );
}
