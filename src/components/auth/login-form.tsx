"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Import and call the server action when it becomes available
      const { signIn } = await import("@/lib/actions/auth");
      const result = await signIn({ email, password });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      router.push("/intake");
    } catch {
      setError("Unable to sign in. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Card className="relative z-10 w-full max-w-md border-dcb-navy-light/50 bg-dcb-navy/80 backdrop-blur-sm">
      <CardHeader className="items-center space-y-4 pb-2">
        <div className="flex flex-col items-center gap-1">
          <span className="text-3xl font-bold tracking-widest text-white">
            D&C
          </span>
          <span className="text-sm font-semibold tracking-[0.3em] uppercase text-dcb-gold">
            Builders
          </span>
        </div>
        <div className="space-y-1 text-center">
          <CardTitle className="text-lg text-white">Welcome back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access the proposal pipeline
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-muted-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@dcbuilders.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="h-10 border-white/10 bg-white/5 text-white placeholder:text-muted-foreground focus-visible:border-dcb-gold focus-visible:ring-dcb-gold/30"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-muted-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="h-10 border-white/10 bg-white/5 text-white placeholder:text-muted-foreground focus-visible:border-dcb-gold focus-visible:ring-dcb-gold/30"
            />
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="mt-2 h-10 w-full bg-dcb-gold font-semibold text-dcb-navy hover:bg-dcb-gold/90"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
