"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, Phone, Users, Plus, Trash2 } from "lucide-react";
import { REFERRAL_SOURCES, ADVISORS } from "@/lib/types";
import type { ProposalFormReturn } from "@/hooks/use-proposal-form";

const RELATIONSHIP_OPTIONS = [
  "Spouse / Partner",
  "Co-Owner",
  "Family Member",
  "Business Partner",
  "Other",
] as const;

interface TabClientProps {
  form: ProposalFormReturn;
}

export function TabClient({ form }: TabClientProps) {
  const { state, setField, addAdditionalOwner, removeAdditionalOwner, updateAdditionalOwner } = form;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-4" />
            Client Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="First name"
                value={state.firstName}
                onChange={(e) => setField("firstName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Last name"
                value={state.lastName}
                onChange={(e) => setField("lastName", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="size-4" />
            Contact Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="client@email.com"
                value={state.email}
                onChange={(e) => setField("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={state.phone}
                onChange={(e) => setField("phone", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-4" />
            Assignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Referral Source</Label>
              <Select
                value={state.referralSource}
                onValueChange={(val) => setField("referralSource", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {REFERRAL_SOURCES.map((src) => (
                    <SelectItem key={src} value={src}>
                      {src}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Assigned Advisor</Label>
              <Select
                value={state.advisor}
                onValueChange={(val) => setField("advisor", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select advisor" />
                </SelectTrigger>
                <SelectContent>
                  {ADVISORS.map((adv) => (
                    <SelectItem key={adv} value={adv}>
                      {adv}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="size-4" />
              Additional Owners
            </span>
            <Button variant="outline" size="sm" onClick={addAdditionalOwner}>
              <Plus className="size-3.5" />
              Add Owner
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {state.additionalOwners.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No additional owners. Click Add Owner if there are co-owners.
            </p>
          ) : (
            <div className="space-y-4">
              {state.additionalOwners.map((owner, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-border/60 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Owner #{index + 1}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeAdditionalOwner(index)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">First Name</Label>
                      <Input
                        placeholder="First name"
                        value={owner.firstName}
                        onChange={(e) => updateAdditionalOwner(index, "firstName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Last Name</Label>
                      <Input
                        placeholder="Last name"
                        value={owner.lastName}
                        onChange={(e) => updateAdditionalOwner(index, "lastName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={owner.email}
                        onChange={(e) => updateAdditionalOwner(index, "email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Phone</Label>
                      <Input
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={owner.phone}
                        onChange={(e) => updateAdditionalOwner(index, "phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs text-muted-foreground">Relationship</Label>
                      <Select
                        value={owner.relationship}
                        onValueChange={(val) => updateAdditionalOwner(index, "relationship", val ?? "")}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          {RELATIONSHIP_OPTIONS.map((r) => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
