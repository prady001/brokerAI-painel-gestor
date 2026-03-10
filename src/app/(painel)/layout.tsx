import { PanelHeader } from '@/components/panel-header';
import { PanelSidebar } from '@/components/panel-sidebar';

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-bg-deep lg:flex-row relative">
      <div className="grain" aria-hidden />
      <PanelSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <PanelHeader />
        <main className="flex-1 p-6 bg-bg-deep">{children}</main>
      </div>
    </div>
  );
}
