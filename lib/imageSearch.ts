import { getJson } from "serpapi";

export async function searchImages(query: string): Promise<string[]> {
  const apiKey = process.env.SERPAPI_KEY!;

  return new Promise((resolve, reject) => {
    getJson(
      {
        api_key: apiKey,
        engine: "bing_images",
        q: query,
        device: "desktop",
      },
      (json) => {
        if (json.error) {
          return reject(json.error);
        }

        const imageUrls = (json.images_results || [])
          .map((img: any) => img.original || img.thumbnail || img.link)
          .filter(Boolean);

        resolve(imageUrls.slice(0, 20)); // return top 20 images
      }
    );
  });
}
