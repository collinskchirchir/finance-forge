import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

// Type definitions for the response and request
type ResponseType = InferResponseType<typeof client.api.categories[':id']['$patch']>
type RequestType = InferRequestType<typeof client.api.categories[':id']['$patch']>['json']

export const useEditCategory = (id?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.categories[':id'].$patch({
        json,
        param: { id },
      });
      return await response.json();
    },
    // TODO: Show Toast loading state onMutate
    /** onMutate: () => {
     // Display a toast notification when the mutation starts
     const loadingToast = toast.loading('Updating category...');

     // Return a cleanup function to dismiss the loading toast
     return () => {
     toast.dismiss(loadingToast);
     };
     },
     */
    onSuccess: () => {
      toast.success('Category Updated');
      queryClient.invalidateQueries({ queryKey: ['categories', { id }] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      // TODO: Invalidate summary
    },
    onError: () => {
      toast.error('Failed to Edit Category');
    },
  });
  return mutation;
};