import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeFloorPlan } from "@/lib/ai/floor-plan-analysis";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

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
        { error: "No file provided. Upload an image of a floor plan." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 20 MB." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Unsupported file type: ${file.type}. Accepted: JPEG, PNG, GIF, WebP.`,
        },
        { status: 400 }
      );
    }

    // Convert to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // Analyze
    const analysis = await analyzeFloorPlan(base64, file.type);

    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("[AI] Floor plan analysis error:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Floor plan analysis failed",
      },
      { status: 500 }
    );
  }
}
