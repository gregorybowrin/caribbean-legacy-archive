const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateImage() {
  const { error } = await supabase
    .from("figures")
    .update({ 
      image_url: "https://www.historicstkitts.kn/images/thomas-manchester.jpg",
      image_source_url: "https://www.historicstkitts.kn/people/thomas-manchester"
    })
    .eq("id", "e790f2ef-bb5d-488e-936f-e96de378e46e");

  if (error) {
    console.error("ERROR updating image:", error.message);
  } else {
    console.log("✓ Updated image successfully");
  }
}

updateImage();
