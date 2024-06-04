import React from 'react';

type Props = {
  columnIndex: number;
  selectedColumns: Record<string, string | null>;
  onChange: (
    columnIndex: number,
    value: string | null,
  ) => void;
}

const options = [
  'amount',
  'payee',
  'notes',
  'date',
];

const TableHeadSelect = ({ columnIndex, selectedColumns, onChange }: Props) => {

  return (
    <div>
      Select
    </div>
  );
};

export default TableHeadSelect;