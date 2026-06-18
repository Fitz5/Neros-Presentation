import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { deck } from "../deck/content";
import { writeDeckToPptx } from "./pptx";

const tmpFiles: string[] = [];

afterEach(async () => {
  await Promise.all(
    tmpFiles.map((file) =>
      fs.rm(file, { force: true }).catch(() => {
        return undefined;
      }),
    ),
  );
  tmpFiles.length = 0;
});

describe("writeDeckToPptx", () => {
  it("writes a non-empty pptx file", async () => {
    const outFile = path.join(os.tmpdir(), `neros-test-${Date.now()}.pptx`);
    tmpFiles.push(outFile);

    await writeDeckToPptx(deck, outFile);

    const stat = await fs.stat(outFile);
    expect(stat.size).toBeGreaterThan(1000);
  });
});
