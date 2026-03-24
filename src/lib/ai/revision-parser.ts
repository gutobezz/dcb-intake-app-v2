import { anthropic, AI_MODEL } from "./anthropic";
import type { RevisionSuggestion } from "@/lib/types";

const REVISION_PROMPT = `You are an AI assistant for D&C Builders, a residential construction and remodeling company in Los Angeles, CA.

You are helping parse a revision request. You have been given:
1. The current proposal context (client info, scope, pricing)
2. A message — typically an email or text from a partner company (like Realm or Block Renovation), an advisor, or a client requesting changes

Your job is to parse the message and identify specific, actionable changes to the proposal.

Return your analysis as a JSON object with exactly this structure (no markdown, no code fences, just raw JSON):

{
  "summary": "<1-2 sentence summary of what the message is requesting>",
  "changes": [
    {
      "action": "<one of: add_scope | remove_scope | update_price | add_note>",
      "scope_type": "<scope type ID if applicable, from: interior_remodel, kitchen_remodel, bathroom_remodel, new_bathroom, addition_1st, addition_2nd, adu_jadu, garage_conv, garage_conv_1st, garage_conv_2nd, interior_per_bedroom, new_construction, roofing, exterior_siding, flooring, painting, windows_doors, deck_patio, sunroom>",
      "scope_item_id": "<specific scope item ID if applicable, e.g. k_demo, b_tile>",
      "new_price": "<new price string if action is update_price, e.g. '$185,000'>",
      "note": "<note text if action is add_note>",
      "description": "<human-readable description of this change for display>"
    }
  ]
}

Rules:
- Only include changes that are explicitly requested or clearly implied by the message.
- For add_scope, include the scope_type that should be added.
- For remove_scope, include the scope_type and optionally scope_item_id to remove.
- For update_price, include the new_price.
- For add_note, include the note text.
- Each change must have a clear description field explaining what happens.
- If the message is unclear or you cannot determine specific changes, return a summary explaining what's unclear and an empty changes array.`;

export async function parseRevisionRequest(
  currentProposal: object,
  messageText: string
): Promise<RevisionSuggestion> {
  const proposalContext = JSON.stringify(currentProposal, null, 2);

  const response = await anthropic.messages.create({
    model: AI_MODEL,
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Here is the current proposal context:\n\n${proposalContext}\n\n---\n\nHere is the revision request message:\n\n${messageText}\n\n---\n\n${REVISION_PROMPT}`,
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from revision parser");
  }

  const rawText = textBlock.text.trim();

  const jsonStr = rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(jsonStr) as RevisionSuggestion;
    return parsed;
  } catch {
    throw new Error(
      `Failed to parse revision response as JSON. Raw response: ${rawText.slice(0, 500)}`
    );
  }
}
