'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { downloadCSV, exportDataAsCSV } from '@/lib/storage';
import { WeightEntry } from '@/lib/types';

interface ExportDataProps {
  entries: WeightEntry[];
}

export function ExportData({ entries }: ExportDataProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadCSV = async () => {
    if (entries.length === 0) {
      return;
    }
    
    setDownloading(true);
    try {
      downloadCSV();
    } catch (error) {
      console.error('Error downloading CSV:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyToClipboard = async () => {
    const csv = exportDataAsCSV();
    try {
      await navigator.clipboard.writeText(csv);
      alert('Datos copiados al portapapeles');
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar Datos</CardTitle>
        <CardDescription>
          Descarga o copia tus datos para análisis externo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No hay datos para exportar. Agrega algunas mediciones primero.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            <Button
              onClick={handleDownloadCSV}
              disabled={downloading}
              className="w-full"
              variant="default"
            >
              <Download className="w-4 h-4 mr-2" />
              {downloading ? 'Descargando...' : `Descargar CSV (${entries.length} registros)`}
            </Button>
            <Button
              onClick={handleCopyToClipboard}
              className="w-full"
              variant="outline"
            >
              Copiar al Portapapeles
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Los datos se exportan en formato CSV (Excel) con toda la información de tus mediciones.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
