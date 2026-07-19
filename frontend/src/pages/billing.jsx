
import { useInvoices } from "@/lib/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ChartTooltip } from "@/components/shared/brand-backdrop";
import { LoadingState, EmptyState } from "@/components/shared/states";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  CreditCard,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  Download,
  FileText,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const statusMeta = {
  paid: {
    label: "Paid",
    class: "bg-success/10 text-success",
  },
  pending: {
    label: "Pending",
    class: "bg-warning/15 text-warning",
  },
  overdue: {
    label: "Overdue",
    class: "bg-destructive/10 text-destructive",
  },
  draft: {
    label: "Draft",
    class: "bg-muted text-muted-foreground",
  },
};

export function BillingPage() {
  const { data: invoices, isLoading } = useInvoices();

  const totalBilled = invoices?.reduce((s, i) => s + i.amount, 0) ?? 0;
  const totalPaid =
    invoices
      ?.filter((i) => i.status === "paid")
      .reduce((s, i) => s + i.amount, 0) ?? 0;
  const outstanding =
    invoices
      ?.filter((i) => i.status === "pending" || i.status === "overdue")
      .reduce((s, i) => s + i.amount, 0) ?? 0;
  const overdue =
    invoices
      ?.filter((i) => i.status === "overdue")
      .reduce((s, i) => s + i.amount, 0) ?? 0;

  const chartData =
    invoices?.map((i) => ({
      name: i.number,
      amount: i.amount,
      status: i.status,
    })) ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Billing"
        description="Invoices, payments & spending overview"
        icon={CreditCard}
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Billed"
          value={formatCurrency(totalBilled)}
          icon={IndianRupee}
          iconClass="bg-primary/10 text-primary"
        />
        <StatCard
          label="Total Paid"
          value={formatCurrency(totalPaid)}
          icon={TrendingUp}
          iconClass="bg-success/10 text-success"
        />
        <StatCard
          label="Outstanding"
          value={formatCurrency(outstanding)}
          icon={FileText}
          iconClass="bg-warning/10 text-warning"
        />
        <StatCard
          label="Overdue"
          value={formatCurrency(overdue)}
          icon={AlertCircle}
          iconClass="bg-destructive/10 text-destructive"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>Spend by invoice</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(v) => `$${v / 1000}k`}
              />
              <Tooltip
                content={<ChartTooltip formatter={(v) => formatCurrency(v)} />}
                cursor={{ fill: "hsl(var(--muted))" }}
              />
              <Bar
                dataKey="amount"
                name="Amount"
                radius={[6, 6, 0, 0]}
                fill="hsl(var(--chart-1))"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>{invoices?.length} invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingState />
          ) : invoices && invoices.length > 0 ? (
            <div className="overflow-x-auto scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead>Invoice</TableHead>
                    <TableHead>Issued</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Shipments
                    </TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-xs font-semibold">
                        {inv.number}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(inv.issuedAt)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(inv.dueAt)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-xs">
                        {inv.shipments}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(inv.amount)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium",
                            statusMeta[inv.status].class,
                          )}
                        >
                          {statusMeta[inv.status].label}
                        </span>
                      </TableCell>
                      <TableCell>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted">
                          <Download className="h-4 w-4" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              icon={CreditCard}
              title="No invoices"
              description="Invoices will appear here once you have billing activity."
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}