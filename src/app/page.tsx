import { redirect } from "next/navigation";

export default function Home() {
  // For now, always redirect to login.
  // Once auth is wired up, this will check the session
  // and redirect authenticated users to /intake instead.
  redirect("/login");
}
