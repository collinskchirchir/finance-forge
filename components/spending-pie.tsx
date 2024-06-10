import { FileSearch, PieChart, Radar, Target } from 'lucide-react';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PieVariant } from '@/components/pie-variant';

type Props = {
  data?: {
    name: string;
    value: number;
  }[]
}

export const SpendingPie = ({ data = [] }: Props) => {
  const [chartType, setChartType] = useState('pie');
  const onTypeChange = (type: string) => {
    // TODO: Add Paywall
    setChartType(type);
  };
  return (
    <Card className="border-none drop-shadow-sm ">
      <CardHeader className="flex justify-between space-y-2 lg:flex-row lg:items-center lg:space-y-0">
        <CardTitle className="line-clamp-1 text-xl">Categories</CardTitle>
        <Select defaultValue={chartType} onValueChange={onTypeChange}>
          <SelectTrigger className="h-9 rounded-md px-3 lg:w-auto">
            <SelectValue placeholder="ChartType" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pie">
              <div className="flex items-center">
                <PieChart className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Pie chart</p>
              </div>
            </SelectItem>
            <SelectItem value="radar">
              <div className="flex items-center">
                <Radar className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Radar chart</p>
              </div>
            </SelectItem>
            <SelectItem value="radial">
              <div className="flex items-center">
                <Target className="mr-2 size-4 shrink-0" />
                <p className="line-clamp-1">Radial chart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
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
          <>
            {chartType === 'pie' && <PieVariant data={data} />}
            {/* {chartType === 'radar' && <RadarVariant data={data} />} */}
            {/* {chartType === 'radial' && <RadialVariant data={data} />} */}
          </>
        )}
      </CardContent>
    </Card>
  );
};