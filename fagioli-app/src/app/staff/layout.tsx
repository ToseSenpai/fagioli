import { Sidebar } from "@/components/staff/Sidebar";

export const metadata = {
  title: "Staff Dashboard | Carrozzeria Fagioli",
};

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Sidebar />
      {/* Main content */}
      <main className="lg:pl-72 pt-14 lg:pt-0">
        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
