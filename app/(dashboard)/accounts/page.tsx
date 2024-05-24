'use client';
import { Plus } from 'lucide-react';

import React from 'react';
import { useNewAccount } from '@/features/accounts/hooks/use-new-account';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { columns, Payment } from '@/app/(dashboard)/accounts/columns';
import { DataTable } from '@/components/data-table';

const data: Payment[] = [
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  // ...
];

const AccountsPage = () => {
  const { onOpen } = useNewAccount();
  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card className="bo\rder-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="line-clamp-1 text-xl">
            Accounts Page
          </CardTitle>
          <Button size="sm" onClick={onOpen}>
            <Plus className="mr-2 size-4" />
            Add New
          </Button>
        </CardHeader>

        {/* Account Data Table */}
        <CardContent>
          <DataTable columns={columns} data={data} />
        </CardContent>
        
      </Card>
    </div>
  );
};

export default AccountsPage;