"use client";

import { useEffect, useState } from "react";
import { Flame, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#goal", label: "Цель" },
  { href: "#nutrition", label: "Питание" },
  { href: "#training", label: "Тренировки" },
  { href: "#rules", label: "Правила" },
  { href: "#tracker", label: "Прогресс" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        scrolled ? "bg-background/85 backdrop-blur-md border-border" : "bg-background/60 backdrop-blur-sm border-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2 shrink-0" aria-label="SHRED·30 — наверх">
          <span className="grid place-items-center size-9 rounded-lg bg-primary text-primary-foreground">
            <Flame className="size-5" strokeWidth={2.5} aria-hidden />
          </span>
          <span className="font-display font-bold text-lg tracking-tight">
            SHRED<span className="text-primary">·30</span>
          </span>
        </a>

        <nav aria-label="Основная навигация" className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a href="#tracker" className="ml-2">
            <Button size="sm" className="font-bold">
              Начать день 1
            </Button>
          </a>
        </nav>

        <button
          className="md:hidden p-2 -mr-2 text-foreground"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <nav aria-label="Мобильная навигация" className="md:hidden border-t bg-background/95 backdrop-blur-md">
          <div className="px-4 py-3 flex flex-col">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-2 py-3 rounded-md text-base font-medium text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
