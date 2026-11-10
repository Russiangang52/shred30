"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  LineChart as LineChartIcon,
  Scale,
  Trash2,
  Trophy,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { MACROS, PROFILE } from "@/lib/profile";

const STORE_KEY = "shred30-progress-v1";
const TOTAL_DAYS = 30;
const START = PROFILE.startWeight;
const GOAL = PROFILE.goalWeight;

// План похудения по дням программы (медианный сценарий)
const PLAN_LINE = [
  { day: 0, plan: 79.5 },
  { day: 7, plan: 77.9 },
  { day: 14, plan: 76.8 },
  { day: 21, plan: 75.7 },
  { day: 30, plan: 74.8 },
];

interface WeightEntry {
  date: string; // yyyy-MM-dd
  value: number;
}

interface Store {
  startDate: string; // yyyy-MM-dd
  done: number[]; // номера отмеченных дней 1..30
  weights: WeightEntry[];
}

function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

function defaultStore(): Store {
  return { startDate: todayISO(), done: [], weights: [] };
}

function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultStore();
    const parsed = JSON.parse(raw) as Store;
    if (!parsed || typeof parsed.startDate !== "string" || !Array.isArray(parsed.done) || !Array.isArray(parsed.weights)) {
      return defaultStore();
    }
    return parsed;
  } catch {
    return defaultStore();
  }
}

function diffDays(fromISO: string, toISO: string): number {
  const a = new Date(fromISO + "T00:00:00").getTime();
  const b = new Date(toISO + "T00:00:00").getTime();
  return Math.floor((b - a) / 86_400_000);
}

export function TrackerSection() {
  const { toast } = useToast();
  const [store, setStore] = useState<Store>(defaultStore);
  const [mounted, setMounted] = useState(false);
  const [weightInput, setWeightInput] = useState("");

  useEffect(() => {
    // Загружаем сохранённый прогресс после монтирования (localStorage доступен только на клиенте)
    let cancelled = false;
    const id = window.setTimeout(() => {
      if (cancelled) return;
      setStore(loadStore());
      setMounted(true);
    }, 0);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }, [store, mounted]);

  const persist = useCallback((next: Store) => setStore(next), []);

  const today = todayISO();
  const dayNumber = mounted ? Math.min(diffDays(store.startDate, today) + 1, TOTAL_DAYS) : 1;
  const programOver = mounted && diffDays(store.startDate, today) + 1 > TOTAL_DAYS;

  const doneSet = useMemo(() => new Set(store.done), [store.done]);
  const doneCount = store.done.length;

  // Максимальная серия подряд
  const streak = useMemo(() => {
    let best = 0;
    let cur = 0;
    for (let d = 1; d <= TOTAL_DAYS; d++) {
      if (doneSet.has(d)) {
        cur += 1;
        best = Math.max(best, cur);
      } else {
        cur = 0;
      }
    }
    return best;
  }, [doneSet]);

  const currentWeight = store.weights.length > 0 ? store.weights[store.weights.length - 1].value : START;
  const lost = Math.max(0, Math.round((START - currentWeight) * 10) / 10);
  const toGoal = Math.max(0, Math.round((currentWeight - GOAL) * 10) / 10);
  const pct = Math.min(100, Math.max(0, ((START - currentWeight) / (START - GOAL)) * 100));

  const chartData = useMemo(() => {
    const map = new Map<number, { day: number; plan?: number; actual?: number }>();
    for (const p of PLAN_LINE) map.set(p.day, { day: p.day, plan: p.plan });
    for (const w of store.weights) {
      const d = Math.max(0, diffDays(store.startDate, w.date));
      const ex = map.get(d) ?? { day: d };
      ex.actual = w.value;
      map.set(d, ex);
    }
    return [...map.values()].sort((a, b) => a.day - b.day);
  }, [store.weights, store.startDate]);

  const toggleDay = (d: number) => {
    const next = doneSet.has(d) ? store.done.filter((x) => x !== d) : [...store.done, d].sort((a, b) => a - b);
    persist({ ...store, done: next });
  };

  const addWeight = () => {
    const parsed = Number.parseFloat(weightInput.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed < 40 || parsed > 200) {
      toast({ title: "Проверь значение", description: "Введи вес в килограммах, например 78,4", variant: "destructive" });
      return;
    }
    const value = Math.round(parsed * 10) / 10;
    const date = today;
    const weights = [...store.weights.filter((w) => w.date !== date), { date, value }].sort((a, b) =>
      a.date < b.date ? -1 : 1,
    );
    persist({ ...store, weights });
    setWeightInput("");
    toast({ title: "Вес записан 💪", description: `${value.toLocaleString("ru-RU")} кг · ${format(new Date(date + "T00:00:00"), "d MMMM", { locale: ru })}` });
  };

  const removeWeight = (date: string) => {
    persist({ ...store, weights: store.weights.filter((w) => w.date !== date) });
  };

  const resetAll = () => {
    persist(defaultStore());
    toast({ title: "Прогресс сброшен", description: "Можешь начинать заново — с первого дня." });
  };

  return (
    <section id="tracker" className="scroll-mt-20 py-14 sm:py-20 border-t border-border/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center size-10 rounded-lg bg-primary/15 text-primary">
            <ClipboardCheck className="size-5" aria-hidden />
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">Трекер прогресса</h2>
        </div>
        <p className="mt-3 text-muted-foreground max-w-3xl leading-relaxed">
          Отмечай выполненные дни (рацион + тренировка), записывай вес по вторникам и пятницам утром натощак. Всё
          сохраняется в браузере — данные никуда не отправляются.
        </p>

        {/* Сводка */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="bg-card/70">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <CalendarCheck className="size-4 text-primary" aria-hidden /> День программы
              </div>
              <div className="mt-1 font-display text-2xl sm:text-3xl font-bold text-primary">
                {mounted ? (programOver ? "30" : dayNumber) : "—"}
                <span className="text-sm font-sans font-medium text-muted-foreground"> / 30</span>
              </div>
              <div className="text-xs text-muted-foreground/80">
                {programOver ? "Месяц пройден — подведи итоги!" : mounted ? `до конца: ${TOTAL_DAYS - dayNumber + 1} дн.` : ""}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/70">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <CheckCircle2 className="size-4 text-primary" aria-hidden /> Отмечено дней
              </div>
              <div className="mt-1 font-display text-2xl sm:text-3xl font-bold">
                {doneCount} <span className="text-sm font-sans font-medium text-muted-foreground">/ 30</span>
              </div>
              <div className="text-xs text-muted-foreground/80">серия: {streak} дн. подряд</div>
            </CardContent>
          </Card>

          <Card className="bg-card/70">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <Scale className="size-4 text-primary" aria-hidden /> Текущий вес
              </div>
              <div className="mt-1 font-display text-2xl sm:text-3xl font-bold">
                {currentWeight.toLocaleString("ru-RU")}
                <span className="text-sm font-sans font-medium text-muted-foreground"> кг</span>
              </div>
              <div className="text-xs text-muted-foreground/80">−{lost.toLocaleString("ru-RU")} кг от старта</div>
            </CardContent>
          </Card>

          <Card className="bg-card/70">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                <Trophy className="size-4 text-primary" aria-hidden /> До цели
              </div>
              <div className="mt-1 font-display text-2xl sm:text-3xl font-bold text-primary">
                {toGoal.toLocaleString("ru-RU")}
                <span className="text-sm font-sans font-medium text-muted-foreground"> кг</span>
              </div>
              <Progress value={pct} className="mt-2 h-2" aria-label={`Прогресс к цели ${pct}%`} />
            </CardContent>
          </Card>
        </div>

        {/* Чек-лист 30 дней */}
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg">Чек-лист 30 дней</CardTitle>
            <CardDescription>Кликай на день, когда закрыл рацион и тренировку. Первая клетка — первый день программы.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-2" role="group" aria-label="Отметить выполненные дни">
              {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((d) => {
                const isDone = doneSet.has(d);
                const isToday = mounted && !programOver && d === dayNumber;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleDay(d)}
                    aria-pressed={isDone}
                    aria-label={`День ${d}${isDone ? " — выполнен" : ""}`}
                    className={`h-10 sm:h-11 rounded-lg border font-mono text-sm font-bold transition-all hover:scale-105 focus-visible:outline-2 focus-visible:outline-primary ${
                      isDone
                        ? "bg-primary text-primary-foreground border-primary shadow-[0_0_14px_oklch(0.845_0.199_126/45%)]"
                        : "bg-secondary/40 text-muted-foreground hover:border-primary/50"
                    } ${isToday ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Вес */}
        <div className="mt-4 grid lg:grid-cols-[1fr_320px] gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <LineChartIcon className="size-5 text-primary" aria-hidden />
                График веса: факт против плана
              </CardTitle>
              <CardDescription>
                Пунктир — целевой вес {GOAL.toLocaleString("ru-RU")} кг. План по дням: 0 → {START.toLocaleString("ru-RU")}, 7 → 77,9, 14 → 76,8, 21 → 75,7, 30 → 74,8.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 sm:h-72">
              {store.weights.length === 0 ? (
                <div className="h-full grid place-items-center text-sm text-muted-foreground text-center px-6">
                  Запиши первый вес — и здесь появится твой график рядом с плановой линией.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -14, bottom: 0 }}>
                    <CartesianGrid stroke="oklch(1 0 0 / 8%)" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="day"
                      tick={{ fill: "oklch(0.68 0.012 120)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      label={{ value: "день программы", fill: "oklch(0.55 0.012 120)", fontSize: 11, position: "insideBottom", offset: -2 }}
                    />
                    <YAxis domain={[72.5, 80.5]} tick={{ fill: "oklch(0.68 0.012 120)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(v, name) => [`${v} кг`, name === "plan" ? "План" : "Факт"]}
                      labelFormatter={(d) => `День ${d}`}
                      contentStyle={{
                        background: "oklch(0.18 0.008 120)",
                        border: "1px solid oklch(1 0 0 / 12%)",
                        borderRadius: 12,
                        color: "oklch(0.97 0.005 120)",
                      }}
                    />
                    <ReferenceLine y={GOAL} stroke="#a3e635" strokeDasharray="6 4" />
                    <Line type="monotone" dataKey="plan" stroke="oklch(0.55 0.09 130)" strokeWidth={2} dot={false} strokeDasharray="7 5" connectNulls />
                    <Line type="monotone" dataKey="actual" stroke="#a3e635" strokeWidth={2.5} dot={{ fill: "#a3e635", r: 4 }} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-lg">Записать вес</CardTitle>
              <CardDescription>Утром, натощак, после туалета — так цифры честные.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min="40"
                  max="200"
                  placeholder={`${currentWeight.toLocaleString("ru-RU")}`}
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addWeight()}
                  aria-label="Текущий вес в килограммах"
                />
                <Button onClick={addWeight} className="font-bold shrink-0">
                  Записать
                </Button>
              </div>

              {store.weights.length > 0 && (
                <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {[...store.weights].reverse().map((w) => (
                    <li key={w.date} className="flex items-center justify-between rounded-lg border bg-secondary/40 px-3 py-2 text-sm">
                      <span className="text-muted-foreground">
                        {format(new Date(w.date + "T00:00:00"), "d MMMM", { locale: ru })}
                      </span>
                      <span className="flex items-center gap-2">
                        <Badge variant="secondary" className="font-mono">
                          {w.value.toLocaleString("ru-RU")} кг
                        </Badge>
                        <button
                          type="button"
                          onClick={() => removeWeight(w.date)}
                          aria-label={`Удалить запись за ${w.date}`}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-destructive">
                    Сбросить весь прогресс
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Сбросить прогресс?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Удалятся отметки дней, записи веса и дата старта. Это действие нельзя отменить.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Отмена</AlertDialogCancel>
                    <AlertDialogAction onClick={resetAll}>Сбросить</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
