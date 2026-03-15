"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge, SlaIndicator } from "@/components/ui/badge";
import { FilterBar, type FilterConfig } from "@/components/shared/FilterBar";
import type { Application, PaginatedResponse } from "@/lib/types";

export default function GisCasesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [queue, setQueue] = useState("");
  const [tier, setTier] = useState("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["gis-cases", page, status, queue, tier, search],
    queryFn: () =>
      api
        .get<PaginatedResponse<Application>>("/gis/cases", {
          params: {
            page,
            ...(status && { status }),
            ...(queue && { queue }),
            ...(tier && { tier }),
            ...(search && { search }),
          },
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
      key: "processing_tier",
      header: "Processing Tier",
      render: (row: Application) => {
        const tierColors: Record<string, string> = {
          express: "bg-success/10 text-success",
          fast_track: "bg-info/10 text-info",
          regular: "bg-warning/10 text-warning",
        };
        const tier = row.processing_tier || row.tier?.replace("tier_1", "fast_track").replace("tier_2", "regular") || "—";
        const color = tierColors[tier] || "bg-surface text-text-muted";
        return (
          <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${color}`}>
            {tier.replace("_", " ")}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      render: (row: Application) => <StatusBadge status={row.status} />,
    },
    {
      key: "assigned_officer",
      header: "Assigned To",
      render: (row: Application) =>
        row.assigned_officer
          ? `${row.assigned_officer.first_name} ${row.assigned_officer.last_name}`
          : "Unassigned",
    },
    {
      key: "sla_deadline",
      header: "SLA",
      render: (row: Application) => {
        if (!row.sla_deadline) return <span className="text-text-muted">—</span>;
        const hoursLeft = Math.max(
          0,
          (new Date(row.sla_deadline).getTime() - Date.now()) / 3600000
        );
        return (
          <SlaIndicator
            hoursLeft={hoursLeft}
            isWithinSla={hoursLeft > 0}
          />
        );
      },
    },
  ];

  const filters: FilterConfig[] = [
    {
      key: "search",
      type: "search",
      placeholder: "Search by reference...",
      value: search,
      onChange: (value) => {
        setSearch(value);
        setPage(1);
      },
    },
    {
      key: "queue",
      type: "select",
      placeholder: "All Queues",
      value: queue,
      onChange: (value) => {
        setQueue(value);
        setPage(1);
      },
      options: [
        { value: "", label: "All Queues" },
        { value: "review_queue", label: "Review Queue" },
        { value: "approval_queue", label: "Approval Queue" },
      ],
    },
    {
      key: "status",
      type: "select",
      placeholder: "All Statuses",
      value: status,
      onChange: (value) => {
        setStatus(value);
        setPage(1);
      },
      options: [
        { value: "", label: "All Statuses" },
        { value: "submitted", label: "Submitted" },
        { value: "under_review", label: "Under Review" },
        { value: "pending_approval", label: "Pending Approval" },
        { value: "escalated", label: "Escalated" },
        { value: "additional_info_requested", label: "Info Requested" },
        { value: "approved", label: "Approved" },
        { value: "denied", label: "Denied" },
        { value: "issued", label: "Issued" },
      ],
    },
    {
      key: "tier",
      type: "select",
      placeholder: "All Tiers",
      value: tier,
      onChange: (value) => {
        setTier(value);
        setPage(1);
      },
      options: [
        { value: "", label: "All Tiers" },
        { value: "tier_1", label: "Tier 1" },
        { value: "tier_2", label: "Tier 2" },
      ],
    },
  ];

  return (
    <DashboardShell
      title="Case Queue"
      description="Applications assigned to Ghana Immigration Service"
    >
      {/* Filters */}
      <FilterBar filters={filters} />

      <DataTable<Application>
        columns={columns}
        data={data?.data || []}
        currentPage={data?.current_page}
        lastPage={data?.last_page}
        onPageChange={setPage}
        onRowClick={(row) =>
          router.push(`/dashboard/gis/cases/${row.id}`)
        }
        loading={isLoading}
        emptyMessage="No cases found matching your filters."
      />
    </DashboardShell>
  );
}
