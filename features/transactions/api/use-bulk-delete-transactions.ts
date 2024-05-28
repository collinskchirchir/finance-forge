import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

// Type definitions for the response and request
type ResponseType = InferResponseType<typeof client.api.transactions['bulk-delete']['$post']>
type RequestType = InferRequestType<typeof client.api.transactions['bulk-delete']['$post']>['json']

export const useBulkDeleteTransactions = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions['bulk-delete'].$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Transactions Deleted');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      //   TODO: Also invalidate summary
    },
    onError: () => {
      toast.error('Failed to Delete Transactions');
    },
  });
  return mutation;
};