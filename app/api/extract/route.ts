import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const isPro = formData.get("isPro") === "true";

    if (!isPro) {
      return NextResponse.json(
        { error: "This feature is restricted to PRO users. Please upgrade your account to enable AI Card Extraction." },
        { status: 403 }
      );
    }

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not configured. Returning premium mock extraction.");
      return NextResponse.json({
        isMock: true,
        data: {
          coupleNames: "Sahal & Sahala",
          brideDetails: "Daughter of Mr. Abdul Kader & Mrs. Mariyam",
          groomDetails: "Son of Mr. Muhammed Ali & Mrs. Fatima",
          weddingDate: "2026-11-20",
          weddingDateDisplay: "November 20-22, 2026",
          venueName: "The Tamarind Tree Gardens",
          venueAddress: "Bangalore, Karnataka, India",
          mapUrl: "https://maps.google.com/?q=The+Tamarind+Tree+Bangalore",
          story: "Two beautiful souls, Sahal and Sahala, unite under the blessings of their families to begin a lifetime of love and togetherness.",
          events: [
            { name: "Nikah Ceremony", time: "Nov 20, 10:00 AM", venue: "Tamarind Tree Hall" },
            { name: "Royal Reception Gala", time: "Nov 21, 7:00 PM", venue: "The Leela Palace Ballroom" }
          ],
          faqs: [
            { q: "What is the dress code?", a: "Traditional ethnic attire or formal western wear." },
            { q: "Is valet parking available?", a: "Yes, complimentary valet parking is provided at the venue." }
          ]
        }
      });
    }

    // Call Gemini API
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imagePart = {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: file.type
      }
    };

    const prompt = `
      You are an expert wedding invitation scanner. Extract all details from this wedding invitation card image.
      Return the response STRICTLY as a single JSON object (no markdown, no backticks, no wrap, just raw JSON) matching this exact format:
      {
        "coupleNames": "GroomName & BrideName",
        "brideDetails": "Daughter of Parents Names and lineage details found",
        "groomDetails": "Son of Parents Names and lineage details found",
        "weddingDate": "YYYY-MM-DD",
        "weddingDateDisplay": "Nice date string readable format e.g. November 20, 2026",
        "venueName": "Main venue name",
        "venueAddress": "Detailed venue address",
        "mapUrl": "https://maps.google.com/?q=venue_name",
        "story": "A short, elegant 2-sentence story inspired by their names",
        "events": [
          { "name": "Event Name", "time": "Readable Time e.g. Nov 20, 10:00 AM", "venue": "Event venue" }
        ],
        "faqs": [
          { "q": "Question", "a": "Answer" }
        ]
      }
      If any details (like parent names or secondary events) are missing, infer or provide elegant defaults fitting the tradition of the card.
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const responseText = result.response.text().trim();
    
    // Attempt to clean JSON formatting from backticks
    let cleanJsonStr = responseText;
    if (cleanJsonStr.startsWith("```json")) {
      cleanJsonStr = cleanJsonStr.substring(7);
    } else if (cleanJsonStr.startsWith("```")) {
      cleanJsonStr = cleanJsonStr.substring(3);
    }
    if (cleanJsonStr.endsWith("```")) {
      cleanJsonStr = cleanJsonStr.substring(0, cleanJsonStr.length - 3);
    }
    cleanJsonStr = cleanJsonStr.trim();

    try {
      const parsedData = JSON.parse(cleanJsonStr);
      return NextResponse.json({ isMock: false, data: parsedData });
    } catch (e) {
      console.error("Failed to parse Gemini JSON output:", responseText);
      return NextResponse.json({ error: "Failed to parse AI response. Please ensure image is a clear wedding card." }, { status: 500 });
    }
  } catch (err: any) {
    console.error("AI Extraction error:", err);
    return NextResponse.json({ error: err.message || "Extraction failed" }, { status: 500 });
  }
}
