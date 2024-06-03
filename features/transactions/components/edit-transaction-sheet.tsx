import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useGetTransaction } from '@/features/transactions/api/use-get-transaction';
import { TransactionForm } from '@/features/transactions/components/transaction-form';
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction';


import { useConfirm } from '@/hooks/use-confirm';
import { insertTransactionSchema } from '@/db/schema';
import { useEditTransaction } from '@/features/transactions/api/use-edit-transaction';
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction';

import { useCreateCategory } from '@/features/categories/api/use-create-category';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const formSchema = insertTransactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditTransactionSheet = () => {
  const { isOpen, onClose, id } = useOpenTransaction();

  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'You are about to delete transaction.',
  );

  const transactionQuery = useGetTransaction(id);
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);

  // Fetch Categories and mapped them fit Categories Select option
  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCategory = (name: string) => categoryMutation.mutate({
    name,
  });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  // Fetch Categories and mapped them fit Categories Select option
  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({
    name,
  });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending =
    editMutation.isPending ||
    deleteMutation.isPending ||
    transactionQuery.isLoading ||
    categoryMutation.isPending ||
    accountMutation.isPending;

  const isLoading =
    transactionQuery.isLoading ||
    categoryQuery.isLoading ||
    accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    editMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const onDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate(undefined, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  // populate fetched values from query to form
  const defaultValues = transactionQuery.data
    ? {
      accountId: transactionQuery.data.accountId,
      categoryId: transactionQuery.data.categoryId,
      amount: transactionQuery.data.amount.toString(),
      date: transactionQuery.data.date
        ? new Date(transactionQuery.data.date)
        : new Date(),
      payee: transactionQuery.data.payee,
      notes: transactionQuery.data.notes,
    }
    : {
      accountId: '',
      categoryId: '',
      amount: '',
      date: new Date(),
      payee: '',
      notes: '',
    };

  return (
    <>
      <ConfirmDialog />
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>
              Edit Transaction
            </SheetTitle>
            <SheetDescription>
              Edit an existing Transaction
            </SheetDescription>
          </SheetHeader>
          {isLoading
            ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            )
            : (
              <TransactionForm
                id={id}
                defaultValues={defaultValues}
                onSubmit={onSubmit}
                onDelete={onDelete}
                disabled={isPending}
                categoryOptions={categoryOptions}
                onCreateCategory={onCreateCategory}
                accountOptions={accountOptions}
                onCreateAccount={onCreateAccount}
              />
            )
          }
        </SheetContent>
      </Sheet>
    </>
  );
};