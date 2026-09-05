// ingest_batch_33.js
// Batch 33: Maurice Moore, René Ménil, Rev. Dr. Philip Rahming, Sir Arthur Foulkes, Sir Charles Carter
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
  {
    id: "615f113a-5820-4bbb-9438-698355a2ceef",
    name: "Maurice Moore",
    file: "bio_result_maurice_moore.json",
  },
  {
    id: "85b7f182-8722-46cd-9cd4-134a3ab59b76",
    name: "René Ménil",
    file: "bio_result_rene_menil.json",
  },
  {
    id: "938617d4-5549-4372-ad13-95d4c4c22a96",
    name: "Rev. Dr. Philip Rahming",
    file: "bio_result_rev_dr_philip_rahming.json",
  },
  {
    id: "e14f0f38-2e90-421a-bd81-0d7539db8c3b",
    name: "Sir Arthur Foulkes",
    file: "bio_result_sir_arthur_foulkes.json",
  },
  {
    id: "2a08d1e5-2cf0-4ca5-9ce0-d956d39ebff0",
    name: "Sir Charles Carter",
    file: "bio_result_sir_charles_carter.json",
  }
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
  console.log("\nBatch 33 ingestion complete.");
}

ingest();
