export default function StatsLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="space-y-3">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="h-12 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 