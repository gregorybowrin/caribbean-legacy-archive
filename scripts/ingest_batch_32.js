// ingest_batch_32.js
// Batch 32: Marius Hurard, Matías Ramón Mella, Norman Manley, Pompey, Robert Llewellyn Bradshaw
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SCRATCH_DIR =
  "/Users/gregorybowrin/.gemini/antigravity/brain/055dde10-d09b-445c-9978-f16aec3d0f5a/scratch";

const targets = [
  {
    id: "82216071-30c4-4a58-816a-d6d4c5e4e171",
    name: "Marius Hurard",
    file: "bio_result_marius_hurard.json",
  },
  {
    id: "8d284be2-2dcd-4be9-8c51-246c2868e81d",
    name: "Matías Ramón Mella",
    file: "bio_result_matias_ramon_mella.json",
  },
  {
    id: "8532a30b-3ff3-4f60-add7-d6fbc0d1c8c8",
    name: "Norman Manley",
    file: "bio_result_norman_manley.json",
  },
  {
    id: "90b88f0e-e781-420d-9865-5b86c161b700",
    name: "Pompey",
    file: "bio_result_pompey.json",
  },
  {
    id: "3b5fcb16-3366-4bc6-9f48-2e09e2555cb6",
    name: "Robert Llewellyn Bradshaw",
    file: "bio_result_robert_bradshaw.json",
  },
];

function buildBioWithReferences(data) {
  let bio = data.bio || "";
  if (!bio.includes("### References") && data.sources && data.sources.length > 0) {
    const refs = data.sources
      .map((s, i) => `${i + 1}. [${s.title}](${s.url})`)
      .join("\n");
    bio += `\n\n### References\n\n${refs}`;
  }
  return bio;
}

async function ingest() {
  for (const t of targets) {
    const filePath = path.join(SCRATCH_DIR, t.file);
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const data = raw[0];

    const bio = buildBioWithReferences(data);
    const contributions = data.contributions || "";

    console.log(`\nIngesting: ${t.name} (${bio.split(/\s+/).length} words)`);

    const { error } = await supabase
      .from("figures")
      .update({ bio, contributions })
      .eq("id", t.id);

    if (error) {
      console.error(`  ERROR updating ${t.name}:`, error.message);
    } else {
      console.log(`  ✓ Updated ${t.name} successfully`);
    }
  }
  console.log("\nBatch 32 ingestion complete.");
}

ingest();
