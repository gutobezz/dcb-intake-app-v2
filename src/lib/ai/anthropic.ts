import Anthropic from "@anthropic-ai/sdk";

export const AI_MODEL = "claude-sonnet-4-20250514" as const;

export function getAnthropicClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to environment variables to enable AI features."
    );
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
}

// Lazy singleton — only instantiated when first used
let _client: Anthropic | null = null;
export const anthropic = new Proxy({} as Anthropic, {
  get(_target, prop) {
    if (!_client) _client = getAnthropicClient();
    return (_client as unknown as Record<string | symbol, unknown>)[prop];
  },
});
