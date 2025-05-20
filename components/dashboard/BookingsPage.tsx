"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { SearchIcon, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type Booking = {
  id: string;
  user_id: string | null;
  room_id: string | null;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  user?: { name: string; image: string | null };
  room?: { room_number: string };
};

type User = {
  id: string;
  name: string;
  image: string | null;
};

type Room = {
  id: string;
  room_number: string;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [formData, setFormData] = useState({
    user_id: "",
    room_id: "",
    check_in_date: "",
    check_out_date: "",
    total_price: "",
    status: "pending",
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
    fetchUsers();
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function fetchBookings() {
    setLoading(true);
    let query = supabase
      .from("bookings")
      .select("*, user:users(id, name, image), room:rooms(id, room_number)")
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (!error && data) {
      setBookings(data as Booking[]);
    }
    setLoading(false);
  }

  async function fetchUsers() {
    const { data } = await supabase.from("users").select("id, name, image");
    if (data) setUsers(data as User[]);
  }

  async function fetchRooms() {
    const { data } = await supabase.from("rooms").select("id, room_number");
    if (data) setRooms(data as Room[]);
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleOpenAdd() {
    setEditingBooking(null);
    setFormData({
      user_id: "",
      room_id: "",
      check_in_date: "",
      check_out_date: "",
      total_price: "",
      status: "pending",
    });
    setShowModal(true);
  }

  function handleOpenEdit(booking: Booking) {
    setEditingBooking(booking);
    setFormData({
      user_id: booking.user_id || "",
      room_id: booking.room_id || "",
      check_in_date: booking.check_in_date,
      check_out_date: booking.check_out_date,
      total_price: booking.total_price.toString(),
      status: booking.status,
    });
    setShowModal(true);
  }

  async function isRoomAvailable(room_id: string, check_in_date: string, check_out_date: string, excludeBookingId: string | null = null) {
    let query = supabase
      .from("bookings")
      .select("id")
      .eq("room_id", room_id)
      .in("status", ["pending", "confirmed"])
      .lt("check_in_date", check_out_date)
      .gt("check_out_date", check_in_date);
    if (excludeBookingId) {
      query = query.neq("id", excludeBookingId);
    }
    const { data, error } = await query;
    return !data || data.length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Cek overlap booking
    const available = await isRoomAvailable(
      formData.room_id,
      formData.check_in_date,
      formData.check_out_date,
      editingBooking ? editingBooking.id : null
    );
    if (!available) {
      alert("Room is already booked for the selected dates!");
      setLoading(false);
      return;
    }

    if (editingBooking) {
      // Update
      const { error } = await supabase
        .from("bookings")
        .update({
          user_id: formData.user_id,
          room_id: formData.room_id,
          check_in_date: formData.check_in_date,
          check_out_date: formData.check_out_date,
          total_price: Number(formData.total_price),
          status: formData.status,
        })
        .eq("id", editingBooking.id);
      if (!error) {
        setShowModal(false);
        fetchBookings();
      } else {
        alert("Gagal update booking: " + error.message);
      }
    } else {
      // Create
      const { error } = await supabase.from("bookings").insert([
        {
          user_id: formData.user_id,
          room_id: formData.room_id,
          check_in_date: formData.check_in_date,
          check_out_date: formData.check_out_date,
          total_price: Number(formData.total_price),
          status: formData.status,
        },
      ]);
      if (!error) {
        setShowModal(false);
        fetchBookings();
      } else {
        alert("Gagal tambah booking: " + error.message);
      }
    }
    setLoading(false);
  }

  function handleDelete(id: string) {
    setShowDeleteModal(true);
    setDeleteId(id);
  }

  async function handleDeleteConfirmed() {
    if (!deleteId) return;
    setLoading(true);
    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", deleteId);
    if (!error) {
      fetchBookings();
      setShowDeleteModal(false);
      setDeleteId(null);
    } else {
      alert("Gagal hapus booking: " + error.message);
    }
    setLoading(false);
  }

  // Filtering & searching
  const filteredBookings = bookings
    .filter((booking) => {
      const guestName = booking.user?.name?.toLowerCase() || "";
      const roomNumber = booking.room?.room_number?.toLowerCase() || "";
      const matchSearch =
        guestName.includes(search.toLowerCase()) ||
        roomNumber.includes(search.toLowerCase()) ||
        booking.id.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      if (sortBy === "price-high") {
        return b.total_price - a.total_price;
      }
      if (sortBy === "price-low") {
        return a.total_price - b.total_price;
      }
      return 0;
    });

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Bookings</h1>
          <p className="text-gray-500">View and manage all reservations</p>
        </div>
        <div className="flex gap-2">
          <Button
            className="gap-1 bg-black text-white hover:bg-gray-800 rounded-lg px-4 py-1 cursor-pointer"
            onClick={handleOpenAdd}
          >
            <Plus className="h-4 w-4" /> Add New Booking
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Booking Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search by guest, room, or booking ID..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">
                      {booking.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full">
                          <Image
                            src={booking.user?.image || "/placeholder.svg"}
                            alt={booking.user?.name || "Guest"}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span>{booking.user?.name || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span>{booking.room?.room_number || "-"}</span>
                    </TableCell>
                    <TableCell>{booking.check_in_date}</TableCell>
                    <TableCell>{booking.check_out_date}</TableCell>
                    <TableCell>Rp. {booking.total_price.toLocaleString("id-ID")}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : booking.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : booking.status === "cancelled"
                            ? "bg-red-100 text-red-800 hover:bg-red-100"
                            : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                        }
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleOpenEdit(booking)}
                          className="bg-black text-white hover:bg-gray-800 rounded-lg px-4 py-1 cursor-pointer"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-100 text-red-700 hover:bg-red-200 rounded-lg px-4 py-1 cursor-pointer"
                          onClick={() => handleDelete(booking.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredBookings.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-gray-400"
                    >
                      No bookings found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Tambah/Edit Booking */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 transition-all duration-200">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {editingBooking ? "Edit Booking" : "Add New Booking"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Guest
                </label>
                <select
                  name="user_id"
                  value={formData.user_id}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  required
                >
                  <option value="">Select guest</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Room</label>
                <select
                  name="room_id"
                  value={formData.room_id}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  required
                >
                  <option value="">Select room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.room_number}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Check-in Date
                </label>
                <input
                  type="date"
                  name="check_in_date"
                  value={formData.check_in_date}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Check-out Date
                </label>
                <input
                  type="date"
                  name="check_out_date"
                  value={formData.check_out_date}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Total Price
                </label>
                <input
                  type="number"
                  name="total_price"
                  value={formData.total_price}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  required
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg px-4 py-1 cursor-pointer"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-black text-white hover:bg-gray-800 rounded-lg px-4 py-1 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Saving..." : editingBooking ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Booking?</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-center">
            <div className="mx-auto mb-4 flex items-center justify-center h-14 w-14 rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-lg font-semibold mb-2">
              Apakah Anda yakin ingin menghapus booking ini?
            </p>
            <p className="text-gray-500 text-sm">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg px-4 py-1 cursor-pointer"
              onClick={() => setShowDeleteModal(false)}
              disabled={loading}
              type="button"
            >
              Batal
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700 rounded-lg px-4 py-1 cursor-pointer"
              onClick={handleDeleteConfirmed}
              disabled={loading}
              type="button"
            >
              {loading ? "Menghapus..." : "Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
      `}</style>
    </div>
  );
}
