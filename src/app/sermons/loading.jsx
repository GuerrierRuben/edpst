export default function Loading() {
  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto">
      <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-md mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
          <div key={i} className="space-y-4">
            <div className="aspect-video bg-gray-200 animate-pulse rounded-2xl"></div>
            <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}