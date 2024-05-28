import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

// Type definitions for the response and request
type ResponseType = InferResponseType<typeof client.api.transactions.$post>
type RequestType = InferRequestType<typeof client.api.transactions.$post>['json']

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.transactions.$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Transaction Created');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      //   TODO: Invalidate summary
    },
    onError: () => {
      toast.error('Failed to Create Transaction');
    },
  });
  return mutation;
};