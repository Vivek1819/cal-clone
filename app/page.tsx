import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-black text-white">
      <h1 className="text-2xl font-semibold">Cal.com</h1>

      <Link href="/event-types">
        <button
          className="
            bg-white text-black
            px-6 py-2.5
            rounded-lg
            text-sm font-medium
            hover:bg-neutral-200
            transition
          "
        >
          Enter
        </button>
      </Link>
    </main>
  );
}
