'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { addWeightEntry } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface EntryFormProps {
  onSuccess?: () => void;
}

export function EntryForm({ onSuccess }: EntryFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      const weight = parseFloat(formData.get('weight') as string);
      const bmi = parseFloat(formData.get('bmi') as string);
      const bodyFat = parseFloat(formData.get('bodyFat') as string);
      const muscle = parseFloat(formData.get('muscle') as string);
      const rm = parseFloat(formData.get('rm') as string);
      const visceral = parseFloat(formData.get('visceral') as string);
      const notes = formData.get('notes') as string;

      // Validar campos requeridos
      if (!weight || !bmi || !bodyFat || !muscle || !rm || visceral === null) {
        toast({
          title: 'Error',
          description: 'Por favor completa todos los campos requeridos',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // Obtener fecha y hora actual
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toTimeString().split(' ')[0].slice(0, 5);

      addWeightEntry({
        date,
        time,
        weight,
        bmi,
        bodyFat,
        muscle,
        rm,
        visceral,
        notes: notes || undefined,
      });

      toast({
        title: 'Éxito',
        description: 'Datos guardados correctamente',
      });

      // Reset form
      e.currentTarget.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Error al guardar los datos',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Medición</CardTitle>
        <CardDescription>
          Ingresa tus datos actuales. La fecha y hora se registran automáticamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Peso (kg) *</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                placeholder="99.6"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bmi">BMI *</Label>
              <Input
                id="bmi"
                name="bmi"
                type="number"
                step="0.1"
                placeholder="28.1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bodyFat">Grasa Corporal (%) *</Label>
              <Input
                id="bodyFat"
                name="bodyFat"
                type="number"
                step="0.1"
                placeholder="26.8"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="muscle">Músculo (%) *</Label>
              <Input
                id="muscle"
                name="muscle"
                type="number"
                step="0.1"
                placeholder="34.4"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rm">RM *</Label>
              <Input
                id="rm"
                name="rm"
                type="number"
                step="1"
                placeholder="1992"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visceral">Visceral *</Label>
              <Input
                id="visceral"
                name="visceral"
                type="number"
                step="0.1"
                placeholder="11"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Ejemplo: Comí saludable hoy, hice ejercicio..."
              className="resize-none"
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Guardando...' : 'Guardar Medición'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
