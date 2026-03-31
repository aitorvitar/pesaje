'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { WeightEntry } from '@/lib/types';
import { getStats, calculateTrend } from '@/lib/composition';

interface DashboardProps {
  entries: WeightEntry[];
}

export function Dashboard({ entries }: DashboardProps) {
  const stats = useMemo(() => getStats(entries), [entries]);

  const weightData = useMemo(() => {
    return entries
      .slice()
      .reverse()
      .map((entry) => ({
        date: entry.date,
        weight: entry.weight,
        bmi: entry.bmi,
      }))
      .slice(-30); // Últimos 30 días
  }, [entries]);

  const compositionData = useMemo(() => {
    return entries
      .slice(0, Math.min(10, entries.length))
      .reverse()
      .map((entry) => ({
        date: entry.date,
        bodyfat: entry.bodyFat,
        muscle: entry.muscle,
      }));
  }, [entries]);

  const trend7d = useMemo(() => calculateTrend(entries, 7), [entries]);
  const trend30d = useMemo(() => calculateTrend(entries, 30), [entries]);

  if (entries.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No hay datos todavía. ¡Comienza agregando tu primera medición!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Peso Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.currentWeight.toFixed(1)} kg</p>
            <div className="flex items-center gap-1 mt-2">
              {trend7d < 0 ? (
                <>
                  <ArrowDown className="w-4 h-4 text-green-500" />
                  <span className="text-xs text-green-500 font-medium">{Math.abs(trend7d).toFixed(1)} kg</span>
                </>
              ) : trend7d > 0 ? (
                <>
                  <ArrowUp className="w-4 h-4 text-red-500" />
                  <span className="text-xs text-red-500 font-medium">+{trend7d.toFixed(1)} kg</span>
                </>
              ) : (
                <>
                  <Minus className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-500 font-medium">Sin cambio</span>
                </>
              )}
              <span className="text-xs text-muted-foreground ml-1">(7d)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Peso Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.avgWeight.toFixed(1)} kg</p>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.minWeight.toFixed(1)} - {stats.maxWeight.toFixed(1)} kg
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">BMI Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{entries[0]?.bmi.toFixed(1) || '—'}</p>
            <Badge className="mt-2 text-xs" variant="outline">
              {entries[0]?.bmi < 25 ? 'Normal' : entries[0]?.bmi < 30 ? 'Sobrepeso' : 'Obesidad'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Composición</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-semibold">{entries[0]?.bodyFat.toFixed(1)}%</span> Grasa
              </p>
              <p className="text-sm">
                <span className="font-semibold">{entries[0]?.muscle.toFixed(1)}%</span> Músculo
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weight Chart */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Evolución del Peso</CardTitle>
          <CardDescription>Últimos 30 días</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                interval={Math.ceil(weightData.length / 6)}
              />
              <YAxis
                domain={['dataMin - 1', 'dataMax + 1']}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#f5f5f5', border: 'none', borderRadius: '8px' }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ fill: '#0ea5e9', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Body Composition Chart */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Composición Corporal</CardTitle>
          <CardDescription>Grasa y Músculo (últimos 10 registros)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={compositionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#f5f5f5', border: 'none', borderRadius: '8px' }}
              />
              <Bar dataKey="bodyfat" stackId="a" fill="#ef4444" name="Grasa %" />
              <Bar dataKey="muscle" stackId="a" fill="#22c55e" name="Músculo %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Métricas Adicionales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">RM Actual</p>
              <p className="text-xl font-bold">{entries[0]?.rm || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Visceral</p>
              <p className="text-xl font-bold">{entries[0]?.visceral.toFixed(1) || '—'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cambio 30 días</p>
              <p className={`text-xl font-bold ${trend30d < 0 ? 'text-green-600' : trend30d > 0 ? 'text-red-600' : ''}`}>
                {trend30d >= 0 ? '+' : ''}{trend30d.toFixed(1)} kg
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
