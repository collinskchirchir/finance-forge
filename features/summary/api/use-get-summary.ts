import { client } from '@/lib/hono';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { convertAmountFromMiliuinits } from '@/lib/utils';


export const useGetSummary = () => {
  const params = useSearchParams();
  const from = params.get('from') || '';
  const to = params.get('to') || '';
  const accountId = params.get('accountId') || '';
  const query = useQuery({
    // TODO: Check if params are needed in the key.
    queryKey: ['summary', { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.summary.$get({ query: { from, to, accountId } });
      if (!response.ok) {
        throw new Error('Failed to fetch summary');
      }
      const { data } = await response.json();
      return {
        ...data,
        incomeAmount: convertAmountFromMiliuinits(data.incomeAmount),
        expensesAmount: convertAmountFromMiliuinits(data.expensesAmount),
        remainingAmount: convertAmountFromMiliuinits(data.remainingAmount),
        categories: data.categories.map((category) => ({
          ...category,
          value: convertAmountFromMiliuinits(category.value),
        })),
        days: data.days.map((day) => ({
          ...day,
          income: convertAmountFromMiliuinits(day.income),
          expenses: convertAmountFromMiliuinits(day.expenses),
        })),
      };
    },
  });
  return query;
};