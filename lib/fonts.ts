export interface FontPairing {
  id: string;
  label: string;
  category: "Classic & Timeless" | "Modern & Minimal" | "Romantic & Calligraphy" | "Luxury & Editorial" | "Rustic & Garden" | "Vintage" | "Best Free Fonts";
  headingFont: string;
  bodyFont: string;
  headingType?: "script" | "serif" | "modern";
  scaleAdjustment?: number;
  isPremium?: boolean;
  description: string;
}

export const FONT_PAIRINGS: FontPairing[] = [
  // Classic & Timeless
  {
    id: "cormorant_bickham",
    label: "Cormorant Garamond + Bickham Script Pro (Classic & Timeless - Recommended)",
    category: "Classic & Timeless",
    headingFont: "'Bickham Script Pro', 'Pinyon Script', 'Italianno', 'Great Vibes', cursive",
    bodyFont: "'Cormorant Garamond', 'Garamond', serif",
    headingType: "script",
    scaleAdjustment: 1.25,
    isPremium: true,
    description: "Luxurious calligraphy paired with a sophisticated serif with a high-end feel (Strongest timeless combination)."
  },
  {
    id: "bickham_baskerville",
    label: "Bickham Script Pro + Baskerville",
    category: "Classic & Timeless",
    headingFont: "'Bickham Script Pro', 'Pinyon Script', 'Great Vibes', cursive",
    bodyFont: "'Libre Baskerville', 'Baskerville', 'Garamond', serif",
    headingType: "script",
    scaleAdjustment: 1.25,
    isPremium: true,
    description: "Formal, traditional royal calligraphy with refined and easy-to-read Baskerville serif."
  },
  {
    id: "edwardian_garamond",
    label: "Edwardian Script ITC + Garamond",
    category: "Classic & Timeless",
    headingFont: "'Edwardian Script ITC', 'Italianno', 'WindSong', 'Great Vibes', cursive",
    bodyFont: "'Garamond', 'Cormorant Garamond', serif",
    headingType: "script",
    scaleAdjustment: 1.3,
    isPremium: true,
    description: "Flowing, romantic script paired with elegant and understated Garamond."
  },
  {
    id: "tangerine_classic",
    label: "Tangerine Classic & Timeless",
    category: "Classic & Timeless",
    headingFont: "'Tangerine', 'Great Vibes', cursive",
    bodyFont: "'Cormorant Garamond', 'Libre Baskerville', serif",
    headingType: "script",
    scaleAdjustment: 1.45,
    isPremium: false,
    description: "Tall, graceful Tangerine calligraphy paired with classic serif body typography."
  },
  {
    id: "orange_avenue_timeless",
    label: "Orange Avenue + Timeless Serif",
    category: "Classic & Timeless",
    headingFont: "'WindSong', 'Alex Brush', 'Great Vibes', cursive",
    bodyFont: "'Cormorant Garamond', 'Garamond', serif",
    headingType: "script",
    scaleAdjustment: 1.2,
    isPremium: false,
    description: "Boutique flowing script aesthetic paired with timeless high-end serif styling."
  },

  // Modern & Minimal
  {
    id: "canela_avenir",
    label: "Canela + Avenir (Modern & Minimal)",
    category: "Modern & Minimal",
    headingFont: "'Canela', 'Bodoni Moda', 'Prata', 'Playfair Display', serif",
    bodyFont: "'Avenir', 'Outfit', 'Montserrat', 'Helvetica Neue', sans-serif",
    headingType: "serif",
    scaleAdjustment: 1.0,
    isPremium: true,
    description: "Contemporary luxury serif paired with elegant simplicity sans-serif."
  },
  {
    id: "playfair_montserrat",
    label: "Playfair Display + Montserrat",
    category: "Modern & Minimal",
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Montserrat', 'Helvetica Neue', sans-serif",
    headingType: "serif",
    scaleAdjustment: 1.0,
    isPremium: false,
    description: "Editorial high-contrast luxury serif paired with crisp modern sans-serif."
  },
  {
    id: "libre_helvetica",
    label: "Libre Baskerville + Helvetica Neue",
    category: "Modern & Minimal",
    headingFont: "'Libre Baskerville', serif",
    bodyFont: "'Helvetica Neue', 'Arial', sans-serif",
    headingType: "serif",
    scaleAdjustment: 1.0,
    isPremium: false,
    description: "Clean and classic serif header with crisp, timeless sans-serif body."
  },

  // Romantic & Calligraphy
  {
    id: "great_vibes_cormorant",
    label: "Great Vibes + Cormorant Garamond (Romantic & Calligraphy)",
    category: "Romantic & Calligraphy",
    headingFont: "'Great Vibes', cursive",
    bodyFont: "'Cormorant Garamond', serif",
    headingType: "script",
    scaleAdjustment: 1.25,
    isPremium: false,
    description: "Sweeping romantic script paired with sophisticated serif (Recommended Free Pairing)."
  },
  {
    id: "allura_eb_garamond",
    label: "Allura + EB Garamond",
    category: "Romantic & Calligraphy",
    headingFont: "'Allura', cursive",
    bodyFont: "'EB Garamond', 'Garamond', serif",
    headingType: "script",
    scaleAdjustment: 1.3,
    isPremium: false,
    description: "Gentle, feminine romantic script paired with classic editorial Garamond."
  },
  {
    id: "alex_brush_cormorant",
    label: "Alex Brush + Cormorant Garamond",
    category: "Romantic & Calligraphy",
    headingFont: "'Alex Brush', cursive",
    bodyFont: "'Cormorant Garamond', serif",
    headingType: "script",
    scaleAdjustment: 1.2,
    isPremium: false,
    description: "Fluid brush calligraphy paired with timeless high-end body text."
  },
  {
    id: "belluccia_adorn",
    label: "Belluccia & Adorn Script Luxe",
    category: "Romantic & Calligraphy",
    headingFont: "'Belluccia', 'Sacramento', 'Italianno', cursive",
    bodyFont: "'Cormorant Garamond', serif",
    headingType: "script",
    scaleAdjustment: 1.25,
    isPremium: true,
    description: "Ornate custom wedding calligraphy paired with refined classic serif."
  },

  // Luxury & Editorial
  {
    id: "didot_helvetica",
    label: "Didot + Helvetica Neue (Luxury & Editorial)",
    category: "Luxury & Editorial",
    headingFont: "'Didot', 'Bodoni Moda', 'Playfair Display', serif",
    bodyFont: "'Helvetica Neue', 'Montserrat', sans-serif",
    headingType: "serif",
    scaleAdjustment: 1.0,
    isPremium: true,
    description: "High-fashion Vogue editorial Didot serif paired with clean Helvetica Neue."
  },
  {
    id: "bodoni_montserrat",
    label: "Bodoni + Montserrat",
    category: "Luxury & Editorial",
    headingFont: "'Bodoni Moda', 'Prata', 'Playfair Display', serif",
    bodyFont: "'Montserrat', sans-serif",
    headingType: "serif",
    scaleAdjustment: 1.0,
    isPremium: true,
    description: "Bold dramatic luxury serif paired with structured contemporary sans-serif."
  },
  {
    id: "butler_noe",
    label: "Butler & Noe Display Editorial",
    category: "Luxury & Editorial",
    headingFont: "'Butler', 'Prata', 'Playfair Display', serif",
    bodyFont: "'Cormorant Garamond', serif",
    headingType: "serif",
    scaleAdjustment: 1.0,
    isPremium: true,
    description: "Modern contrast editorial typography designed for upscale wedding invitations."
  },

  // Rustic & Garden Wedding
  {
    id: "cinzel_lora",
    label: "Cinzel + Lora (Rustic & Garden)",
    category: "Rustic & Garden",
    headingFont: "'Cinzel', serif",
    bodyFont: "'Lora', serif",
    headingType: "serif",
    scaleAdjustment: 1.0,
    isPremium: false,
    description: "Roman monumental luxury serif paired with warm, readable storybook Lora serif."
  },
  {
    id: "mrs_delafield_lora",
    label: "Mrs Saint Delafield + Lora",
    category: "Rustic & Garden",
    headingFont: "'Mrs Saint Delafield', cursive",
    bodyFont: "'Lora', serif",
    headingType: "script",
    scaleAdjustment: 1.4,
    isPremium: false,
    description: "Handwritten delicate garden script paired with warm, literary body text."
  },
  {
    id: "amsterdam_josefin",
    label: "Amsterdam Four + Josefin Sans",
    category: "Rustic & Garden",
    headingFont: "'WindSong', 'Great Vibes', cursive",
    bodyFont: "'Josefin Sans', sans-serif",
    headingType: "script",
    scaleAdjustment: 1.25,
    isPremium: false,
    description: "Modern signature garden calligraphy paired with geometric vintage sans-serif."
  },

  // Vintage
  {
    id: "crimson_im_fell",
    label: "Crimson Text + IM Fell English (Vintage)",
    category: "Vintage",
    headingFont: "'IM Fell English', serif",
    bodyFont: "'Crimson Text', serif",
    headingType: "serif",
    scaleAdjustment: 1.05,
    isPremium: false,
    description: "Antique book print typography with genuine historic character and charm."
  },
  {
    id: "caslon_old_standard",
    label: "Caslon + Old Standard TT",
    category: "Vintage",
    headingFont: "'Old Standard TT', serif",
    bodyFont: "'Libre Baskerville', serif",
    headingType: "serif",
    scaleAdjustment: 1.0,
    isPremium: false,
    description: "Early 20th century classic editorial elegance and refined proportions."
  },
  {
    id: "cormorant_infant_baskerville",
    label: "Cormorant Infant + Libre Baskerville",
    category: "Vintage",
    headingFont: "'Cormorant Infant', serif",
    bodyFont: "'Libre Baskerville', serif",
    headingType: "serif",
    scaleAdjustment: 1.0,
    isPremium: false,
    description: "Subtle vintage serif styling with warm serif legibility."
  },

  // Best Free Fonts (Google Fonts)
  {
    id: "playfair_cormorant",
    label: "Playfair Display + Cormorant Garamond",
    category: "Best Free Fonts",
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Cormorant Garamond', serif",
    headingType: "serif",
    scaleAdjustment: 1.0,
    isPremium: false,
    description: "Top-tier free Google Fonts combination for high-luxury wedding invitations."
  },
  {
    id: "cinzel_eb_garamond",
    label: "Cinzel + EB Garamond",
    category: "Best Free Fonts",
    headingFont: "'Cinzel', serif",
    bodyFont: "'EB Garamond', serif",
    headingType: "serif",
    scaleAdjustment: 1.0,
    isPremium: false,
    description: "Regal classical capitals paired with authentic Renaissance Garamond serif."
  }
];

export function getFontPairingById(id?: string): FontPairing {
  if (!id) return FONT_PAIRINGS[0];
  const found = FONT_PAIRINGS.find((p) => p.id === id);
  return found || FONT_PAIRINGS[0];
}

export function formatHeadingText(text: string | undefined, headingType?: "script" | "serif" | "modern"): string {
  if (!text) return "";
  if (headingType === "script") {
    // If a script font is selected and text is in all-caps (or general text like "SAHAL HAFNEEDH P K & SAHALA P"),
    // format as Title Case so ornate cursive initials join cleanly with lowercase loops.
    return text
      .split(" ")
      .map((word) => {
        if (!word) return "";
        const w = word.trim();
        // Keep single letters like 'P', 'K', '&' or acronyms uppercase
        if (w.length === 1) return w.toUpperCase();
        if (w.includes(".") && w.length <= 4) return w.toUpperCase();
        // Convert word to Title Case: Sahal, Hafneedh, Sahala
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
      })
      .join(" ");
  }
  return text;
}

