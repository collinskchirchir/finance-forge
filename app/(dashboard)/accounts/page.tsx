'use client';
import { useNewAccount } from '@/features/accounts/hooks/use-new-account';
import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const AccountsPage = () => {
  const { onOpen } = useNewAccount();
  return (
    <div>
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="line-clamp-1 text-xl">
            Accounts Page
          </CardTitle>
          <Button size="sm" onClick={onOpen}>
            <Plus className="mr-2 size-4" />
            Add New
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
};

export default AccountsPage;