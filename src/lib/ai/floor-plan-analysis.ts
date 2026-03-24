import { anthropic, AI_MODEL } from "./anthropic";
import type { FloorPlanAnalysis } from "@/lib/types";

type ImageMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

const FLOOR_PLAN_PROMPT = `You are an expert construction estimator and floor plan analyst for D&C Builders, a residential construction and remodeling company in Los Angeles, CA.

Analyze the provided floor plan image and extract the following information. Be thorough but realistic — if you cannot determine something from the image, say so rather than guessing.

Return your analysis as a JSON object with exactly this structure (no markdown, no code fences, just raw JSON):

{
  "room_count": <number of distinct rooms visible>,
  "window_count": <number of windows visible or estimated>,
  "door_count": <number of doors visible>,
  "sqft_estimate": <estimated total square footage based on proportions and any dimensions shown>,
  "bedrooms": <number of bedrooms identified>,
  "bathrooms": <number of bathrooms identified>,
  "load_bearing_walls": [<list of strings describing likely load-bearing walls, e.g. "North exterior wall", "Central spine wall between kitchen and living room">],
  "removal_candidates": [<list of strings describing walls that could potentially be removed, e.g. "Partition wall between dining and living room">],
  "plumbing_locations": [<list of strings describing where plumbing is located or would need to be, e.g. "Kitchen sink on west wall", "Master bath wet wall shared with hall bath">],
  "electrical_panel": "<description of where the electrical panel appears to be or likely is>",
  "hvac_notes": "<notes about HVAC — ductwork routes, unit placement, any visible details>",
  "structural_concerns": [<list of strings noting any structural concerns, e.g. "Long span in living room may need beam", "Foundation appears to be slab-on-grade">],
  "suggested_scope_items": [<list of scope type IDs from this set that apply based on what you see: "interior_remodel", "kitchen_remodel", "bathroom_remodel", "new_bathroom", "addition_1st", "addition_2nd", "adu_jadu", "garage_conv", "flooring", "painting", "windows_doors", "roofing", "exterior_siding", "deck_patio">],
  "raw_notes": "<any additional observations about the property that would help a sales advisor prepare a proposal>"
}

Important:
- For sqft_estimate, use any dimensions shown on the plan. If no dimensions, estimate based on room proportions and typical residential construction.
- For load-bearing walls, look for thicker walls, walls that run the length of the structure, and exterior walls.
- For suggested_scope_items, only suggest what's relevant based on visible conditions or typical needs.
- Be conservative with structural assessments — flag concerns rather than making definitive statements.`;

export async function analyzeFloorPlan(
  imageBase64: string,
  mimeType: string
): Promise<FloorPlanAnalysis> {
  const mediaType = mimeType as ImageMediaType;

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: "text",
            text: FLOOR_PLAN_PROMPT,
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from floor plan analysis");
  }

  const rawText = textBlock.text.trim();

  // Strip markdown code fences if present
  const jsonStr = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(jsonStr) as FloorPlanAnalysis;
    return parsed;
  } catch {
    throw new Error(
      `Failed to parse floor plan analysis response as JSON. Raw response: ${rawText.slice(0, 500)}`
    );
  }
}
