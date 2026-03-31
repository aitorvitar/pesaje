'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trash2, Plus } from 'lucide-react';
import { Goal, Reminder } from '@/lib/types';
import { setGoal, deleteGoal, setReminder } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface GoalsSettingsProps {
  currentGoal?: Goal;
  currentReminder: Reminder;
  currentWeight: number;
  onUpdate?: () => void;
}

export function GoalsSettings({
  currentGoal,
  currentReminder,
  currentWeight,
  onUpdate,
}: GoalsSettingsProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [targetWeight, setTargetWeight] = useState(
    currentGoal?.targetWeight.toString() || ''
  );
  const [targetDate, setTargetDate] = useState(currentGoal?.targetDate || '');
  const [reminderEnabled, setReminderEnabled] = useState(currentReminder.enabled);
  const [reminderTime, setReminderTime] = useState(currentReminder.time);
  const [reminderFrequency, setReminderFrequency] = useState(currentReminder.frequency);

  const handleSetGoal = async () => {
    setSaving(true);
    try {
      const weight = parseFloat(targetWeight);
      if (!weight || !targetDate) {
        toast({
          title: 'Error',
          description: 'Por favor completa todos los campos',
          variant: 'destructive',
        });
        setSaving(false);
        return;
      }

      setGoal({
        targetWeight: weight,
        targetDate,
        createdAt: new Date().toISOString(),
      });

      toast({
        title: 'Éxito',
        description: 'Objetivo establecido correctamente',
      });

      onUpdate?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al establecer el objetivo',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGoal = async () => {
    setSaving(true);
    try {
      deleteGoal();
      setTargetWeight('');
      setTargetDate('');
      toast({
        title: 'Eliminado',
        description: 'Objetivo eliminado correctamente',
      });
      onUpdate?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al eliminar el objetivo',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSetReminder = async () => {
    setSaving(true);
    try {
      setReminder({
        enabled: reminderEnabled,
        time: reminderTime,
        frequency: reminderFrequency,
      });

      toast({
        title: 'Éxito',
        description: 'Recordatorio actualizado',
      });

      onUpdate?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al actualizar el recordatorio',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const progress = currentGoal
    ? Math.min(
        100,
        Math.max(
          0,
          ((currentWeight - currentGoal.targetWeight) / (currentWeight - currentGoal.targetWeight)) * 100
        )
      )
    : 0;

  const difference = currentGoal ? currentGoal.targetWeight - currentWeight : 0;

  return (
    <div className="space-y-4">
      {/* Goal Card */}
      <Card>
        <CardHeader>
          <CardTitle>Objetivo de Peso</CardTitle>
          <CardDescription>
            Establece una meta y monitorea tu progreso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentGoal ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Peso Actual: <span className="font-bold text-foreground">{currentWeight} kg</span>
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Objetivo: <span className="font-bold text-foreground">{currentGoal.targetWeight} kg</span>
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Falta:{' '}
                  <span className={`font-bold ${difference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {difference >= 0 ? '-' : '+'}{Math.abs(difference).toFixed(1)} kg
                  </span>
                </p>
              </div>
              <Progress value={Math.abs(progress)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Fecha objetivo: {currentGoal.targetDate}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteGoal}
                disabled={saving}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar Objetivo
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target-weight">Peso Objetivo (kg)</Label>
                  <Input
                    id="target-weight"
                    type="number"
                    step="0.1"
                    placeholder="85.0"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-date">Fecha Objetivo</Label>
                  <Input
                    id="target-date"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                  />
                </div>
              </div>
              <Button
                onClick={handleSetGoal}
                disabled={saving}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Establecer Objetivo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reminder Card */}
      <Card>
        <CardHeader>
          <CardTitle>Recordatorios</CardTitle>
          <CardDescription>
            Recibe notificaciones para tus mediciones
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="reminder-toggle">Habilitar Recordatorios</Label>
            <input
              id="reminder-toggle"
              type="checkbox"
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300"
            />
          </div>

          {reminderEnabled && (
            <>
              <div className="space-y-2">
                <Label htmlFor="reminder-time">Hora</Label>
                <Input
                  id="reminder-time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reminder-frequency">Frecuencia</Label>
                <Select value={reminderFrequency} onValueChange={(value: any) => setReminderFrequency(value)}>
                  <SelectTrigger id="reminder-frequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diariamente</SelectItem>
                    <SelectItem value="every-other-day">Cada 2 días</SelectItem>
                    <SelectItem value="weekly">Semanalmente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button
            onClick={handleSetReminder}
            disabled={saving}
            className="w-full"
          >
            Guardar Recordatorio
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
