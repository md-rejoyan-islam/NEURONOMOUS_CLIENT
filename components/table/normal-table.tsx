import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import React from 'react';
import { Skeleton } from '../ui/skeleton';

const NormalTable = ({
  headers,
  isLoading,
  data,
  noDataMessage = 'No data available.',
}: {
  headers: string[];
  noDataMessage?: string;
  isLoading?: boolean;
  data: React.ReactNode[][];
}) => {
  return (
    <Table>
      <TableHeader className="bg-primary/[0.04]">
        <TableRow>
          {headers.map((header) => (
            <TableHead key={header}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading &&
          [1, 2, 3, 4, 5, 6, 7].map((loader) => (
            <TableRow key={loader}>
              {headers.map((_, idx) => (
                <TableCell key={idx}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}

        {data.length > 0 &&
          data.map((dt, index) => (
            <TableRow key={index}>
              {dt.map((item, idx) => (
                <TableCell key={idx}>{item}</TableCell>
              ))}
            </TableRow>
          ))}
        {!isLoading && data.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={headers.length}
              className="py-3 text-center text-red-400"
            >
              {noDataMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default NormalTable;
