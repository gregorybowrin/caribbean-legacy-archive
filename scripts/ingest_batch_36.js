// ingest_batch_36.js
// Batch 36: Sister Annie, Squire Rolle, Sugar Adams, Telzena Coakley, Terrence B Lettsome
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
    id: "fb457176-ac6b-42f3-a954-08312edeec93",
    name: "Sister Annie",
    file: "bio_result_sister_annie.json",
  },
  {
    id: "66b33927-efce-4f29-9950-843604fb7d93",
    name: "Squire Rolle",
    file: "bio_result_squire_rolle.json",
  },
  {
    id: "449e6aa8-7770-4cbc-ab7e-8d1f4591f45d",
    name: "Sugar Adams",
    file: "bio_result_sugar_adams.json",
  },
  {
    id: "37bb6b41-ac75-4232-9db4-ac310516dfab",
    name: "Telzena Coakley",
    file: "bio_result_telzena_coakley.json",
  },
  {
    id: "8f651380-6918-43c8-8355-a0d54af5414b",
    name: "Terrence B Lettsome",
    file: "bio_result_terrence_lettsome.json",
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
  console.log("\nBatch 36 ingestion complete.");
}

ingest();
