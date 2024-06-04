import React from 'react';
import { useOpenTransaction } from '@/features/transactions/hooks/use-open-transaction';
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction';
import { useConfirm } from '@/hooks/use-confirm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, MoreHorizontal, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  id: string;
}

const Actions = ({ id }: Props) => {
  const [ConfirmDialog, confirm] = useConfirm(
    'Are you sure?',
    'You are about to delete this transaction.',
  );
  const deleteMutation = useDeleteTransaction(id);
  const isDisabled = deleteMutation.isPending;
  const { onOpen } = useOpenTransaction();
  const handleDelete = async () => {
    const ok = await confirm();
    if (ok) {
      deleteMutation.mutate();
    }
  };
  return (
    <>
      <ConfirmDialog />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="size-8 p-0"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            disabled={isDisabled}
            onClick={() => {
              onOpen(id);
            }}
          >
            <Edit className="mr-2 size-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            disabled={isDisabled}
            onClick={handleDelete}
          >
            <Trash className="mr-2 size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </>
  );
};

export default Actions;