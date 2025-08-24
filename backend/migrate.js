import mongoose from "mongoose";
import {Plant} from "./src/models/plant.model.js"; // adjust path
import { uploadOnCloudinary } from "./src/utils/cloudinary.js"; // adjust path
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const MONGO_URI = "mongodb+srv://kumarmanishfbc:Indudive0@cluster0.re3rp4w.mongodb.net/Urvann"; // your DB connection string

const migrateImages = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to database");

    const plants = await Plant.find({});
    console.log("this is ",plants);
    console.log(`🌱 Found ${plants.length} plants`);

   for (const plant of plants) {
  if (plant.imageUrl && !plant.imageUrl.startsWith("http")) {
    const localPath = path.join("public", "temp", path.basename(plant.imageUrl));

    console.log(`Uploading ${plant.name}: ${localPath}`);

    const cloudUrl = await uploadOnCloudinary(localPath);
    if (cloudUrl) {
      plant.imageUrl = cloudUrl;
      await plant.save();
      console.log(`✅ Updated ${plant.name} with Cloudinary URL`);
    } else {
      console.log(`⚠️ Failed to upload ${plant.name}`);
    }
  } else {
    console.log(`${plant.name} already has Cloudinary URL`);
  }
}


    console.log("🎉 Migration completed");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateImages();
