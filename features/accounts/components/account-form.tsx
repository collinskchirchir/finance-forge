import React from 'react';
import { insertAccountSchema } from '@/db/schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Loader2, Trash } from 'lucide-react';

const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>

type Props = {
  id?: string,
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean

}

export const AccountForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        {/* Name */}
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="e.g. Cash, Bank, Credit Card" {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/*  Submit/ Save Changes */}
        <Button className="w-full" disabled={disabled}>
          {disabled && (
            <Loader2
              className="mr-2 size-4 animate-spin"
              aria-hidden="true"
            />
          )}
          {id ? 'Save Changes' : 'Create Account'}
        </Button>

        {!!id &&
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            variant="outline"
            className="w-full"
          >
            <Trash className="mr-2 size-4" />
            Delete Account
          </Button>}
      </form>

    </Form>
  );
};

