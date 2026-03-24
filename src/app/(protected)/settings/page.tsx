import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TeamSettings } from "@/components/settings/team-settings";
import { ScopeSettings } from "@/components/settings/scope-settings";
import { IntegrationSettings } from "@/components/settings/integration-settings";
import type { User } from "@/lib/types";
import type { ScopeTemplate } from "@/lib/actions/settings";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  // Get the current user's profile to check role
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/intake");
  }

  const typedProfile = profile as User;

  // Fetch team members
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("name", { ascending: true });

  const typedUsers = (users ?? []) as User[];

  // Fetch scope templates
  const { data: scopeTemplates } = await supabase
    .from("scope_templates")
    .select("*")
    .order("project_type", { ascending: true })
    .order("sort_order", { ascending: true });

  const typedTemplates = (scopeTemplates ?? []) as ScopeTemplate[];

  // Check integration status from env vars
  const pipedriveConfigured = !!process.env.PIPEDRIVE_API_TOKEN;
  const docusignConfigured =
    !!process.env.DOCUSIGN_INTEGRATION_KEY &&
    !!process.env.DOCUSIGN_ACCOUNT_ID;
  const anthropicConfigured = !!process.env.ANTHROPIC_API_KEY;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-dcb-gold/10">
          <Settings className="size-5 text-dcb-gold" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage company settings, team members, and integrations
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={0}>
        <TabsList variant="line" className="w-full justify-start">
          <TabsTrigger value={0}>Team</TabsTrigger>
          <TabsTrigger value={1}>Scope Definitions</TabsTrigger>
          <TabsTrigger value={2}>Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value={0}>
          <Card className="mt-4">
            <CardContent className="p-6">
              <TeamSettings
                users={typedUsers}
                currentUserId={typedProfile.id}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value={1}>
          <Card className="mt-4">
            <CardContent className="p-6">
              <ScopeSettings templates={typedTemplates} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value={2}>
          <Card className="mt-4">
            <CardContent className="p-6">
              <IntegrationSettings
                pipedriveConfigured={pipedriveConfigured}
                docusignConfigured={docusignConfigured}
                anthropicConfigured={anthropicConfigured}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
