"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { useCartStore } from "@/stores/cart-store";
import { phones } from "@/lib/identity";
import { IconCart, IconHeart, IconPhone } from "@/components/ui/icons";

export function Header() {
  const t = useTranslations("nav");
  const tCta = useTranslations("cta");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(useCartStore.getState().itemCount());
    update();
    return useCartStore.subscribe(update);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-[var(--brand-white)] transition-shadow ${
        scrolled ? "border-black/8 shadow-[var(--shadow-sm)]" : "border-black/5"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
        <Link href="/" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.jpg"
            alt="كبابجي شعبان"
            className="h-12 w-auto max-w-[160px] object-contain md:h-14"
            width={160}
            height={56}
          />
        </Link>

        <nav className="hidden items-center gap-1 text-sm font-semibold md:flex" aria-label="Primary">
          <NavLink href="/">{t("home")}</NavLink>
          <NavLink href="/menu">{t("menu")}</NavLink>
          <NavLink href="/wishlist">{t("wishlist")}</NavLink>
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <a
            href={`tel:${phones.primary.e164}`}
            className="hidden min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-bold text-[var(--brand-red)] transition hover:bg-[var(--brand-red-soft)] md:inline-flex"
          >
            <IconPhone className="h-4 w-4" />
            {tCta("callUs")}
          </a>
          <Link
            href="/wishlist"
            className="relative hidden min-h-11 min-w-11 items-center justify-center rounded-xl transition hover:bg-black/5 md:flex"
            aria-label={t("wishlist")}
          >
            <IconHeart />
          </Link>
          <Link
            href="/cart"
            className="relative flex min-h-11 min-w-11 items-center justify-center rounded-xl transition hover:bg-black/5"
            aria-label={t("cart")}
          >
            <IconCart />
            {count > 0 ? (
              <span className="absolute top-1 end-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--brand-red)] px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-xl transition hover:bg-black/5 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden>
              {open ? <X size={24} strokeWidth={1.8} /> : <Menu size={24} strokeWidth={1.8} />}
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-drawer"
          className="border-t border-black/5 bg-white px-4 py-4 shadow-[var(--shadow-md)] md:hidden"
        >
          <nav className="flex flex-col gap-1 font-semibold" aria-label="Mobile">
            <DrawerLink href="/" onClick={() => setOpen(false)}>
              {t("home")}
            </DrawerLink>
            <DrawerLink href="/menu" onClick={() => setOpen(false)}>
              {t("menu")}
            </DrawerLink>
            <DrawerLink href="/wishlist" onClick={() => setOpen(false)}>
              {t("wishlist")}
            </DrawerLink>
            <DrawerLink href="/cart" onClick={() => setOpen(false)}>
              {t("cart")}
            </DrawerLink>
            <a
              href={`tel:${phones.primary.e164}`}
              className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-[var(--brand-red)]"
            >
              <IconPhone />
              {phones.primary.displayAr}
            </a>
            <a
              href={`tel:${phones.secondary.e164}`}
              className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-[var(--brand-red)]"
            >
              <IconPhone />
              {phones.secondary.displayAr}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function NavLink({ href, children }: { href: "/" | "/menu" | "/wishlist"; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-xl px-3 py-2 transition hover:bg-[var(--brand-red-soft)] hover:text-[var(--brand-red)]"
    >
      {children}
    </Link>
  );
}

function DrawerLink({
  href,
  children,
  onClick,
}: {
  href: "/" | "/menu" | "/wishlist" | "/cart";
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className="min-h-11 rounded-xl px-3 py-3 hover:bg-[var(--page-bg)]">
      {children}
    </Link>
  );
}

