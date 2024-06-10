import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { format } from 'date-fns';
import { CustomTooltip } from '@/components/custom-tooltip';

type Props = {
  data: {
    date: string;
    income: number;
    expenses: number;
  }[]
}
const BarVariant = ({ data }: Props) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value) => format(value, 'dd MMM')}
          style={{ fontSize: '12px' }}
          tickMargin={16}
        />
        <Bar
          dataKey="income"
          fill="#3d82f6"
          className="drop-shadow-sm"
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar
          dataKey="expenses"
          fill="#f43f5e"
          className="drop-shadow-sm"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarVariant;