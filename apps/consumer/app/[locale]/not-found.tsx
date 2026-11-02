import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="mb-4 text-2xl font-extrabold">Not found</h1>
      <Link href="/menu" className="font-bold text-[var(--brand-red)]">
        Menu
      </Link>
    </div>
  );
}
