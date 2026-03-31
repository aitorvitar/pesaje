'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, Edit2 } from 'lucide-react';
import { WeightEntry } from '@/lib/types';
import { deleteWeightEntry } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

interface HistoryProps {
  entries: WeightEntry[];
  onEdit?: (entry: WeightEntry) => void;
  onDelete?: () => void;
}

export function History({ entries, onEdit, onDelete }: HistoryProps) {
  const { toast } = useToast();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const success = deleteWeightEntry(id);
      if (success) {
        toast({
          title: 'Eliminado',
          description: 'Medición eliminada correctamente',
        });
        onDelete?.();
        setDeleteId(null);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la medición',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
    }
  };

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No hay mediciones registradas todavía
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Historial de Mediciones</CardTitle>
          <CardDescription>
            Total: {entries.length} mediciones
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="text-sm">
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Fecha</TableHead>
                <TableHead className="w-16">Hora</TableHead>
                <TableHead className="w-16">Peso</TableHead>
                <TableHead className="w-12">BMI</TableHead>
                <TableHead className="w-16">Grasa</TableHead>
                <TableHead className="w-16">Músculo</TableHead>
                <TableHead className="w-12">RM</TableHead>
                <TableHead className="w-16">Visceral</TableHead>
                <TableHead className="w-20">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.date}</TableCell>
                  <TableCell>{entry.time}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{entry.weight} kg</Badge>
                  </TableCell>
                  <TableCell>{entry.bmi.toFixed(1)}</TableCell>
                  <TableCell>{entry.bodyFat.toFixed(1)}%</TableCell>
                  <TableCell>{entry.muscle.toFixed(1)}%</TableCell>
                  <TableCell>{entry.rm}</TableCell>
                  <TableCell>{entry.visceral.toFixed(1)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit?.(entry)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(entry.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar medición</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar esta medición? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
