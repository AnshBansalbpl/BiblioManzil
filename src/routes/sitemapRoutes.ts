import express from "express";
import { Blog, Summary } from "../models/Schemas";

const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
  try {
    const blogs = await Blog.find().select("slug createdAt updatedAt");
    const summaries = await Summary.find().select("_id createdAt updatedAt");

    const baseUrl = "https://biblio-manzil.vercel.app";

    let urls: string[] = [];

    /* =============================
       STATIC PAGES (IMPORTANT)
    ============================== */

    urls.push(`
      <url>
        <loc>${baseUrl}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
    `);

    urls.push(`
      <url>
        <loc>${baseUrl}/blogs</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
    `);

    urls.push(`
      <url>
        <loc>${baseUrl}/summaries</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
      </url>
    `);

    urls.push(`
      <url>
        <loc>${baseUrl}/library</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
    `);

    /* =============================
       BLOGS
    ============================== */

    blogs.forEach((blog) => {
      let lastmod = blog.updatedAt || blog.createdAt;

      if (!lastmod || isNaN(new Date(lastmod).getTime())) {
        lastmod = new Date();
      }

      urls.push(`
        <url>
          <loc>${baseUrl}/blog/${blog.slug}</loc>
          <lastmod>${new Date(lastmod).toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `);
    });

    /* =============================
       SUMMARIES
    ============================== */

    summaries.forEach((summary) => {
      let lastmod = summary.updatedAt || summary.createdAt;

      if (!lastmod || isNaN(new Date(lastmod).getTime())) {
        lastmod = new Date();
      }

      urls.push(`
        <url>
          <loc>${baseUrl}/summary/${summary._id.toString()}</loc>
          <lastmod>${new Date(lastmod).toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.7</priority>
        </url>
      `);
    });

    /* =============================
       FINAL XML
    ============================== */

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);

  } catch (error) {
    console.error("❌ Sitemap error:", error);
    res.status(500).send("Error generating sitemap");
  }
});

export default router;