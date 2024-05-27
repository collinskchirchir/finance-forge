import { z } from 'zod';
import { useGetAccount } from '@/features/accounts/api/use-get-account';
import { AccountForm } from '@/features/accounts/components/account-form';
import { useOpenAccount } from '@/features/accounts/hooks/use-open-account';


import { insertAccountSchema } from '@/db/schema';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Loader2 } from 'lucide-react';
import { useEditAccount } from '@/features/accounts/api/use-edit-account';

const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () => {
  const { isOpen, onClose, id } = useOpenAccount();

  const accountQuery = useGetAccount(id);
  const editMutation = useEditAccount(id);

  const isPending =
    editMutation.isPending;
  const isLoading = accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  // populate fetched values from query to form
  const defaultValues = accountQuery.data
    ? { name: accountQuery.data.name }
    : { name: '' };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>
            Edit Account
          </SheetTitle>
          <SheetDescription>
            Edit an existing Account
          </SheetDescription>
        </SheetHeader>
        {isLoading
          ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          )
          : (
            <AccountForm
              id={id}
              onSubmit={onSubmit}
              disabled={isPending}
              defaultValues={defaultValues}
            />
          )
        }
      </SheetContent>
    </Sheet>
  );
};