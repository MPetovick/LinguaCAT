import fetch from "node-fetch";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const { word } = req.query;
  if (!word) {
    return res.status(400).json({ error: "Falta la paraula a buscar" });
  }

  try {
    // URL directa a l’entrada
    const url = `https://dlc.iec.cat/entrada/${encodeURIComponent(word)}`;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const data = {
      word,
      phonetic: "",
      grammatical: "",
      definitions: [],
      examples: []
    };

    // Lema (nom de l’entrada)
    const lema = $(".df .dfh").first().text().trim();
    if (lema) data.word = lema;

    // Categoria gramatical
    const gram = $(".df .ps").first().text().trim();
    if (gram) data.grammatical = gram;

    // Definicions
    $(".df .d").each((_, el) => {
      const def = $(el).text().replace(/\s+/g, " ").trim();
      if (def) data.definitions.push(def);
    });

    // Exemples
    $(".ex").each((_, el) => {
      const ex = $(el).text().replace(/\s+/g, " ").trim();
      if (ex) data.examples.push(ex);
    });

    if (data.definitions.length === 0) {
      return res.status(404).json({ error: `No s'han trobat resultats per a "${word}"` });
    }

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.json(data);
  } catch (err) {
    console.error("Error consultant IEC:", err);
    res.status(500).json({ error: "Error consultant el IEC" });
  }
}