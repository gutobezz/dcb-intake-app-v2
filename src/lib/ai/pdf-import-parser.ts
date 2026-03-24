import { anthropic, AI_MODEL } from "./anthropic";
import type { PdfImportResult } from "@/lib/types";

const PDF_IMPORT_PROMPT = `You are an AI assistant for D&C Builders, a residential construction and remodeling company in Los Angeles, CA.

You are parsing text extracted from a previous D&C Builders proposal PDF. Your job is to extract structured data so it can be loaded into the proposal form.

Return your analysis as a JSON object with exactly this structure (no markdown, no code fences, just raw JSON):

{
  "client_first_name": "<first name or empty string>",
  "client_last_name": "<last name or empty string>",
  "client_email": "<email if found, or empty string>",
  "client_phone": "<phone if found, or empty string>",
  "address": "<property address or empty string>",
  "project_price": "<total project price as shown, e.g. '$185,000', or empty string>",
  "project_types": [<list of scope type IDs that match the proposal content, from: "interior_remodel", "kitchen_remodel", "bathroom_remodel", "new_bathroom", "addition_1st", "addition_2nd", "adu_jadu", "garage_conv", "garage_conv_1st", "garage_conv_2nd", "interior_per_bedroom", "new_construction", "roofing", "exterior_siding", "flooring", "painting", "windows_doors", "deck_patio", "sunroom">],
  "scope_items": {<map of scope_item_id to true for each item found, e.g. {"k_demo": true, "k_framing": true}>},
  "allowances": [{"description": "<description>", "amount": "<amount>"}],
  "payment_schedule": [{"milestone": "<milestone name>", "amount": "<dollar amount>", "percentage": "<percentage as string>"}],
  "confidence": <number 0-100 indicating how confident you are in the extraction>,
  "warnings": [<list of strings noting anything that was ambiguous, unclear, or might need manual review>]
}

Rules:
- Extract as much data as possible from the text.
- For project_types, map the section headers to the closest matching type ID.
- For scope_items, use the item IDs from these scope types:
  - kitchen_remodel: k_demo, k_framing, k_electrical, k_plumbing, k_hvac, k_cabinets, k_countertops, k_backsplash, k_flooring, k_appliances, k_paint, k_lighting
  - bathroom_remodel: b_demo, b_framing, b_electrical, b_plumbing, b_tile, b_vanity, b_shower, b_toilet, b_accessories, b_paint
  - interior_remodel: ir_design, ir_permits, ir_demo, ir_framing, ir_electrical, ir_plumbing, ir_finishing, ir_cleanup
  - And similarly for other types (use the type prefix + item suffix pattern)
- For payment_schedule, extract milestone names, amounts, and percentages.
- Set confidence lower if the PDF text is poorly extracted or missing key information.
- Add warnings for anything that needs manual verification.
- If a field cannot be determined at all, use empty string for strings, empty array for arrays, empty object for objects.`;

export async function parsePdfProposal(
  pdfText: string
): Promise<PdfImportResult> {
  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Here is the text extracted from a D&C Builders proposal PDF:\n\n---\n\n${pdfText}\n\n---\n\n${PDF_IMPORT_PROMPT}`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from PDF import parser");
  }

  const rawText = textBlock.text.trim();

  const jsonStr = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(jsonStr) as PdfImportResult;
    return parsed;
  } catch {
    throw new Error(
      `Failed to parse PDF import response as JSON. Raw response: ${rawText.slice(0, 500)}`
    );
  }
}
