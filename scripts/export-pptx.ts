import path from "node:path";
import { fileURLToPath } from "node:url";
import { deck } from "../src/deck/content";
import { writeDeckToPptx } from "../src/export/pptx";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outFile = path.join(rootDir, "dist", "neros-technical-interview.pptx");

await writeDeckToPptx(deck, outFile);
console.log(`Wrote ${path.relative(rootDir, outFile)}`);
