import { useOpenCategory } from '@/features/categories/hooks/use-open-category';
import { TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  id: string;
  category: string | null;
  categoryId: string | null;
}

export const CategoryColumn = ({ category, categoryId }: Props) => {
  const { onOpen: onOpenCategory } = useOpenCategory();
  const onClick = () => {
    if (categoryId) {
      onOpenCategory(categoryId);
    }
  };
  return (
    <div
      onClick={onClick}
      className={cn('flex cursor-pointer items-center hover:underline',
        !category && 'text-rose-500')}
    >
      {!category && <TriangleAlert className="mr-2 size-4 shrink-0" />}
      {category || 'Uncategorized'}
    </div>
  );
};