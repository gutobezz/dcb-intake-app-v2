"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Check, X, Pencil } from "lucide-react";
import {
  updateScopeTemplate,
  createScopeTemplate,
  type ScopeTemplate,
} from "@/lib/actions/settings";
import { toast } from "sonner";

interface ScopeSettingsProps {
  templates: ScopeTemplate[];
}

interface EditingState {
  id: string;
  title: string;
  description: string;
}

export function ScopeSettings({ templates }: ScopeSettingsProps) {
  const router = useRouter();
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state for adding new scope item
  const [newProjectType, setNewProjectType] = useState("");
  const [newScopeKey, setNewScopeKey] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Group templates by project_type
  const grouped = templates.reduce<Record<string, ScopeTemplate[]>>(
    (acc, t) => {
      const key = t.project_type;
      if (!acc[key]) acc[key] = [];
      acc[key].push(t);
      return acc;
    },
    {}
  );

  const startEditing = useCallback((template: ScopeTemplate) => {
    setEditing({
      id: template.id,
      title: template.title,
      description: template.description,
    });
  }, []);

  async function saveEdit() {
    if (!editing) return;
    setSaving(true);
    try {
      const result = await updateScopeTemplate(editing.id, {
        title: editing.title,
        description: editing.description,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Scope item updated");
        setEditing(null);
        router.refresh();
      }
    } catch {
      toast.error("Failed to update");
    } finally {
      setSaving(false);
    }
  }

  async function toggleDefault(template: ScopeTemplate) {
    try {
      const result = await updateScopeTemplate(template.id, {
        is_default: !template.is_default,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        router.refresh();
      }
    } catch {
      toast.error("Failed to toggle default");
    }
  }

  async function handleAdd() {
    if (!newProjectType.trim() || !newScopeKey.trim() || !newTitle.trim()) {
      toast.error("Project type, scope key, and title are required");
      return;
    }

    setSaving(true);
    try {
      const result = await createScopeTemplate({
        project_type: newProjectType.trim(),
        scope_key: newScopeKey.trim(),
        title: newTitle.trim(),
        description: newDescription.trim(),
        is_default: true,
      });
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Scope item created");
        setNewProjectType("");
        setNewScopeKey("");
        setNewTitle("");
        setNewDescription("");
        setAddOpen(false);
        router.refresh();
      }
    } catch {
      toast.error("Failed to create scope item");
    } finally {
      setSaving(false);
    }
  }

  const projectTypes = Object.keys(grouped).sort();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Scope Definitions
          </h3>
          <p className="text-xs text-muted-foreground">
            Manage scope templates used in proposals
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger render={<Button size="sm" />}>
            <Plus className="mr-1 size-4" />
            Add Scope Item
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Scope Item</DialogTitle>
              <DialogDescription>
                Create a new scope item template for proposals.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Project Type</Label>
                <Input
                  placeholder="e.g. kitchen_remodel"
                  value={newProjectType}
                  onChange={(e) => setNewProjectType(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Scope Key</Label>
                <Input
                  placeholder="e.g. k_demo"
                  value={newScopeKey}
                  onChange={(e) => setNewScopeKey(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="e.g. Demo & Haul-Off"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Scope item description..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button onClick={handleAdd} disabled={saving}>
                {saving ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No scope templates found. Add one to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {projectTypes.map((pt) => (
            <div key={pt} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {pt.replace(/_/g, " ")}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {grouped[pt].length} item
                  {grouped[pt].length !== 1 ? "s" : ""}
                </span>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Description
                    </TableHead>
                    <TableHead className="w-24">Default</TableHead>
                    <TableHead className="w-20 text-right">Edit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grouped[pt].map((t) => {
                    const isEditing = editing?.id === t.id;
                    return (
                      <TableRow key={t.id}>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              value={editing.title}
                              onChange={(e) =>
                                setEditing({
                                  ...editing,
                                  title: e.target.value,
                                })
                              }
                              className="h-7 text-sm"
                            />
                          ) : (
                            <span className="font-medium">{t.title}</span>
                          )}
                        </TableCell>
                        <TableCell className="hidden max-w-xs truncate md:table-cell">
                          {isEditing ? (
                            <Input
                              value={editing.description}
                              onChange={(e) =>
                                setEditing({
                                  ...editing,
                                  description: e.target.value,
                                })
                              }
                              className="h-7 text-sm"
                            />
                          ) : (
                            <span className="text-muted-foreground">
                              {t.description}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={t.is_default}
                            onCheckedChange={() => toggleDefault(t)}
                            size="sm"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={saveEdit}
                                disabled={saving}
                              >
                                <Check className="size-4 text-emerald-500" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => setEditing(null)}
                              >
                                <X className="size-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => startEditing(t)}
                            >
                              <Pencil className="size-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
