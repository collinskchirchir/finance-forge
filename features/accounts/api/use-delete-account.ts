import { toast } from 'sonner';
import { InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

// Type definitions for the response and request
type ResponseType = InferResponseType<typeof client.api.accounts[':id']['$delete']>

export const useDeleteAccount = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.accounts[':id'].$delete({
        param: { id },
      });
      return await response.json();
    },
    onMutate: () => {
      // Display a toast notification when the mutation starts
      toast.loading('Deleting account...');
    },
    onSuccess: () => {
      // Remove toast.loading
      toast.dismiss();
      toast.success('Account Deleted');
      queryClient.invalidateQueries({ queryKey: ['accounts', { id }] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
    onError: () => {
      toast.error('Failed to Delete Account');
    },
  });
  return mutation;
};