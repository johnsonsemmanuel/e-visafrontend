"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import type { Application, PaginatedResponse } from "@/lib/types";

export default function ApplicationsListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["applicant-applications", page],
    queryFn: () =>
      api
        .get<PaginatedResponse<Application>>("/applicant/applications", {
          params: { page },
        })
        .then((r) => r.data),
  });

  const columns = [
    {
      key: "reference_number",
      header: "Reference",
      render: (row: Application) => (
        <span className="font-medium text-text-primary">
          {row.reference_number}
        </span>
      ),
    },
    {
      key: "visa_type",
      header: "Visa Type",
      render: (row: Application) => row.visa_type?.name || "—",
    },
    {
      key: "status",
      header: "Status",
      render: (row: Application) => <StatusBadge status={row.status} />,
    },
    {
      key: "payment",
      header: "Payment",
      render: (row: Application) => {
        if (!row.payment) return <span className="text-text-muted">—</span>;
        const color =
          row.payment.status === "completed"
            ? "text-success"
            : row.payment.status === "failed"
              ? "text-danger"
              : "text-warning";
        return (
          <span className={`text-sm font-medium ${color} capitalize`}>
            {row.payment.status}
          </span>
        );
      },
    },
    {
      key: "created_at",
      header: "Created",
      render: (row: Application) =>
        new Date(row.created_at).toLocaleDateString(),
    },
  ];

  return (
    <DashboardShell
      title="My Applications"
      description="View and manage all your visa applications"
      actions={
        <Button
          leftIcon={<Plus size={16} />}
          onClick={() => router.push("/dashboard/applicant/applications/new")}
        >
          New Application
        </Button>
      }
    >
      <DataTable<Application>
        columns={columns}
        data={data?.data || []}
        currentPage={data?.current_page}
        lastPage={data?.last_page}
        onPageChange={setPage}
        onRowClick={(row) =>
          router.push(`/dashboard/applicant/applications/${row.id}`)
        }
        loading={isLoading}
        emptyMessage="No applications found. Start by creating a new application."
      />
    </DashboardShell>
  );
}
