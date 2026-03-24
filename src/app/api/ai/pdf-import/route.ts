import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePdfProposal } from "@/lib/ai/pdf-import-parser";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export async function POST(request: Request) {
  try {
    // Validate auth
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse FormData
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided. Upload a PDF proposal." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 20 MB." },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: `Expected a PDF file, got: ${file.type}` },
        { status: 400 }
      );
    }

    // Extract text from PDF
    // Basic text extraction using the PDF's raw bytes.
    // We parse text content from the PDF stream operators (Tj, TJ, ').
    // For production use, a library like pdf-parse would be more robust,
    // but this avoids adding a dependency for the initial implementation.
    const arrayBuffer = await file.arrayBuffer();
    const pdfText = extractTextFromPdf(arrayBuffer);

    if (!pdfText.trim()) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from this PDF. It may be image-based (scanned). Try uploading an image instead.",
        },
        { status: 422 }
      );
    }

    // Parse with AI
    const result = await parsePdfProposal(pdfText);

    return NextResponse.json({ result });
  } catch (err) {
    console.error("[AI] PDF import error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "PDF import failed",
      },
      { status: 500 }
    );
  }
}

/**
 * Basic PDF text extraction.
 *
 * Scans for text-rendering operators in decoded PDF stream content.
 * Handles Tj (show string), TJ (show array of strings), and ' (move + show).
 * This works for most digitally-generated PDFs but not scanned/image PDFs.
 */
function extractTextFromPdf(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const raw = new TextDecoder("latin1").decode(bytes);

  const textParts: string[] = [];

  // Find all stream...endstream blocks
  const streamRegex = /stream\r?\n([\s\S]*?)endstream/g;
  let match: RegExpExecArray | null;

  while ((match = streamRegex.exec(raw)) !== null) {
    const streamContent = match[1];

    // Look for text operators: (text) Tj, [(text)] TJ, (text) '
    const textOpRegex = /\(([^)]*)\)\s*(?:Tj|')/g;
    let textMatch: RegExpExecArray | null;
    while ((textMatch = textOpRegex.exec(streamContent)) !== null) {
      const decoded = decodePdfString(textMatch[1]);
      if (decoded.trim()) {
        textParts.push(decoded);
      }
    }

    // TJ arrays: [(text) 123 (text)] TJ
    const tjArrayRegex = /\[((?:\([^)]*\)|[^[\]])*)\]\s*TJ/g;
    let tjMatch: RegExpExecArray | null;
    while ((tjMatch = tjArrayRegex.exec(streamContent)) !== null) {
      const innerRegex = /\(([^)]*)\)/g;
      let innerMatch: RegExpExecArray | null;
      const parts: string[] = [];
      while ((innerMatch = innerRegex.exec(tjMatch[1])) !== null) {
        parts.push(decodePdfString(innerMatch[1]));
      }
      const combined = parts.join("");
      if (combined.trim()) {
        textParts.push(combined);
      }
    }
  }

  return textParts.join(" ").replace(/\s+/g, " ").trim();
}

/** Decode basic PDF string escape sequences */
function decodePdfString(s: string): string {
  return s
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");
}
