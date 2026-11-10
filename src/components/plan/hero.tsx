"use client";

import { motion } from "framer-motion";
import { ArrowDown, CalendarDays, Dumbbell, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROFILE } from "@/lib/profile";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden hero-grid">
      {/* Неоновые пятна на фоне */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 size-[480px] rounded-full bg-primary/10 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute top-20 -right-40 size-[420px] rounded-full bg-primary/8 blur-[110px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 pt-16 pb-14 sm:pt-24 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-primary">
            <CalendarDays className="size-4" aria-hidden />
            Персональная программа · 30 дней
          </div>

          <h1 className="mt-6 font-display font-extrabold leading-[1.05] tracking-tight text-4xl sm:text-6xl lg:text-7xl">
            Минус <span className="text-primary neon-glow">5 кг</span>
            <br />
            за 30 дней
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            План собран под тебя: {PROFILE.sex.toLowerCase()}, {PROFILE.age} лет, {PROFILE.height} см,{" "}
            {PROFILE.startWeight.toLocaleString("ru-RU")} кг. Рацион на{" "}
            <strong className="text-foreground">2150 ккал</strong> с 140 г белка,{" "}
            <strong className="text-foreground">2–3 тренировки в зале</strong> и хоккей раз в неделю — без голодовок и
            потери силы.
          </p>

          {/* Старт → Цель */}
          <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
            <div className="rounded-xl border bg-card px-5 py-3">
              <div className="text-xs text-muted-foreground">Старт</div>
              <div className="font-display text-2xl font-bold">
                {PROFILE.startWeight.toLocaleString("ru-RU")} <span className="text-sm text-muted-foreground font-sans">кг</span>
              </div>
            </div>
            <ArrowDown className="size-5 rotate-[-90deg] text-primary hidden sm:block" aria-hidden />
            <div className="rounded-xl border border-primary/40 bg-primary/10 glow-card px-5 py-3">
              <div className="text-xs text-primary/80">Цель</div>
              <div className="font-display text-2xl font-bold text-primary">
                {PROFILE.goalWeight.toLocaleString("ru-RU")} <span className="text-sm text-primary/70 font-sans">кг</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#nutrition">
              <Button size="lg" className="font-bold text-base px-6">
                <UtensilsCrossed className="size-5" aria-hidden />
                Открыть рацион
              </Button>
            </a>
            <a href="#training">
              <Button size="lg" variant="outline" className="font-bold text-base px-6 border-primary/40 hover:bg-primary/10 hover:text-primary">
                <Dumbbell className="size-5" aria-hidden />
                План тренировок
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
