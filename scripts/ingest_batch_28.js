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
    file: "bio_result_franck_perret.json",
    id: "41b9ce49-dac4-44a2-8ea1-b70d31fcdae0",
    expectedName: "Franck Perret"
  },
  {
    file: "bio_result_franklyn_frankie_wilson.json",
    id: "c8e4dc06-0047-44d6-b8cf-b5b626814236",
    expectedName: "Franklyn \"Frankie\" Wilson"
  },
  {
    file: "bio_result_george_brizan.json",
    id: "cbfb17db-f483-4638-af50-e08c5f7ab334",
    expectedName: "George Brizan"
  },
  {
    file: "bio_result_gregorio_luperon.json",
    id: "490790da-0a56-4c94-a162-3a75fd225932",
    expectedName: "Gregorio Luperón"
  },
  {
    file: "bio_result_haziel_albury.json",
    id: "b574fad2-a77a-4d6c-8944-612ebc2f47c5",
    expectedName: "Haziel Albury"
  }
];

async function run() {
  console.log("Starting Batch 28 ingestion...");
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

  console.log("\nAll 5 figures in Batch 28 successfully ingested into Supabase!");
}

run();
