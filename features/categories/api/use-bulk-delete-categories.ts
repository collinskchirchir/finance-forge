import { toast } from 'sonner';
import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { client } from '@/lib/hono';

// Type definitions for the response and request
type ResponseType = InferResponseType<typeof client.api.categories['bulk-delete']['$post']>
type RequestType = InferRequestType<typeof client.api.categories['bulk-delete']['$post']>['json']

export const useBulkDeleteCategories = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.categories['bulk-delete'].$post({ json });
      return await response.json();
    },
    // TODO: Show Toast bulk delete categories loading state onMutate
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
      toast.success('Categories Deleted');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      //   TODO: Also invalidate summary
    },
    onError: () => {
      toast.error('Failed to Delete Categories');
    },
  });
  return mutation;
};