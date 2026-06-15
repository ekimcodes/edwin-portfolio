import Link from "next/link";
import VisitorLog from "@/components/VisitorLog";

export const metadata = {
  title: "visitor log — Edwin Kim",
};

export default function LogPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24">
      <Link href="/" className="muted">
        ← back
      </Link>
      <h1 className="mt-8 mb-6 text-base font-normal">visitor log</h1>
      <VisitorLog />
    </main>
  );
}
