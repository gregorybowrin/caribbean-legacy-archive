const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const scratchDir = "/Users/gregorybowrin/.gemini/antigravity/brain/055dde10-d09b-445c-9978-f16aec3d0f5a/scratch";

const targets = [
  {
    file: "bio_result_jamaica_kincaid.json",
    id: "f3a59da2-986f-4c48-aa11-5b167c0fa159",
    expectedName: "Jamaica Kincaid"
  },
  {
    file: "bio_result_james_jim_richards.json",
    id: "bac85efc-dbec-43eb-bb4d-0936f4034bc0",
    expectedName: "James \"Jim\" Richards"
  },
  {
    file: "bio_result_jean_jacques_dessalines.json",
    id: "fab9a321-61ca-40d8-9d7e-a1f339dff671",
    expectedName: "Jean-Jacques Dessalines"
  },
  {
    file: "bio_result_jean_luc_raharimanana.json",
    id: "5dca2773-7312-4560-8f32-f4467881a029",
    expectedName: "Jean-Luc Raharimanana"
  },
  {
    file: "bio_result_jose_marti.json",
    id: "75532431-c63d-4126-be6f-08b07a35f7ed",
    expectedName: "José Martí"
  }
];

async function run() {
  console.log("Starting Batch 30 ingestion...");
  for (const t of targets) {
    const raw = fs.readFileSync(`${scratchDir}/${t.file}`, "utf-8");
    const json = JSON.parse(raw);
    const item = Array.isArray(json) ? json[0] : json;

    console.log(`\nProcessing ${t.expectedName} (ID: ${t.id})...`);
    console.log(`  Bio word count: ${item.bio.split(/\s+/).length}`);
    console.log(`  Contributions word count: ${item.contributions.split(/\s+/).length}`);

    let fullBio = item.bio;
    if (item.sources && item.sources.length > 0 && !fullBio.includes("### References") && !fullBio.includes("### Sources") && !fullBio.includes("## References")) {
      fullBio += "\n\n### References\n" + item.sources.map(s => `- [${s.title}](${s.url})`).join("\n");
    }

    const updatePayload = {
      bio: fullBio,
      contributions: item.contributions
    };

    const { data, error } = await supabase
      .from("figures")
      .update(updatePayload)
      .eq("id", t.id)
      .select("id, name, bio, contributions");

    if (error) {
      console.error(`  ERROR updating ${t.expectedName}:`, error);
    } else if (!data || data.length === 0) {
      console.warn(`  WARNING: No record updated for ${t.expectedName} (ID: ${t.id})`);
    } else {
      console.log(`  SUCCESS: Updated ${data[0].name} (Bio length: ${data[0].bio.length} chars)`);
    }
  }
  console.log("\nBatch 30 ingestion complete!");
}

run().catch(console.error);
