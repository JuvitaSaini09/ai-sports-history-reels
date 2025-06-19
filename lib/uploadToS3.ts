// lib/uploadToS3.ts
import fs from "fs";
import axios from "axios";
import FormData from "form-data";

// Update the return type to include both fields
export async function uploadToS3(localPath: string): Promise<{
  publicUrl: string;
  urls: string[]; // always return as array for consistency
}> {
  const fileStream = fs.createReadStream(localPath);
  const form = new FormData();
  form.append("file", fileStream);

  try {
    const res = await axios.post(
      "https://property-manager.myduomo.com/getSignUrlForUpload",
      form,
      {
        headers: {
          ...form.getHeaders(),
        },
      }
    );

    if (!res.data || !res.data.publicUrl) {
      throw new Error("Invalid S3 upload response");
    }

    console.log("📤 S3 upload public url:", res.data.publicUrl);
    console.log("📤 S3 upload urls:", res.data.urls);

    // Normalize urls to always be an array
    let urls: string[] = [];

    if (res.data.urls) {
      if (Array.isArray(res.data.urls)) {
        urls = res.data.urls;
      } else if (typeof res.data.urls === "string") {
        urls = [res.data.urls];
      }
    }

    return {
      publicUrl: res.data.publicUrl,
      urls,
    };
  } catch (err: any) {
    console.error("❌ Failed to upload video to S3:", err.message);
    throw err;
  }
}
