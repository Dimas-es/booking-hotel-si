import { TopHotels } from "./TopHotels"
import { RecentBookings } from "./RecentBookings"
import { StatCard } from "./StatCard"

export default function StatsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value="1,234"
          change="+12.5%"
          trend="up"
        />
        <StatCard
          title="Active Hotels"
          value="89"
          change="+5.2%"
          trend="up"
        />
        <StatCard
          title="Total Revenue"
          value="$45,678"
          change="+8.3%"
          trend="up"
        />
        <StatCard
          title="Active Users"
          value="2,345"
          change="+15.7%"
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top Performing Hotels</h2>
          <TopHotels />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>
          <RecentBookings />
        </div>
      </div>
    </div>
  )
} 