import { FileSearch } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import AreaVariant from '@/components/area-variant';

type Props = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[]
}

export const Chart = ({ data = [] }: Props) => {
  return (
    <Card className="border-none drop-shadow-sm ">
      <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
        <CardTitle className="line-clamp-1 text-xl">Transactions</CardTitle>
        {/*  TODO: Add Select */}
      </CardHeader>
      <CardContent className="flex flex-row items-center justify-between">
        {data.length === 0 ? (
          <div className="flex h-[350px] w-full flex-col items-center justify-center gap-y-4">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No data for this period
            </p>
          </div>
        ) : (
          <AreaVariant
            data={data}
          />
        )}
      </CardContent>
    </Card>
  );
};