import { toast } from 'sonner';
import { InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

// Type definitions for the response and request
type ResponseType = InferResponseType<typeof client.api.categories[':id']['$delete']>

export const useDeleteCategory = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.categories[':id'].$delete({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success('Category Deleted');
      queryClient.invalidateQueries({ queryKey: ['categories', { id }] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      // TODO: Invalidate summary
    },
    onError: () => {
      toast.error('Failed to Delete Category');
    },
  });
  return mutation;
};