import RootClientLayout from "@/components/RootClientLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootClientLayout>{children}</RootClientLayout>;
} 