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
    file: "bio_result_kim_collins.json",
    id: "c84723b5-9f97-4d33-9ee0-15e5c9acb8ba",
    expectedName: "Kim Collins"
  },
  {
    file: "bio_result_lw_young.json",
    id: "840fb375-d957-4bbb-80cd-c75aa8af220a",
    expectedName: "L.W. Young"
  },
  {
    file: "bio_result_leona_gabriel.json",
    id: "669c2472-5e6f-46dc-9d9b-18a4af22b5a9",
    expectedName: "Léona Gabriel"
  },
  {
    file: "bio_result_louis_auguste_cyparis.json",
    id: "dd1c10e7-8210-446f-863d-5864ea9ded29",
    expectedName: "Louis-Auguste Cyparis"
  },
  {
    file: "bio_result_luis_munoz_marin.json",
    id: "f548e75a-2909-4ae3-aec1-9c50e640c1a4",
    expectedName: "Luis Muñoz Marín"
  }
];

async function run() {
  console.log("Starting Batch 31 ingestion...");
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
  console.log("\nBatch 31 ingestion complete!");
}

run().catch(console.error);
