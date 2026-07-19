import * as cheerio from "cheerio";

export default async function handler(req: any, res: any) {
  // CORS Headers (optional, but good for Vercel)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    const html = await response.text();
    const $ = cheerio.load(html);

    let title =
      $("#productTitle").text().trim() ||
      $('meta[property="og:title"]').attr("content") ||
      $("title").text() ||
      "Unbekanntes Produkt";

    let imageUrl =
      $("#landingImage").attr("data-old-hires") ||
      $("#landingImage").attr("src") ||
      $('img[data-old-hires]').attr('data-old-hires') ||
      $('img[data-old-hires]').attr('src') ||
      $('meta[property="og:image"]').attr("content") ||
      "https://images.unsplash.com/photo-1599643478514-4a4e09b52342?auto=format&fit=crop&q=80&w=800";

    // Clean Amazon image URL to get the highest resolution version
    if (imageUrl && (imageUrl.includes('amazon') || imageUrl.includes('media-amazon'))) {
        imageUrl = imageUrl.replace(/\._[A-zA-Z0-9_,-]+_\./, '.');
    }

    let price =
      $(".a-price .a-offscreen").first().text().trim() ||
      $(".a-price-whole").first().text().trim() + "," + $(".a-price-fraction").first().text().trim() + " €" ||
      "";
      
    if (price === " €" || !price) {
        price = "ab 19,99 €";
    }

    let description =
      $("#feature-bullets ul li span").first().text().trim() ||
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "Hochwertiges Schmuckstück.";

    return res.status(200).json({
      title,
      imageUrl,
      price,
      description,
    });
  } catch (error: any) {
    console.error("Extraction error:", error);
    return res.status(500).json({ error: "Failed to extract metadata: " + error.message });
  }
}
