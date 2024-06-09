import { IconType } from 'react-icons';
import { cva, VariantProps } from 'class-variance-authority';
import { cn, formatCurrency, formatPercentage } from '@/lib/utils';
import { CountUp } from '@/components/ui/count-up';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const boxVariant = cva(
  'shrink-0 rounded-md p-3',
  {
    variants: {
      variant: {
        default: 'bg-blue-500/20',
        success: 'bg-emerald-500/20',
        danger: 'bg-rose-500/20',
        warning: 'bg-yellow-500/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);
const iconVariant = cva(
  'size-6 ',
  {
    variants: {
      variant: {
        default: 'fill-blue-500',
        success: 'fill-emerald-500',
        danger: 'fill-rose-500',
        warning: 'fill-yellow-500',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type BoxVariants = VariantProps<typeof boxVariant>
type IconVariants = VariantProps<typeof iconVariant>

interface DataCardProps extends BoxVariants, IconVariants {
  icon: IconType;
  title: string;
  value?: number;
  dateRange: string;
  percentageChange?: number;
}

export const DataCard = ({
                           icon: Icon, title, value = 0, variant, dateRange, percentageChange = 0,
                         }: DataCardProps) => {
  return (
    <Card className="border-none drop-shadow-sm">

      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <CardTitle className="line-clamp-1 text-2xl">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp-1 ">
            {dateRange}
          </CardDescription>
        </div>
        <div className={cn(boxVariant({ variant }))}>
          <Icon className={cn(iconVariant({ variant }))} />
        </div>
      </CardHeader>
      <CardContent>
        <h1 className="mb-2 line-clamp-1 text-2xl font-bold">
          <CountUp
            preserveValue
            start={0}
            end={value}
            decimals={2}
            decimalPlaces={2}
            formattingFn={formatCurrency}
          />
        </h1>
        <p className={cn('text-muted-foreground text-sm line-clamp-1',
          percentageChange > 0 && 'text-emerald-500',
          percentageChange < 0 && 'text-rose-500')}>
          {formatPercentage(percentageChange)} from last period
        </p>
      </CardContent>
    </Card>
  );
};