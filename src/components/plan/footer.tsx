"use client";

import { Flame, HeartPulse } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-card/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid place-items-center size-8 rounded-lg bg-primary text-primary-foreground">
                <Flame className="size-4" strokeWidth={2.5} aria-hidden />
              </span>
              <span className="font-display font-bold">
                SHRED<span className="text-primary">·30</span>
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground max-w-md leading-relaxed">
              Персональная программа на 30 дней: рацион 2150 ккал + тренировки в зале. Старт 79,5 кг → цель 74,5 кг.
            </p>
          </div>

          <div className="rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 max-w-md">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <HeartPulse className="size-4" aria-hidden />
              Важно про здоровье
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
              Тебе 17 — организм ещё растёт, поэтому дефицит умеренный, без жёстких голодовок. Перед стартом покажи план
              родителям и при возможности спроси врача или школьного медработника. При головокружениях, слабости или
              боли — STOP: ешь по норме и дай себе день отдыха.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t text-xs text-muted-foreground/70">
          Программа носит рекомендательный характер и не является медицинской консультацией.
        </div>
      </div>
    </footer>
  );
}
