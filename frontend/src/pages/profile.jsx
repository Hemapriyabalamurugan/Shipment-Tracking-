
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { initials, formatDate } from "@/lib/utils";
import { ROLE_LABELS } from "@/types";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  Check,
  Camera,
} from "lucide-react";
import { toast } from "sonner";

export function ProfilePage() {
  // =================================================
  // const { user, updateProfile } = useAuth();
  // const [form, setForm] = useState({
  //   name: user.name,
  //   email: user.email,
  //   phone: user.phone ?? "",
  //   company: user.company ?? "",
  //   jobTitle: user.jobTitle ?? "",
  //   location: user.location ?? "",
  // });

  const [form, setForm] = useState({
    name: user.name ?? `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone ?? "",
    company: user.company ?? user.companyName ?? "",
    jobTitle: user.jobTitle ?? "",
    location: user.location ?? "",
  });
  // =====================================================

  
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Profile"
        description="Manage your personal information"
        icon={User}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-6 text-center">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                {/* <AvatarFallback className="bg-primary text-2xl font-bold text-primary-foreground">
                  {initials(user.name)}
                </AvatarFallback> */}
                <AvatarFallback className="bg-primary text-2xl font-bold text-primary-foreground">
                  {initials(user.name ?? `${user.firstName} ${user.lastName}`)}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card shadow-md transition hover:bg-muted">
                <Camera className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            {/* <h2 className="mt-4 text-lg font-bold">{user.name}</h2> */}
            <h2 className="mt-4 text-lg font-bold">
              {user.name ?? `${user.firstName} ${user.lastName}`}
            </h2>
            <p className="text-sm text-muted-foreground">{user.jobTitle}</p>
            <Badge variant="secondary" className="mt-2">
              {ROLE_LABELS[user.role]}
            </Badge>
            <Separator className="my-4" />
            <div className="w-full space-y-2.5 text-left">
              <InfoRow icon={Mail} value={user.email} />
              <InfoRow icon={Phone} value={user.phone ?? "—"} />
              <InfoRow icon={Building2} value={user.company ?? "—"} />
              <InfoRow icon={MapPin} value={user.location ?? "—"} />
              <InfoRow
                icon={Calendar}
                value={`Joined ${formatDate(user.joinedAt)}`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
              />
              <Field
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
              />
              <Field
                label="Phone"
                value={form.phone}
                onChange={(v) => setForm({ ...form, phone: v })}
              />
              <Field
                label="Job title"
                value={form.jobTitle}
                onChange={(v) => setForm({ ...form, jobTitle: v })}
              />
              <Field
                label="Company"
                value={form.company}
                onChange={(v) => setForm({ ...form, company: v })}
              />
              <Field
                label="Location"
                value={form.location}
                onChange={(v) => setForm({ ...form, location: v })}
              />
            </div>
            <Separator />
            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  "Saving…"
                ) : (
                  <>
                    <Check className="mr-1.5 h-4 w-4" />
                    Save changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-2.5 text-sm">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 truncate text-muted-foreground">{value}</span>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}