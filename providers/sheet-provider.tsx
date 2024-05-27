'use client';
import React from 'react';
import { useMountedState } from 'react-use';
import { NewAccountSheet } from '@/features/accounts/components/new-account-sheet';
import { EditAccountSheet } from '@/features/accounts/components/edit-account-sheet';

export const SheetProvider = () => {
  // solves hydration error by making sure server component runs before the client component
  const isMounted = useMountedState();
  if (!isMounted) return null;
  return (
    <>
      <NewAccountSheet />
      <EditAccountSheet />
    </>
  );
};

