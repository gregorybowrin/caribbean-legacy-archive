const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SCRATCH_DIR = "/Users/gregorybowrin/.gemini/antigravity/brain/055dde10-d09b-445c-9978-f16aec3d0f5a/scratch";

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
  const filePath = path.join(SCRATCH_DIR, "bio_result_thomas_manchester.json");
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const data = raw[0];

  const bio = buildBioWithReferences(data);
  const contributions = data.contributions || "";

  console.log(`Ingesting: ${data.name} (${bio.split(/\s+/).length} words)`);

  const { error } = await supabase
    .from("figures")
    .update({ bio, contributions })
    .eq("id", "e790f2ef-bb5d-488e-936f-e96de378e46e");

  if (error) {
    console.error(`ERROR updating ${data.name}:`, error.message);
  } else {
    console.log(`✓ Updated ${data.name} successfully`);
  }
}

ingest();
