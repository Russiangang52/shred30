"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Beef, Droplet, Flame, Target, TrendingDown, Wheat } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FORECAST, KPI, MACROS, PROFILE, WHY_IT_WORKS } from "@/lib/profile";

const MACRO_CARDS = [
  { icon: Flame, label: "Калории", value: MACROS.kcal, unit: "ккал/день", detail: `Дефицит ≈ ${MACROS.deficit} ккал (23% от расхода ${MACROS.tdee})` },
  { icon: Beef, label: "Белки", value: MACROS.protein, unit: "г", detail: "1,8 г на кг веса — сохраняем мышцы" },
  { icon: Droplet, label: "Жиры", value: MACROS.fat, unit: "г", detail: "Гормоны и сытость, ниже нельзя" },
  { icon: Wheat, label: "Углеводы", value: MACROS.carbs, unit: "г", detail: "Топливо для тренировок и мозга" },
];

export function GoalSection() {
  return (
    <section id="goal" className="scroll-mt-20 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center size-10 rounded-lg bg-primary/15 text-primary">
            <Target className="size-5" aria-hidden />
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Цель и цифры</h2>
        </div>
        <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">
          Программа рассчитана по формуле Миффлина — Сан Жеора под твои параметры: базовый обмен{" "}
          <strong className="text-foreground">{MACROS.bmr} ккал</strong>, полный расход с учётом шагов и зала ≈{" "}
          <strong className="text-foreground">{MACROS.tdee} ккал</strong>. Едим 2150 ккал — тело закрывает разницу из жира.
        </p>

        {/* KPI */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {KPI.map((k) => (
            <Card key={k.label} className="bg-card/70">
              <CardContent className="p-4 sm:p-5">
                <div className="text-xs sm:text-sm text-muted-foreground">{k.label}</div>
                <div className="mt-1 font-display text-2xl sm:text-3xl font-bold text-primary">
                  {k.value} <span className="text-xs sm:text-sm font-sans font-medium text-muted-foreground">{k.unit}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground/80">{k.sub}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-4 grid lg:grid-cols-2 gap-4">
          {/* КБЖУ */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-lg">КБЖУ на день</CardTitle>
              <CardDescription>3 приёма пищи: завтрак ≈ 650, обед ≈ 780, ужин ≈ 620 ккал</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {MACRO_CARDS.map((m) => (
                <div key={m.label} className="rounded-lg border bg-secondary/40 p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <m.icon className="size-4 text-primary" aria-hidden />
                    {m.label}
                  </div>
                  <div className="mt-1 font-display text-xl font-bold">
                    {m.value} <span className="text-xs font-sans font-medium text-muted-foreground">{m.unit}</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground/80 leading-snug">{m.detail}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Прогноз */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <TrendingDown className="size-5 text-primary" aria-hidden />
                Прогноз веса по неделям
              </CardTitle>
              <CardDescription>
                Медианный сценарий при 90% следования плану: {PROFILE.startWeight.toLocaleString("ru-RU")} → 74,8 кг на весах
              </CardDescription>
            </CardHeader>
            <CardContent className="h-56 sm:h-60">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={FORECAST} margin={{ top: 10, right: 8, left: -14, bottom: 0 }}>
                  <defs>
                    <linearGradient id="limeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a3e635" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#a3e635" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="oklch(1 0 0 / 8%)" strokeDasharray="3 3" />
                  <XAxis dataKey="week" tick={{ fill: "oklch(0.68 0.012 120)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[73.5, 80.5]} tick={{ fill: "oklch(0.68 0.012 120)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(v) => [`${v} кг`, "Вес"]}
                    contentStyle={{
                      background: "oklch(0.18 0.008 120)",
                      border: "1px solid oklch(1 0 0 / 12%)",
                      borderRadius: 12,
                      color: "oklch(0.97 0.005 120)",
                    }}
                  />
                  <ReferenceLine y={74.5} stroke="#a3e635" strokeDasharray="6 4" label={{ value: "цель 74,5", fill: "#a3e635", fontSize: 11, position: "insideBottomRight" }} />
                  <Area type="monotone" dataKey="weight" stroke="#a3e635" strokeWidth={2.5} fill="url(#limeFill)" dot={{ fill: "#a3e635", r: 3.5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Почему это работает */}
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {WHY_IT_WORKS.map((w) => (
            <Card key={w.title} className="bg-card/70">
              <CardContent className="p-5">
                <h3 className="font-display font-semibold text-primary">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{w.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
