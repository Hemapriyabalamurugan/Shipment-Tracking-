
import { useRoles } from "@/lib/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { LoadingState } from "@/components/shared/states";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Users, Lock, Check, X, Shield } from "lucide-react";

export function RoleManagementPage() {
  const { data: roles, isLoading } = useRoles();

  if (isLoading) {
    return (
      <div>
        <PageHeader
          title="Role Management"
          description="Define permissions for each role"
          icon={ShieldCheck}
        />
        <LoadingState />
      </div>
    );
  }

  const totalUsers = roles?.reduce((s, r) => s + r.users, 0) ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Role Management"
        description="Role-based access control & permission matrix"
        icon={ShieldCheck}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Roles"
          value={roles?.length ?? 0}
          icon={Shield}
          iconClass="bg-primary/10 text-primary"
        />  
        <StatCard
          label="Total Users"
          value={totalUsers.toLocaleString()}
          icon={Users}
          iconClass="bg-chart-6/10 text-chart-6"
        />
        <StatCard
          label="Admin Accounts"
          value={roles?.find((r) => r.id === "admin")?.users ?? 0}
          icon={ShieldCheck}
          iconClass="bg-chart-4/10 text-chart-4"
        />
        
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {roles?.map((role) => (
          <Card key={role.id} className="transition hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                    style={{ background: role.color }}
                  >
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold">{role.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {role.users.toLocaleString()} users
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">
                  {role.id}
                </Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {role.description}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs text-muted-foreground">
                  {role.permissions.length} modules
                </span>
                <span className="text-xs font-semibold text-success">
                  {role.permissions.reduce(
                    (s, p) => s + p.actions.filter((a) => a.allowed).length,
                    0,
                  )}{" "}
                  permissions
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>
                Actions allowed per module, per role
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-3 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Role
                  </th>
                  <th className="py-3 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Module
                  </th>
                  {[
                    "View",
                    "Create",
                    "Edit",
                    "Delete",
                    "Assign",
                    // "Dispatch",
                    // "Optimize",
                    // "Pay",
                    // "Export",
                    // "Deploy",
                    // "Close",
                    // "Admin",
                  ].map((action) => (
                    <th
                      key={action}
                      className="px-2 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {action}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roles?.flatMap((role) =>
                  role.permissions.map((perm, i) => (
                    <tr
                      key={`${role.id}-${perm.module}`}
                      className="border-b border-border/60 hover:bg-muted/30"
                    >
                      {i === 0 && (
                        <td
                          rowSpan={role.permissions.length}
                          className="py-3 pr-4 align-top"
                        >
                          <span
                            className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-semibold"
                            style={{
                              background: `${role.color}1a`,
                              color: role.color,
                            }}
                          >
                            <ShieldCheck className="h-3 w-3" /> {role.name}
                          </span>
                        </td>
                      )}
                      <td className="py-3 pr-4 text-sm font-medium">
                        {perm.module}
                      </td>
                      {[
                        "View",
                        "Create",
                        "Edit",
                        "Delete",
                        "Assign",
                        // "Dispatch",
                        // "Optimize",
                        // "Pay",
                        // "Export",
                        // "Deploy",
                        // "Close",
                        // "Admin",
                      ].map((actionName) => {
                        const action = perm.actions.find((a) =>
                          a.label.startsWith(actionName),
                        );
                        return (
                          <td
                            key={actionName}
                            className="px-2 py-3 text-center"
                          >
                            {action ? (
                              action.allowed ? (
                                <Check className="mx-auto h-4 w-4 text-success" />
                              ) : (
                                <X className="mx-auto h-4 w-4 text-muted-foreground/40" />
                              )
                            ) : (
                              <span className="mx-auto block h-1 w-1 rounded-full bg-muted-foreground/20" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}