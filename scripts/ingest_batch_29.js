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
    file: "bio_result_hubert_ingraham.json",
    id: "1c2afffb-4573-43f6-8d40-ce25ed48b87b",
    expectedName: "Hubert Ingraham"
  },
  {
    file: "bio_result_hubert_rolle.json",
    id: "24ef47d3-29ab-4bdb-94b8-979ada51059a",
    expectedName: "Hubert Rolle"
  },
  {
    file: "bio_result_ignace.json",
    id: "3784cfe4-a0e3-4c55-a3e5-9fcd50955a18",
    expectedName: "Ignace"
  },
  {
    file: "bio_result_ira_dore.json",
    id: "d82001c4-05ec-4133-bf67-e1f77ce4a399",
    expectedName: "Ira Dore"
  },
  {
    file: "bio_result_ira_glass.json",
    id: "3dd8c5de-ade7-4c17-b10c-7e884ad52466",
    expectedName: "Ira Glass"
  }
];

async function run() {
  console.log("Starting Batch 29 ingestion...");
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

    const { error } = await supabase
      .from("figures")
      .update(updatePayload)
      .eq("id", t.id);

    if (error) {
      console.error(`  Error updating ${t.expectedName}:`, error);
      process.exit(1);
    } else {
      console.log(`  Successfully updated ${t.expectedName} in Supabase!`);
    }
  }

  console.log("\nAll 5 figures in Batch 29 successfully ingested into Supabase!");
}

run();
