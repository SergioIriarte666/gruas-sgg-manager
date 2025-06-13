
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TablaReporteProps {
  title: string;
  headers: string[];
  data: (string | number)[][];
  totals?: (string | number)[];
  className?: string;
}

export function TablaReporte({ title, headers, data, totals, className = "" }: TablaReporteProps) {
  return (
    <Card className={`bg-white border border-gray-300 shadow-sm ${className}`}>
      <CardHeader className="bg-gray-50 border-b border-gray-300 py-3">
        <CardTitle className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100 border-b border-gray-300">
              {headers.map((header, index) => (
                <TableHead 
                  key={index} 
                  className="text-xs font-semibold text-gray-700 border-r border-gray-200 last:border-r-0 py-2 px-3"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow 
                key={rowIndex} 
                className={`${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200 hover:bg-blue-50`}
              >
                {row.map((cell, cellIndex) => (
                  <TableCell 
                    key={cellIndex} 
                    className="text-xs border-r border-gray-200 last:border-r-0 py-2 px-3 font-mono"
                  >
                    {typeof cell === 'number' && cellIndex > 0 ? 
                      (cell.toLocaleString('es-CL')) : 
                      cell
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {totals && (
              <TableRow className="bg-gray-100 border-t-2 border-gray-400 font-semibold">
                {totals.map((total, index) => (
                  <TableCell 
                    key={index} 
                    className="text-xs border-r border-gray-200 last:border-r-0 py-2 px-3 font-mono font-bold"
                  >
                    {typeof total === 'number' && index > 0 ? 
                      total.toLocaleString('es-CL') : 
                      total
                    }
                  </TableCell>
                ))}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
