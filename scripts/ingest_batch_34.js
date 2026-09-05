// ingest_batch_34.js
// Batch 34: Paul Adderley, Paul Lebailly, Rev. Claude Francis, Ruby Ann Darling, Sir Albert Miller
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
    id: "ec0dc762-0e67-4392-96ce-8cb241afadc2",
    name: "Paul Adderley",
    file: "bio_result_paul_adderley.json",
  },
  {
    id: "1aea5783-f905-4784-8e7e-629be0481584",
    name: "Paul Lebailly",
    file: "bio_result_paul_lebailly.json",
  },
  {
    id: "97d03262-4862-4084-9c31-0350db35dc6e",
    name: "Rev. Claude Francis",
    file: "bio_result_rev_claude_francis.json",
  },
  {
    id: "269974b2-7181-481a-b9f3-835acfc44fd6",
    name: "Ruby Ann Darling",
    file: "bio_result_ruby_ann_darling.json",
  },
  {
    id: "7d15622c-38b9-42f7-a5cf-f62c231d82f4",
    name: "Sir Albert Miller",
    file: "bio_result_sir_albert_miller.json",
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
  console.log("\nBatch 34 ingestion complete.");
}

ingest();
