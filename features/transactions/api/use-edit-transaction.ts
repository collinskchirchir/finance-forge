import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

// Type definitions for the response and request
type ResponseType = InferResponseType<typeof client.api.transactions[':id']['$patch']>
type RequestType = InferRequestType<typeof client.api.transactions[':id']['$patch']>['json']

export const useEditTransaction = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions[':id'].$patch({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Transaction Updated');
      queryClient.invalidateQueries({ queryKey: ['transactions', { id }] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      // TODO: Invalidate summary
    },
    onError: () => {
      toast.error('Failed to Edit Transaction');
    },
  });
  return mutation;
};