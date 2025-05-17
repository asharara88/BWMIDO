import { useState } from 'react';
import { Download, FileJson, FileText } from 'lucide-react';

interface DataExportProps {
  data: any[];
  filename?: string;
}

const DataExport = ({ data, filename = 'export' }: DataExportProps) => {
  const [loading, setLoading] = useState(false);

  const exportToCSV = () => {
    setLoading(true);
    try {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => 
            JSON.stringify(row[header] || '')
          ).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.csv`;
      link.click();
    } finally {
      setLoading(false);
    }
  };

  const exportToJSON = () => {
    setLoading(true);
    try {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.json`;
      link.click();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={exportToCSV}
        disabled={loading}
        className="flex items-center gap-2 rounded-lg border border-[hsl(var(--color-border))] px-4 py-2 text-sm font-medium text-text-light transition-colors hover:bg-[hsl(var(--color-card-hover))] hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FileText className="h-4 w-4" />
        Export CSV
      </button>
      
      <button
        onClick={exportToJSON}
        disabled={loading}
        className="flex items-center gap-2 rounded-lg border border-[hsl(var(--color-border))] px-4 py-2 text-sm font-medium text-text-light transition-colors hover:bg-[hsl(var(--color-card-hover))] hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FileJson className="h-4 w-4" />
        Export JSON
      </button>
    </div>
  );
};

export default DataExport;