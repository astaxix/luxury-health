import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as cheerio from "cheerio";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/extract", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const response = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
          "Accept-Language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        },
      });

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract Amazon specific or generic info
      let title =
        $("#productTitle").text().trim() ||
        $('meta[property="og:title"]').attr("content") ||
        $("title").text() ||
        "Unbekanntes Produkt";

      let imageUrl =
        $("#landingImage").attr("src") ||
        $('img[data-old-hires]').attr('src') ||
        $('meta[property="og:image"]').attr("content") ||
        "https://images.unsplash.com/photo-1599643478514-4a4e09b52342?auto=format&fit=crop&q=80&w=800";

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

      res.json({
        title,
        imageUrl,
        price,
        description,
      });
    } catch (error) {
      console.error("Extraction error:", error);
      res.status(500).json({ error: "Failed to extract metadata" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
