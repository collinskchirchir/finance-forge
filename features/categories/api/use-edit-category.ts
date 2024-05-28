import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

// Type definitions for the response and request
type ResponseType = InferResponseType<typeof client.api.accounts[':id']['$patch']>
type RequestType = InferRequestType<typeof client.api.accounts[':id']['$patch']>['json']

export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.accounts[':id'].$patch({
        json,
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Account Updated');
      queryClient.invalidateQueries({ queryKey: ['accounts', { id }] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      // TODO: Invalidate summary and transactions
    },
    onError: () => {
      toast.error('Failed to Edit Account');
    },
  });
  return mutation;
};