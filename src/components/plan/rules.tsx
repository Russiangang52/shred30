"use client";

import { BookOpenCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { WEIGHT_RULES } from "@/lib/profile";

export function RulesSection() {
  return (
    <section id="rules" className="scroll-mt-20 py-14 sm:py-20 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center size-10 rounded-lg bg-primary/15 text-primary">
            <BookOpenCheck className="size-5" aria-hidden />
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">10 правил программы</h2>
        </div>
        <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">
          Рацион и тренировки — это 70% результата. Оставшиеся 30% решают эти простые правила: они бьют по главному
          врагу похудения — незаметным калориям и сорванной дисциплине.
        </p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {WEIGHT_RULES.map((rule, i) => (
            <Card key={rule.title} className="bg-card/70 hover:border-primary/40 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-baseline gap-2.5">
                  <span className="font-display text-2xl font-extrabold text-primary/40">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display font-semibold leading-snug">{rule.title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{rule.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
