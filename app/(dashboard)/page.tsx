'use client';


import { DataGrid } from '@/components/data-grid';
import { DataCharts } from '@/components/data-charts';

export default function DashboardPage() {

  return (
    <div className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <DataGrid />
      <DataCharts />
    </div>
  );
}
