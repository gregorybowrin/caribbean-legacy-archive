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
    file: "bio_result_dr_myles_munroe.json",
    id: "6e9256ff-f513-4054-9a56-50f7a2a42df1",
    expectedName: "Dr. Myles Munroe"
  },
  {
    file: "bio_result_edward_wilmot_blyden.json",
    id: "caaca671-21db-43aa-89b8-fa10fe6f4fe0",
    expectedName: "Edward Wilmot Blyden"
  },
  {
    file: "bio_result_edwin_chippie_chipman.json",
    id: "cc32b9ea-1320-433f-8746-34e61cbc7872",
    expectedName: "Edwin \"Chippie\" Chipman"
  },
  {
    file: "bio_result_ernestine_lambot.json",
    id: "7829f94e-e04d-4700-942a-3b28ca938f93",
    expectedName: "Ernestine Lambot"
  },
  {
    file: "bio_result_ethelyn_smith.json",
    id: "03da3e7c-d073-4f25-9ecf-7ff0a9d8f5f7",
    expectedName: "Ethelyn Smith"
  }
];

async function run() {
  console.log("Starting Batch 27 ingestion...");
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

  console.log("\nAll 5 figures in Batch 27 successfully ingested into Supabase!");
}

run();
