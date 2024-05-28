'use client';
import React from 'react';
import { useMountedState } from 'react-use';
import { NewAccountSheet } from '@/features/accounts/components/new-account-sheet';
import { EditAccountSheet } from '@/features/accounts/components/edit-account-sheet';

import { NewCategorySheet } from '@/features/categories/components/new-category-sheet';
import { EditCategorySheet } from '@/features/categories/components/edit-category-sheet';


export const SheetProvider = () => {
  // solves hydration error by making sure server component runs before the client component
  const isMounted = useMountedState();
  if (!isMounted) return null;
  return (
    <>
      <NewCategorySheet />
      <EditCategorySheet />
      <NewAccountSheet />
      <EditAccountSheet />
    </>
  );
};

