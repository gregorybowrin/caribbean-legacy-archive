// ingest_batch_37.js
// Final Batch 37: Thomas Pringle, Tubal Uriah Butler, Victor Depaz, Wallace Groves, William Pa Albury, Wyannie Malone
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SCRATCH_DIR = "/Users/gregorybowrin/.gemini/antigravity/brain/055dde10-d09b-445c-9978-f16aec3d0f5a/scratch";

const targets = [
  { id: "da04b7c0-c5e8-4f05-8ac7-fd7c9cbd1490", name: "Thomas Pringle", file: "bio_result_thomas_pringle.json" },
  { id: "d68d8b4e-52bf-480c-a4c2-82208bbc6ca6", name: "Tubal Uriah Butler", file: "bio_result_tubal_uriah_butler.json" },
  { id: "2b72e596-e26b-44b8-b69e-930106e3e017", name: "Victor Depaz", file: "bio_result_victor_depaz.json" },
  { id: "958b3df3-f9f9-4eed-8f88-10cfc65a560e", name: "Wallace Groves", file: "bio_result_wallace_groves.json" },
  { id: "c8e14441-0737-46dc-bb9e-4e0c1daec7cf", name: "William Pa Albury", file: "bio_result_william_pa_albury.json" },
  { id: "cb6748b3-150f-4419-a1c4-e5c435c540fe", name: "Wyannie Malone", file: "bio_result_wyannie_malone.json" }
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
  console.log("\nBatch 37 ingestion complete.");
}

ingest();
