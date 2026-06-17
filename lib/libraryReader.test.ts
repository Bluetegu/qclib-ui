import { describe, it, expect, beforeAll, afterAll } from "vitest";
import fs from "fs";
import os from "os";
import path from "path";

// We test the pure helper functions by importing them via the module.
// To avoid needing QCLIB_DATA_ROOT for every import, we build a temp
// fixture directory and set the env var before loading the module.

let tmpDir: string;

beforeAll(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "qclib-test-"));

    // --- sources/QC/error-correction/paper-a.md ---
    const sourceDir = path.join(tmpDir, "sources", "QC", "error-correction");
    fs.mkdirSync(sourceDir, { recursive: true });
    fs.writeFileSync(
        path.join(sourceDir, "paper-a.md"),
        `---
pageType: source
title: Surface Code Thresholds
summary: Demonstrates threshold improvement using tailored surface codes.
authors:
  - Tuckett, D.
  - Bartlett, S.D.
year: 2019
subdomain: error-correction
tags:
  - surface-code
  - biased-noise
sourceUrl: https://example.com/paper
filedAt: "2026-01-10"
---

## Introduction

Some math: $E = mc^2$
`
    );

    // --- sources/QC/algorithms/paper-b.md (missing optional fields) ---
    const algoDir = path.join(tmpDir, "sources", "QC", "algorithms");
    fs.mkdirSync(algoDir, { recursive: true });
    fs.writeFileSync(
        path.join(algoDir, "paper-b.md"),
        `---
title: Quantum Advantage Overview
subdomain: algorithms
tags: [complexity]
filedAt: "2026-03-01"
---

Body content only.
`
    );

    // --- sources/QC/concepts/ should be SKIPPED ---
    const conceptsDir = path.join(tmpDir, "sources", "QC", "concepts");
    fs.mkdirSync(conceptsDir, { recursive: true });
    fs.writeFileSync(
        path.join(conceptsDir, "should-be-ignored.md"),
        `---
title: Internal Note
---
This file should not be indexed.
`
    );

    // --- syntheses/QC/rumination-hypothesis-x.md ---
    const synthesisDir = path.join(tmpDir, "syntheses", "QC");
    fs.mkdirSync(synthesisDir, { recursive: true });
    fs.writeFileSync(
        path.join(synthesisDir, "rumination-hypothesis-x.md"),
        `---
pageType: rumination
title: Rumination on X
summary: An interesting hypothesis.
hypothesis: Fault tolerance thresholds depend on noise topology.
status: active
themes:
  - error-correction
openQuestions:
  - Can this be tested on current hardware?
relatedSources:
    - 2026-05-22980-automatic-dequantization
tags: [rumination]
filedAt: "2026-06-01"
---

Body text.
`
    );

    // --- syntheses/QC/not-a-rumination.md should be SKIPPED ---
    fs.writeFileSync(
        path.join(synthesisDir, "not-a-rumination.md"),
        `---
title: This should not be picked up
---
`
    );

    process.env.QCLIB_DATA_ROOT = tmpDir;
});

afterAll(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    delete process.env.QCLIB_DATA_ROOT;
});

// Dynamic import so env var is set before the module resolves QCLIB_DATA_ROOT
async function getReader() {
    return await import("@/lib/libraryReader");
}

describe("readLibraryEntries", () => {
    it("returns one entry per valid source file", async () => {
        const { readLibraryEntries } = await getReader();
        const entries = readLibraryEntries();
        expect(entries).toHaveLength(2);
    });

    it("correctly parses frontmatter fields", async () => {
        const { readLibraryEntries } = await getReader();
        const entries = readLibraryEntries();
        const paperA = entries.find((e) => e.title === "Surface Code Thresholds");
        expect(paperA).toBeDefined();
        expect(paperA!.authors).toEqual(["Tuckett, D.", "Bartlett, S.D."]);
        expect(paperA!.year).toBe(2019);
        expect(paperA!.subdomain).toBe("error-correction");
        expect(paperA!.tags).toContain("surface-code");
        expect(paperA!.sourceUrl).toBe("https://example.com/paper");
        expect(paperA!.summary).toBe(
            "Demonstrates threshold improvement using tailored surface codes."
        );
    });

    it("handles files with missing optional fields gracefully", async () => {
        const { readLibraryEntries } = await getReader();
        const entries = readLibraryEntries();
        const paperB = entries.find((e) => e.title === "Quantum Advantage Overview");
        expect(paperB).toBeDefined();
        expect(paperB!.authors).toEqual([]);
        expect(paperB!.year).toBeNull();
        expect(paperB!.summary).toBe("");
        expect(paperB!.sourceUrl).toBeNull();
    });

    it("excludes files inside SKIP_DIRS (concepts/)", async () => {
        const { readLibraryEntries } = await getReader();
        const entries = readLibraryEntries();
        const skipped = entries.find((e) => e.title === "Internal Note");
        expect(skipped).toBeUndefined();
    });

    it("generates a URL-safe slug for each entry", async () => {
        const { readLibraryEntries } = await getReader();
        const entries = readLibraryEntries();
        for (const e of entries) {
            expect(e.slug).toMatch(/^[a-zA-Z0-9/_\-]+$/);
        }
    });
});

describe("readRuminations", () => {
    it("returns only rumination-*.md files", async () => {
        const { readRuminations } = await getReader();
        const ruminations = readRuminations();
        expect(ruminations).toHaveLength(1);
        expect(ruminations[0].title).toBe("Rumination on X");
    });

    it("parses rumination-specific fields", async () => {
        const { readRuminations } = await getReader();
        const [r] = readRuminations();
        expect(r.hypothesis).toBe("Fault tolerance thresholds depend on noise topology.");
        expect(r.status).toBe("active");
        expect(r.themes).toContain("error-correction");
        expect(r.openQuestions).toHaveLength(1);
    });

    it("defaults status to 'draft' for unknown values", async () => {
        const { readRuminations } = await getReader();
        // Write a fixture with an invalid status
        const synthesisDir = path.join(tmpDir, "syntheses", "QC");
        const file = path.join(synthesisDir, "rumination-bad-status.md");
        fs.writeFileSync(
            file,
            `---
pageType: rumination
title: Bad Status
status: unknown-value
filedAt: "2026-06-02"
---
`
        );
        const ruminations = readRuminations();
        const bad = ruminations.find((r) => r.title === "Bad Status");
        expect(bad?.status).toBe("draft");
        fs.unlinkSync(file);
    });

    it("maps legacy statuses to the new status set", async () => {
        const { readRuminations } = await getReader();
        const synthesisDir = path.join(tmpDir, "syntheses", "QC");
        const file = path.join(synthesisDir, "rumination-legacy-status.md");
        fs.writeFileSync(
            file,
            `---
pageType: rumination
title: Legacy Status
status: resolved
filedAt: "2026-06-03"
---
`
        );
        const ruminations = readRuminations();
        const legacy = ruminations.find((r) => r.title === "Legacy Status");
        expect(legacy?.status).toBe("validated");
        fs.unlinkSync(file);
    });
});

describe("readLibraryStats", () => {
    it("returns correct totals and bySubdomain counts", async () => {
        const { readLibraryStats } = await getReader();
        const stats = readLibraryStats();
        expect(stats.total).toBe(2);
        expect(stats.bySubdomain["error-correction"]).toBe(1);
        expect(stats.bySubdomain["algorithms"]).toBe(1);
    });

    it("includes up to 5 recent entries sorted by filedAt", async () => {
        const { readLibraryStats } = await getReader();
        const stats = readLibraryStats();
        expect(stats.recent.length).toBeGreaterThan(0);
        expect(stats.recent.length).toBeLessThanOrEqual(5);
        // Most recent first
        for (let i = 1; i < stats.recent.length; i++) {
            expect(stats.recent[i - 1].filedAt! >= stats.recent[i].filedAt!).toBe(true);
        }
    });
});
