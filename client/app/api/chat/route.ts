import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt, message, context } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not configured. Falling back to local intelligence.");
      const text = getLocalFallbackResponse(message || "", context || "");
      return NextResponse.json({ text });
    }

    try {
      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const text =
          geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ??
          getLocalFallbackResponse(message || "", context || "");
        return NextResponse.json({ text });
      }

      const errText = await geminiRes.text();
      console.warn("Gemini API error (falling back to local context parser):", errText);
    } catch (apiErr) {
      console.warn("Failed to reach Gemini API (falling back to local context parser):", apiErr);
    }

    // Fall back to rule-based parser on any external API failure
    const text = getLocalFallbackResponse(message || "", context || "");
    return NextResponse.json({ text });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

function getLocalFallbackResponse(query: string, context: string): string {
  if (!context) {
    return "Victory Design & Construction (VTCLBD) is a leading architectural design and structural consultancy firm in Bangladesh. Please call customer care at +88 01779481486 for inquiries.";
  }

  const normalizedQuery = query.toLowerCase();

  // Courses inquiry
  if (
    normalizedQuery.includes("course") ||
    normalizedQuery.includes("training") ||
    normalizedQuery.includes("learn") ||
    normalizedQuery.includes("class") ||
    normalizedQuery.includes("academy")
  ) {
    const courseLines = context.split("\n").filter(
      (line) =>
        line.toLowerCase().includes("course") ||
        line.toLowerCase().includes("mastery") ||
        line.toLowerCase().includes("revit") ||
        line.toLowerCase().includes("supervision") ||
        line.toLowerCase().includes("bdt")
    );
    if (courseLines.length > 0) {
      return `Victory Design & Construction Ltd offers the following professional courses:\n\n${courseLines
        .map((line) => `📚 ${line.trim().replace(/^-/, "").trim()}`)
        .join("\n")}\n\nTo enroll, visit our Training page or call us directly!`;
    }
  }

  // Office Branches / Locations
  if (
    normalizedQuery.includes("branch") ||
    normalizedQuery.includes("office") ||
    normalizedQuery.includes("location") ||
    normalizedQuery.includes("where") ||
    normalizedQuery.includes("address")
  ) {
    const branchLines = context.split("\n").filter(
      (line) =>
        line.toLowerCase().includes("branch") ||
        line.toLowerCase().includes("complex") ||
        line.toLowerCase().includes("cumilla") ||
        line.toLowerCase().includes("dhaka") ||
        line.toLowerCase().includes("bazar")
    );
    if (branchLines.length > 0) {
      return `Our branch offices are located at:\n\n${branchLines
        .map((line) => `📍 ${line.trim().replace(/^-/, "").trim()}`)
        .join("\n")}`;
    }
  }

  // Contacts
  if (
    normalizedQuery.includes("contact") ||
    normalizedQuery.includes("phone") ||
    normalizedQuery.includes("email") ||
    normalizedQuery.includes("call") ||
    normalizedQuery.includes("number") ||
    normalizedQuery.includes("mobile")
  ) {
    const contactLines = context.split("\n").filter(
      (line) =>
        line.toLowerCase().includes("phone") ||
        line.toLowerCase().includes("email") ||
        line.toLowerCase().includes("contact")
    );
    if (contactLines.length > 0) {
      return `You can reach VTCLBD Customer Support at:\n\n${contactLines
        .map((line) => `📞 ${line.trim().replace(/^-/, "").trim()}`)
        .join("\n")}`;
    }
  }

  // Services
  if (
    normalizedQuery.includes("service") ||
    normalizedQuery.includes("do you do") ||
    normalizedQuery.includes("offer") ||
    normalizedQuery.includes("work")
  ) {
    const serviceLines = context.split("\n").filter(
      (line) =>
        line.toLowerCase().includes("service") ||
        line.toLowerCase().includes("architectural") ||
        line.toLowerCase().includes("structural") ||
        line.toLowerCase().includes("design") ||
        line.toLowerCase().includes("estimation") ||
        line.toLowerCase().includes("interior")
    );
    if (serviceLines.length > 0) {
      return `We provide professional engineering consultancy services:\n\n${serviceLines
        .map((line) => `⚙️ ${line.trim().replace(/^\d+\./, "").trim()}`)
        .join("\n")}`;
    }
  }

  // Paragraph overlap matcher
  const queryWords = normalizedQuery
    .split(/\s+/)
    .filter((w) => w.length > 3 && !["what", "your", "have", "with", "this", "that", "about"].includes(w));
  
  const paragraphs = context.split("\n\n");
  let bestParagraph = "";
  let maxMatches = 0;

  for (const paragraph of paragraphs) {
    let matches = 0;
    const lowerPara = paragraph.toLowerCase();
    for (const word of queryWords) {
      if (lowerPara.includes(word)) {
        matches++;
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches;
      bestParagraph = paragraph;
    }
  }

  if (maxMatches > 0 && bestParagraph) {
    return bestParagraph;
  }

  // Default response using intro
  const intro = paragraphs[0] || "Victory Design & Construction (VTCLBD) is a leading architectural design and structural consultancy firm in Bangladesh.";
  return `${intro}\n\nNeed immediate help? Call us at +88 01779481486 or email victorydesign72@gmail.com.`;
}
