export default function SideBarSkeleton() {
  return [1, 2, 3, 4, 5].map((i) => (
    <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-xl mt-2" />
  ));
}
