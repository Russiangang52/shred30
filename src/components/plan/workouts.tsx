"use client";

import { motion } from "framer-motion";
import { BedDouble, Dumbbell, Flame, Footprints, Info, Timer, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PROGRESSION, TRAINING_RULES, WEEK, WEEK_NOTE, type DayPlan } from "@/lib/training";

function DayBadgeRow({ plan }: { plan: Extract<DayPlan, { kind: "gym" | "hockey" }> }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <h3 className="font-display text-lg sm:text-xl font-bold mr-1">{plan.title}</h3>
      <Badge variant="outline" className="border-primary/40 text-primary gap-1">
        <Timer className="size-3" aria-hidden /> {plan.duration}
      </Badge>
      <Badge variant="outline" className="border-primary/40 text-primary gap-1">
        <Flame className="size-3" aria-hidden /> {plan.kcalBurn}
      </Badge>
      <Badge variant="secondary" className="hidden sm:inline-flex">{plan.focus}</Badge>
    </div>
  );
}

export function TrainingSection() {
  return (
    <section id="training" className="scroll-mt-20 py-14 sm:py-20 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center size-10 rounded-lg bg-primary/15 text-primary">
            <Dumbbell className="size-5" aria-hidden />
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Тренировки недели</h2>
        </div>
        <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">
          Схема: <strong className="text-foreground">2–3 тренировки в зале (фулбади A/B/C) + 1 хоккей</strong>.
          Фулбади на дефиците эффективнее сплита — каждая мышца работает 2–3 раза в неделю, а хоккей уже даёт
          интервальное кардио. Задача зала — удержать мышцы и силу, жир уходит от кухни и шагов.
        </p>

        <div className="mt-4 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/8 px-4 py-3.5 max-w-3xl">
          <Info className="mt-0.5 size-5 text-primary shrink-0" aria-hidden />
          <p className="text-sm leading-relaxed">{WEEK_NOTE}</p>
        </div>

        <Tabs defaultValue="0" className="mt-8">
          <TabsList className="grid grid-cols-7 w-full mb-6 h-auto">
            {WEEK.map((plan, i) => (
              <TabsTrigger
                key={i}
                value={String(i)}
                className="font-bold text-xs sm:text-sm py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-transparent"
              >
                {plan.day}
              </TabsTrigger>
            ))}
          </TabsList>

          {WEEK.map((plan, i) => (
            <TabsContent key={i} value={String(i)} className="mt-0">
              <motion.div
                key={plan.day}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {plan.kind === "gym" && (
                  <>
                    <DayBadgeRow plan={plan} />
                    <Card className="overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[42%] min-w-40">Упражнение</TableHead>
                            <TableHead className="whitespace-nowrap">Подходы</TableHead>
                            <TableHead className="whitespace-nowrap">Отдых</TableHead>
                            <TableHead className="hidden md:table-cell">Заметка</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {plan.exercises.map((ex) => (
                            <TableRow key={ex.name}>
                              <TableCell className="font-medium">{ex.name}</TableCell>
                              <TableCell className="font-mono text-primary whitespace-nowrap">{ex.sets}</TableCell>
                              <TableCell className="text-muted-foreground whitespace-nowrap">{ex.rest}</TableCell>
                              <TableCell className="text-xs text-muted-foreground hidden md:table-cell leading-snug">
                                {ex.note ?? "—"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>

                    <div className="mt-4 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/8 px-4 py-3.5">
                      <Flame className="mt-0.5 size-5 text-primary shrink-0" aria-hidden />
                      <p className="text-sm leading-relaxed">
                        <span className="font-semibold text-primary">Финишер: </span>
                        {plan.finisher}
                      </p>
                    </div>
                  </>
                )}

                {plan.kind === "hockey" && (
                  <>
                    <DayBadgeRow plan={plan} />
                    <Card className="border-primary/30 bg-primary/5">
                      <CardContent className="p-6">
                        <h3 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2">
                          <Zap className="size-5 text-primary" aria-hidden />
                          {plan.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">{plan.focus}</p>
                        <ul className="mt-4 grid sm:grid-cols-2 gap-2">
                          {plan.bullets.map((b) => (
                            <li key={b} className="flex items-start gap-2 text-sm leading-snug">
                              <Footprints className="mt-0.5 size-4 text-primary/70 shrink-0" aria-hidden />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </>
                )}

                {plan.kind === "rest" && (
                  <Card className="border-primary/30 bg-primary/5">
                    <CardContent className="p-6">
                      <h3 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2">
                        <BedDouble className="size-5 text-primary" aria-hidden />
                        {plan.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{plan.focus}</p>
                      <ul className="mt-4 grid sm:grid-cols-2 gap-2">
                        {plan.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-sm leading-snug">
                            <Footprints className="mt-0.5 size-4 text-primary/70 shrink-0" aria-hidden />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Прогрессия */}
        <h3 className="mt-10 font-display text-xl font-bold">Прогрессия по неделям</h3>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PROGRESSION.map((p) => (
            <Card key={p.week} className="bg-card/70">
              <CardContent className="p-5">
                <div className="text-xs font-bold uppercase tracking-wide text-primary">{p.week}</div>
                <div className="mt-1 font-display font-semibold">{p.title}</div>
                <ul className="mt-3 space-y-1.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex gap-2 text-sm text-muted-foreground leading-snug">
                      <span className="mt-[7px] size-1 rounded-full bg-primary/60 shrink-0" aria-hidden />
                      {pt}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Правила тренировок */}
        <Card className="mt-4">
          <CardContent className="p-5">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <Info className="size-5 text-primary" aria-hidden />
              Правила тренировок
            </h3>
            <ul className="mt-3 space-y-2">
              {TRAINING_RULES.map((r) => (
                <li key={r} className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
                  <span className="mt-[8px] size-1 rounded-full bg-primary/60 shrink-0" aria-hidden />
                  {r}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
