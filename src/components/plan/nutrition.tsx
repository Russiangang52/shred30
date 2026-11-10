"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRightLeft,
  Croissant,
  ListChecks,
  Moon,
  Repeat,
  ShoppingBasket,
  Soup,
  UtensilsCrossed,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NUTRITION_WEEKS, SHOPPING_LIST, SWAPS, type Meal } from "@/lib/nutrition";

const MEAL_ICON: Record<string, typeof Croissant> = {
  Завтрак: Croissant,
  Обед: Soup,
  Ужин: Moon,
};

function MealRow({ meal }: { meal: Meal }) {
  const Icon = MEAL_ICON[meal.name] ?? UtensilsCrossed;
  return (
    <div className="rounded-lg border bg-secondary/40 p-3.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Icon className="size-4 text-primary" aria-hidden />
          {meal.name}
        </div>
        <Badge variant="secondary" className="font-mono text-xs">
          {meal.kcal} ккал
        </Badge>
      </div>
      <ul className="mt-2 space-y-1">
        {meal.items.map((item) => (
          <li key={item} className="flex gap-2 text-sm text-muted-foreground leading-snug">
            <span className="mt-[7px] size-1 rounded-full bg-primary/60 shrink-0" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function WeekMenu({ weekIndex }: { weekIndex: number }) {
  const week = NUTRITION_WEEKS[weekIndex];
  return (
    <motion.div
      key={week.title}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <p className="mb-4 rounded-lg border border-primary/25 bg-primary/8 px-4 py-3 text-sm text-foreground/90 leading-relaxed">
        <span className="font-semibold text-primary">{week.title}. </span>
        {week.hint}
      </p>
      <Accordion type="single" collapsible className="grid gap-3 lg:grid-cols-2">
        {week.days.map((d, i) => (
          <AccordionItem
            key={d.day}
            value={`w${weekIndex}-d${i}`}
            className="border rounded-xl bg-card px-4 data-[state=open]:border-primary/40"
          >
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex w-full items-center justify-between gap-3 pr-2">
                <span className="font-display font-semibold text-sm sm:text-base text-left">{d.day}</span>
                <Badge className="font-mono">{d.kcal} ккал</Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="mb-3 flex flex-wrap gap-1.5 text-xs">
                <Badge variant="outline" className="border-primary/30 text-primary">Б {d.p} г</Badge>
                <Badge variant="outline" className="border-primary/30 text-primary">Ж {d.f} г</Badge>
                <Badge variant="outline" className="border-primary/30 text-primary">У {d.c} г</Badge>
              </div>
              <div className="space-y-2.5">
                {d.meals.map((m) => (
                  <MealRow key={m.name} meal={m} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.div>
  );
}

export function NutritionSection() {
  const [tab, setTab] = useState("w0");

  return (
    <section id="nutrition" className="scroll-mt-20 py-14 sm:py-20 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center size-10 rounded-lg bg-primary/15 text-primary">
            <UtensilsCrossed className="size-5" aria-hidden />
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Рацион на 4 недели</h2>
        </div>
        <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">
          28 дней из обычных продуктов: завтрак, обед и ужин — сытно и без экзотики. Готовь на 1–2 дня вперёд, взвешивай
          крупы сухими. Если в день хочется есть между приёмами — выпей воды, съешь огурец или 150 г кефира (+40 ккал).
        </p>

        <Tabs value={tab} onValueChange={setTab} className="mt-8">
          <TabsList className="grid grid-cols-4 w-full max-w-xl mb-6">
            {NUTRITION_WEEKS.map((w, i) => (
              <TabsTrigger key={w.title} value={`w${i}`} className="font-semibold text-xs sm:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-transparent">
                Неделя {i + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          {NUTRITION_WEEKS.map((_, i) => (
            <TabsContent key={i} value={`w${i}`} className="mt-0">
              <WeekMenu weekIndex={i} />
            </TabsContent>
          ))}
        </Tabs>

        {/* Замены и список покупок */}
        <div className="mt-8 grid lg:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-5">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <Repeat className="size-5 text-primary" aria-hidden />
                Если чего-то нет — замены
              </h3>
              <div className="mt-4 space-y-2.5">
                {SWAPS.map((s) => (
                  <div key={s.from} className="flex items-start gap-2 text-sm leading-snug">
                    <ArrowRightLeft className="mt-0.5 size-4 text-primary/70 shrink-0" aria-hidden />
                    <span>
                      <span className="text-foreground font-medium">{s.from}</span>
                      <span className="text-muted-foreground"> → {s.to}</span>
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                Меняем продукт на эквивалент по калориям и белку — калораж дня при этом не ломается.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <ShoppingBasket className="size-5 text-primary" aria-hidden />
                Список покупок на неделю
              </h3>
              <div className="mt-4 grid sm:grid-cols-2 gap-x-4 gap-y-4 max-h-96 overflow-y-auto pr-1">
                {SHOPPING_LIST.map((cat) => (
                  <div key={cat.category}>
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                      <ListChecks className="size-3.5" aria-hidden />
                      {cat.category}
                    </div>
                    <ul className="mt-1.5 space-y-1">
                      {cat.items.map((item) => (
                        <li key={item} className="text-sm text-muted-foreground leading-snug">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
