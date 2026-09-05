// ingest_batch_35.js
// Batch 35: Sir Durward Knowles, Sir Etienne Dupuch, Sir Gerald Cash, Sir John Mordecai, Sir Orville Turnquest
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
    id: "4c0c4926-4101-408b-bf97-4aa61722bc14",
    name: "Sir Durward Knowles",
    file: "bio_result_sir_durward_knowles.json",
  },
  {
    id: "51c44e93-cb2e-4180-a212-f116e8e43334",
    name: "Sir Etienne Dupuch",
    file: "bio_result_sir_etienne_dupuch.json",
  },
  {
    id: "16a03733-28d0-4099-8d5f-760d4a01c9b5",
    name: "Sir Gerald Cash",
    file: "bio_result_sir_gerald_cash.json",
  },
  {
    id: "0f0ec637-8e43-451f-90ed-36bb311dcbf5",
    name: "Sir John Mordecai",
    file: "bio_result_sir_john_mordecai.json",
  },
  {
    id: "7eb22eea-ee23-49a5-be5b-a5c0c9949ef8",
    name: "Sir Orville Turnquest",
    file: "bio_result_sir_orville_turnquest.json",
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
  console.log("\nBatch 35 ingestion complete.");
}

ingest();
