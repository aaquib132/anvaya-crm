import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex h-screen bg-[#F4F7FE] overflow-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-100/40 via-purple-50/20 to-transparent pointer-events-none" />
      
      <Sidebar />

      <main className="flex-1 overflow-y-auto relative z-10 w-full p-4 md:p-8 scroll-smooth">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}