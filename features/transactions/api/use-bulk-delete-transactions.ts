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
    onMutate: () => {
      // Display a toast notification when the mutation starts
      toast.loading('Deleting transactions...');
    },
    onSuccess: () => {
      // Remove toast.loading
      toast.dismiss();
      toast.success('Transactions Deleted');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });

    },
    onError: () => {
      toast.error('Failed to Delete Transactions');
    },
  });
  return mutation;
};