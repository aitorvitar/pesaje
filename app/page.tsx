'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, BarChart3, History, Settings, FileUp } from 'lucide-react';
import { EntryForm } from '@/components/entry-form';
import { Dashboard } from '@/components/dashboard';
import { History as HistoryComponent } from '@/components/history';
import { GoalsSettings } from '@/components/goals-settings';
import { ExportData } from '@/components/export-data';
import { BodyAvatar } from '@/components/body-avatar';
import { getWeightEntries, getGoal, getReminder } from '@/lib/storage';
import { getCompositionType } from '@/lib/composition';
import { WeightEntry, Goal, Reminder } from '@/lib/types';

export default function Home() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [goal, setGoal] = useState<Goal | undefined>();
  const [reminder, setReminder] = useState<Reminder>({
    enabled: false,
    time: '08:00',
    frequency: 'daily',
  });
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Cargar datos del storage
  useEffect(() => {
    const loadData = () => {
      const allEntries = getWeightEntries();
      setEntries(allEntries);
      
      const currentGoal = getGoal();
      setGoal(currentGoal);
      
      const currentReminder = getReminder();
      setReminder(currentReminder);
      
      setLoaded(true);
    };

    loadData();
  }, []);

  const refreshData = () => {
    const allEntries = getWeightEntries();
    setEntries(allEntries);
    
    const currentGoal = getGoal();
    setGoal(currentGoal);
  };

  const compositionType = entries.length > 0 
    ? getCompositionType(entries[0].bmi, entries[0].bodyFat, entries[0].muscle)
    : 'normal';

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Logo Control de Peso" 
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Control de Peso</h1>
              <p className="text-sm text-muted-foreground">Monitorea tu evolución</p>
            </div>
          </div>
          <Button
            onClick={() => setActiveTab('entrada')}
            size="sm"
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Medición</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:w-auto">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="w-4 h-4 hidden md:inline" />
              <span className="hidden md:inline">Dashboard</span>
              <span className="md:hidden">Panel</span>
            </TabsTrigger>
            <TabsTrigger value="entrada" className="gap-2">
              <Plus className="w-4 h-4 hidden md:inline" />
              <span className="hidden md:inline">Agregar</span>
              <span className="md:hidden">+</span>
            </TabsTrigger>
            <TabsTrigger value="historial" className="gap-2">
              <History className="w-4 h-4 hidden md:inline" />
              <span className="hidden md:inline">Historial</span>
              <span className="md:hidden">Lista</span>
            </TabsTrigger>
            <TabsTrigger value="objetivos" className="gap-2">
              <Settings className="w-4 h-4 hidden md:inline" />
              <span className="hidden md:inline">Objetivos</span>
              <span className="md:hidden">🎯</span>
            </TabsTrigger>
            <TabsTrigger value="exportar" className="gap-2">
              <FileUp className="w-4 h-4 hidden md:inline" />
              <span className="hidden md:inline">Exportar</span>
              <span className="md:hidden">📥</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {entries.length > 0 && (
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex-1">
                    <BodyAvatar type={compositionType} bmi={entries[0].bmi} size="md" />
                  </div>
                  <div className="md:col-span-2 flex flex-col justify-center">
                    <h3 className="text-lg font-semibold mb-2">Tu Estado Actual</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Peso:</span> {entries[0].weight} kg
                      </p>
                      <p>
                        <span className="font-medium">BMI:</span> {entries[0].bmi}
                      </p>
                      <p>
                        <span className="font-medium">Grasa Corporal:</span> {entries[0].bodyFat}%
                      </p>
                      <p>
                        <span className="font-medium">Músculo:</span> {entries[0].muscle}%
                      </p>
                      {goal && (
                        <p className="text-green-600 font-medium">
                          🎯 Objetivo: {goal.targetWeight} kg
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}
            <div className="grid grid-cols-1 gap-6">
              <Dashboard entries={entries} />
            </div>
          </TabsContent>

          {/* Entry Tab */}
          <TabsContent value="entrada">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EntryForm onSuccess={refreshData} />
              {entries.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Última Medición</h3>
                  <Card className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Fecha</p>
                        <p className="font-semibold">{entries[0].date}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Hora</p>
                        <p className="font-semibold">{entries[0].time}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Peso</p>
                        <p className="font-semibold">{entries[0].weight} kg</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">BMI</p>
                        <p className="font-semibold">{entries[0].bmi}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Grasa</p>
                        <p className="font-semibold">{entries[0].bodyFat}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Músculo</p>
                        <p className="font-semibold">{entries[0].muscle}%</p>
                      </div>
                    </div>
                    {entries[0].notes && (
                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">Notas</p>
                        <p className="text-sm mt-1">{entries[0].notes}</p>
                      </div>
                    )}
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="historial">
            <HistoryComponent
              entries={entries}
              onDelete={refreshData}
              onEdit={(entry) => {
                // Esta función está lista para edit si necesitas agregar esa funcionalidad
              }}
            />
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="objetivos">
            <GoalsSettings
              currentGoal={goal}
              currentReminder={reminder}
              currentWeight={entries[0]?.weight || 0}
              onUpdate={refreshData}
            />
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="exportar">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExportData entries={entries} />
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Información</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium text-foreground">Total de Mediciones:</span> {entries.length}
                  </p>
                  {entries.length > 0 && (
                    <>
                      <p>
                        <span className="font-medium text-foreground">Primera Medición:</span>{' '}
                        {entries[entries.length - 1].date}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Última Medición:</span> {entries[0].date}
                      </p>
                    </>
                  )}
                  <p className="pt-3 border-t">
                    Los datos se guardan localmente en tu navegador. La exportación crea un archivo CSV que puedes
                    abrir en Excel o Google Sheets.
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="border-t bg-muted/50 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Mi Control de Peso • Aplicación PWA para monitorear tu evolución personal</p>
          <p className="mt-2">💾 Tus datos se guardan localmente en tu dispositivo</p>
        </div>
      </div>
    </div>
  );
}
