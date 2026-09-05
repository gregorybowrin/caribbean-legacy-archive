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
    file: "bio_result_dame_marguerite_pindling.json",
    id: "280483d1-4699-4a2f-96c4-c0b5ed2a7922",
    expectedName: "Dame Marguerite Pindling"
  },
  {
    file: "bio_result_danyel_bebel_gisler.json",
    id: "fad9ac7b-0145-4c67-8612-06f0eb951816",
    expectedName: "Danyel Bébel-Gisler"
  },
  {
    file: "bio_result_denton_j_snider.json",
    id: "4be270d3-c722-48ef-8a68-2de3363b56aa",
    expectedName: "Denton J. Snider"
  },
  {
    file: "bio_result_dr_jean_baptiste_rene_poutu.json",
    id: "720b6b80-9764-4554-b583-c61043246804",
    expectedName: "Dr. Jean-Baptiste-René Poutu"
  },
  {
    file: "bio_result_dr_john_rawlins.json",
    id: "a1ebedfd-ec27-458d-b37c-b3096bef6fab",
    expectedName: "Dr. John Rawlins"
  }
];

async function run() {
  console.log("Starting Batch 26 ingestion...");
  for (const t of targets) {
    const raw = fs.readFileSync(`${scratchDir}/${t.file}`, "utf-8");
    const json = JSON.parse(raw);
    const item = Array.isArray(json) ? json[0] : json;

    console.log(`\nProcessing ${t.expectedName} (ID: ${t.id})...`);
    console.log(`  Bio word count: ${item.bio.split(/\s+/).length}`);
    console.log(`  Contributions word count: ${item.contributions.split(/\s+/).length}`);

    let fullBio = item.bio;
    if (item.sources && item.sources.length > 0 && !fullBio.includes("### References") && !fullBio.includes("### Sources")) {
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

  console.log("\nAll 5 figures in Batch 26 successfully ingested into Supabase!");
}

run();
