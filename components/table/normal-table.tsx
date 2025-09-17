'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Skeleton } from '../ui/skeleton';
import Pagination from './table-pagination';

const NormalTable = ({
  headers,
  isLoading,
  data,
  noDataMessage = 'No data available.',
  currentPage,
  itemsPerPage,
  totalItems,
  limitOptions = [5, 10, 20, 35, 50, 100],
}: {
  headers: string[];
  noDataMessage?: string;
  isLoading?: boolean;
  data: React.ReactNode[][];
  currentPage?: number;
  itemsPerPage?: number;
  totalItems?: number;
  limitOptions?: number[];
}) => {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push(`?page=${page}&limit=${itemsPerPage}`);
  };
  const handleLimitChange = (newLimit: number) => {
    router.push(`?page=1&limit=${newLimit}`);
  };

  return (
    <>
      <Table>
        <TableHeader className="bg-primary/[0.04]">
          <TableRow>
            {headers.map((header) => (
              <TableHead key={header}>{header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="border-b">
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

          {!isLoading &&
            data.length > 0 &&
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
      {!isLoading && currentPage && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          limitOptions={limitOptions}
          totalItems={totalItems}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          showLimitSelector={true}
        />
      )}
    </>
  );
};

export default NormalTable;
