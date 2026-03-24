"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Home, MapPin } from "lucide-react";
import { FloorPlanUploader } from "@/components/intake/floor-plan-uploader";
import type { ProposalFormReturn } from "@/hooks/use-proposal-form";

const PROPERTY_TYPES = [
  "Single Family",
  "Condo / Townhome",
  "Multi-Family",
  "Commercial",
  "Vacant Lot",
  "Other",
] as const;
const STORIES = ["1", "1.5", "2", "2.5", "3+"] as const;

interface TabPropertyProps {
  form: ProposalFormReturn;
}

export function TabProperty({ form }: TabPropertyProps) {
  const { state, setField } = form;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-4" />
            Property Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="123 Main St, Los Angeles, CA 90001"
              value={state.address}
              onChange={(e) => setField("address", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="size-4" />
            Property Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Property Type</Label>
              <Select
                value={state.propertyType}
                onValueChange={(val) => setField("propertyType", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {PROPERTY_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearBuilt">Year Built</Label>
              <Input
                id="yearBuilt"
                type="number"
                placeholder="1965"
                value={state.yearBuilt}
                onChange={(e) => setField("yearBuilt", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sqft">Sq Footage</Label>
              <Input
                id="sqft"
                type="number"
                placeholder="1,800"
                value={state.sqft}
                onChange={(e) => setField("sqft", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Stories</Label>
              <Select
                value={state.stories}
                onValueChange={(val) => setField("stories", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select stories" />
                </SelectTrigger>
                <SelectContent>
                  {STORIES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                placeholder="3"
                value={state.bedrooms}
                onChange={(e) => setField("bedrooms", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                placeholder="2"
                value={state.bathrooms}
                onChange={(e) => setField("bathrooms", e.target.value)}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:gap-8">
            <div className="flex items-center gap-3">
              <Switch
                checked={state.hoa}
                onCheckedChange={(checked) => setField("hoa", checked)}
              />
              <Label>HOA</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={state.hasPlans}
                onCheckedChange={(checked) => setField("hasPlans", checked)}
              />
              <Label>Has Plans / RTI</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <FloorPlanUploader form={form} />
    </div>
  );
}
