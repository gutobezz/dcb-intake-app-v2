"use client";

import { useCallback, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Wand2,
  Plus,
  Minus,
  DollarSign,
  StickyNote,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import type { RevisionSuggestion, RevisionChange } from "@/lib/types";

interface AiRevisionAssistantProps {
  proposalId: string;
  currentPrice: string;
  onApplyChange: (change: RevisionChange) => void;
  onApplyAll: (changes: RevisionChange[]) => void;
}

const ACTION_ICONS: Record<RevisionChange["action"], typeof Plus> = {
  add_scope: Plus,
  remove_scope: Minus,
  update_price: DollarSign,
  add_note: StickyNote,
};

const ACTION_LABELS: Record<RevisionChange["action"], string> = {
  add_scope: "Add Scope",
  remove_scope: "Remove Scope",
  update_price: "Update Price",
  add_note: "Add Note",
};

const ACTION_VARIANTS: Record<
  RevisionChange["action"],
  "default" | "destructive" | "secondary" | "outline"
> = {
  add_scope: "default",
  remove_scope: "destructive",
  update_price: "secondary",
  add_note: "outline",
};

export function AiRevisionAssistant({
  proposalId,
  currentPrice,
  onApplyChange,
  onApplyAll,
}: AiRevisionAssistantProps) {
  const [messageText, setMessageText] = useState("");
  const [suggestion, setSuggestion] = useState<RevisionSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedIndices, setAppliedIndices] = useState<Set<number>>(new Set());

  const analyze = useCallback(async () => {
    if (!messageText.trim()) return;

    setError(null);
    setSuggestion(null);
    setAppliedIndices(new Set());
    setLoading(true);

    try {
      const res = await fetch("/api/ai/revision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId, messageText }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setSuggestion(data.suggestion);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  }, [proposalId, messageText]);

  const handleApply = useCallback(
    (change: RevisionChange, index: number) => {
      onApplyChange(change);
      setAppliedIndices((prev) => new Set(prev).add(index));
    },
    [onApplyChange]
  );

  const handleApplyAll = useCallback(() => {
    if (!suggestion) return;
    onApplyAll(suggestion.changes);
    setAppliedIndices(
      new Set(suggestion.changes.map((_, i) => i))
    );
  }, [suggestion, onApplyAll]);

  const allApplied =
    suggestion &&
    suggestion.changes.length > 0 &&
    suggestion.changes.every((_, i) => appliedIndices.has(i));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="size-4" />
          AI Revision Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Paste an email or message from Realm, an advisor, or a client
            requesting changes to the proposal. The AI will parse it and suggest
            specific modifications.
          </p>
          <Textarea
            placeholder="Paste email or revision text here...&#10;&#10;Example: 'Hi David, after reviewing the proposal we'd like to add a bathroom remodel to the scope and increase the budget to $200,000. Also please remove the deck/patio work.'"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="min-h-[120px]"
          />
          <div className="flex justify-end">
            <Button
              onClick={analyze}
              disabled={loading || !messageText.trim()}
              className="gap-1.5"
            >
              {loading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="size-3.5" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Results */}
        {suggestion && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-sm font-medium">Summary</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {suggestion.summary}
              </p>
            </div>

            {/* Changes */}
            {suggestion.changes.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    Suggested Changes ({suggestion.changes.length})
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleApplyAll}
                    disabled={!!allApplied}
                    className="gap-1.5"
                  >
                    {allApplied ? (
                      <>
                        <CheckCircle2 className="size-3.5" />
                        All Applied
                      </>
                    ) : (
                      <>
                        <ChevronRight className="size-3.5" />
                        Apply All
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-2">
                  {suggestion.changes.map((change, i) => {
                    const applied = appliedIndices.has(i);
                    const Icon = ACTION_ICONS[change.action];

                    return (
                      <div
                        key={i}
                        className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                          applied
                            ? "border-green-500/30 bg-green-50/50 dark:bg-green-950/10"
                            : "bg-background"
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">
                          <Icon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant={ACTION_VARIANTS[change.action]}>
                              {ACTION_LABELS[change.action]}
                            </Badge>
                            {change.scope_type && (
                              <span className="text-xs text-muted-foreground">
                                {change.scope_type.replace(/_/g, " ")}
                              </span>
                            )}
                          </div>
                          <p className="text-sm">{change.description}</p>

                          {/* Price diff for update_price */}
                          {change.action === "update_price" &&
                            change.new_price && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground line-through">
                                  {currentPrice || "N/A"}
                                </span>
                                <ChevronRight className="size-3 text-muted-foreground" />
                                <span className="font-medium text-green-700 dark:text-green-400">
                                  {change.new_price}
                                </span>
                              </div>
                            )}

                          {/* Note preview */}
                          {change.action === "add_note" && change.note && (
                            <div className="rounded bg-muted/50 p-2 text-xs text-muted-foreground italic">
                              &quot;{change.note}&quot;
                            </div>
                          )}
                        </div>
                        <Button
                          variant={applied ? "ghost" : "outline"}
                          size="sm"
                          onClick={() => handleApply(change, i)}
                          disabled={applied}
                          className="shrink-0"
                        >
                          {applied ? (
                            <CheckCircle2 className="size-3.5 text-green-600" />
                          ) : (
                            "Apply"
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="rounded-lg border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
                No specific changes could be identified from the message. Review
                the summary above and make manual adjustments.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
