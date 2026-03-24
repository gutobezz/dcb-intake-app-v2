import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 h-[800px] w-[800px] rounded-full bg-dcb-navy/30 blur-3xl" />
        <div className="absolute -right-1/4 -bottom-1/2 h-[600px] w-[600px] rounded-full bg-dcb-navy-light/20 blur-3xl" />
      </div>
      <LoginForm />
    </div>
  );
}
