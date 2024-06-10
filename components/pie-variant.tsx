import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatPercentage } from '@/lib/utils';
import { CategoryTooltip } from '@/components/category-tooltip';

const COLORS = ['#0062FF', '#12C6FF', '#FF647F', '#FF9354'];
type Props = {
  data?: {
    name: string;
    value: number;
  }[]
}

export const PieVariant = ({ data }: Props) => {
  // Calculate total value for percentage calculation
  const totalValue = data?.reduce((acc, entry) => acc + entry.value, 0) || 0;
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="right"
          iconType="circle"
          content={({ payload }: any) => {
            return (
              <ul className="">
                {payload.map((entry: any, index: number) => {
                  // Calculate percentage for each entry
                  const percentage = totalValue ? (entry.payload.value / totalValue) * 100 : 0;
                  return (
                    <li
                      key={`item-${index}`}
                      className="flex items-center space-x-2"
                    >
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <div className="space-x-1">
                        <span className="text-sm text-muted-foreground">
                          {entry.value}
                        </span>
                        <span className="text-sm">
                          {formatPercentage(percentage)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            );
          }}
        />
        <Tooltip content={CategoryTooltip} />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={60}
          paddingAngle={2}
          fill="8884d8"
          dataKey="value"
          labelLine={false}
        >
          {data?.map((_entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};