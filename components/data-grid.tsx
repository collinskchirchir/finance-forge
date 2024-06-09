'use client';

import { useSearchParams } from 'next/navigation';
import { FaPiggyBank } from 'react-icons/fa';
import { useGetSummary } from '@/features/summary/api/use-get-summary';
import { formatDateRange } from '@/lib/utils';
import { DataCard } from '@/components/data-card';
import { FaArrowTrendUp, FaArrowTurnDown } from 'react-icons/fa6';

export const DataGrid = () => {
  const { data } = useGetSummary();

  const params = useSearchParams();
  const to = params.get('to') || undefined;
  const from = params.get('from') || undefined;

  const dateRangeLabel = formatDateRange({ to, from });

  return (
    <div className="mb-8 grid grid-cols-1 gap-8 pb-2 lg:grid-cols-3 ">
      <DataCard
        title="Remaining"
        value={data?.remainingAmount}
        percentageChange={data?.remainingChange}
        icon={FaPiggyBank}
        variant="default"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Income"
        value={data?.incomeAmount}
        percentageChange={data?.incomeChange}
        icon={FaArrowTrendUp}
        variant="default"
        dateRange={dateRangeLabel}
      />
      <DataCard
        title="Expenses"
        value={data?.expensesAmount}
        percentageChange={data?.expensesChange}
        icon={FaArrowTurnDown}
        variant="default"
        dateRange={dateRangeLabel}
      />

    </div>
  );
};