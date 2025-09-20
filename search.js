// api/search.js
import fetch from "node-fetch";
import * as cheerio from "cheerio";

export default async function handler(req, res) {
  const { word } = req.query;
  if (!word) {
    return res.status(400).json({ error: "Falta la paraula a buscar" });
  }

  try {
    const url = `https://dlc.iec.cat/results.asp?txtEntrada=${encodeURIComponent(word)}`;
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const data = {
      word,
      phonetic: "",
      grammatical: "",
      definitions: [],
      examples: [],
      synonyms: [],
      antonyms: []
    };

    // Lemma
    const wordTitle = $(".entry .lemma").first().text().trim();
    if (wordTitle) data.word = wordTitle;

    // Categoria gramatical
    const gram = $(".entry .gramcat").first().text().trim();
    if (gram) data.grammatical = gram;

    // Fonètica
    const phon = $(".entry .phon").first().text().trim();
    if (phon) data.phonetic = phon;

    // Definicions
    $(".entry .definition").each((_, el) => {
      const def = $(el).text().replace(/\s+/g, " ").trim();
      if (def) data.definitions.push(def);
    });

    // Exemples
    $(".entry .example").each((_, el) => {
      const ex = $(el).text().replace(/\s+/g, " ").trim();
      if (ex) data.examples.push(ex);
    });

    // Sinònims
    $(".entry .synonyms a").each((_, el) => {
      const syn = $(el).text().trim();
      if (syn) data.synonyms.push(syn);
    });

    // Antònims
    $(".entry .antonyms a").each((_, el) => {
      const ant = $(el).text().trim();
      if (ant) data.antonyms.push(ant);
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
