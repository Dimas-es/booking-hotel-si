import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table"
import { SearchIcon, Plus } from "lucide-react"

export default function UsersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Users</h1>
          <p className="text-gray-500">Manage user accounts and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export CSV</Button>
          <Button className="gap-1">
            <Plus className="h-4 w-4" /> Add New User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input placeholder="Search by name, email, or user ID..." className="pl-9" />
              </div>
            </div>
            <div>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="host">Host</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select defaultValue="active">
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full">
                          <Image
                            src={user.avatar || "/placeholder.svg"}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.role === "Admin"
                            ? "bg-purple-100 text-purple-800 hover:bg-purple-100"
                            : user.role === "Host"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : "bg-green-100 text-green-800 hover:bg-green-100"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.joined}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.status === "Active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : user.status === "Inactive"
                              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                        <Button size="sm">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">Showing 1-6 of 124 users</div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" className="bg-blue-50">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const users = [
  {
    id: "U-7254",
    name: "Emma Rodriguez",
    email: "emma.rodriguez@example.com",
    role: "Admin",
    joined: "Mar 15, 2023",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "U-6423",
    name: "James Smith",
    email: "james.smith@example.com",
    role: "Host",
    joined: "Jun 22, 2023",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "U-5891",
    name: "Olivia Johnson",
    email: "olivia.johnson@example.com",
    role: "Guest",
    joined: "Sep 10, 2023",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "U-5473",
    name: "William Brown",
    email: "william.brown@example.com",
    role: "Host",
    joined: "Jan 05, 2024",
    status: "Inactive",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "U-4981",
    name: "Sophia Miller",
    email: "sophia.miller@example.com",
    role: "Guest",
    joined: "Feb 18, 2024",
    status: "Active",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: "U-4652",
    name: "Noah Davis",
    email: "noah.davis@example.com",
    role: "Guest",
    joined: "Apr 30, 2024",
    status: "Blocked",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]
