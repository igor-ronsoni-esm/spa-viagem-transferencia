import SideBarSkeleton from "./components/side-bar/SideBarSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex bg-page-bg">
      <aside className="w-80 shrink-0 border-r bg-white p-2">
        <div className="h-10 animate-pulse rounded bg-gray-100" />
        <div className="mt-3">
          <SideBarSkeleton />
        </div>
      </aside>

      <main className="flex-1 p-6">
        <div className="h-8 w-56 animate-pulse rounded bg-gray-100" />
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="h-28 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-28 animate-pulse rounded-xl bg-gray-100" />
        </div>
      </main>
    </div>
  );
}