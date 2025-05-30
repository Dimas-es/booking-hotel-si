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
import { SearchIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  image: string | null;
  created_at: string | null;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    image: "",
  });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  async function fetchUsers() {
    setLoading(true);
    let query = supabase.from("users").select("*").order("created_at", { ascending: false });

    if (roleFilter !== "all") {
      query = query.eq("role", roleFilter);
    }

    const { data, error } = await query;
    if (!error && data) {
      setUsers(data as User[]);
    }
    setLoading(false);
  }

  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.id.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleOpenEdit(user: User) {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email,
      role: user.role,
      image: user.image || "",
    });
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (editingUser) {
      // Update
      const { error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          image: formData.image,
        })
        .eq("id", editingUser.id);
      if (!error) {
        setShowModal(false);
        fetchUsers();
      } else {
        alert("Gagal update user: " + error.message);
      }
    } else {
      // Create
      const { error } = await supabase.from("users").insert([
        {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          image: formData.image,
        },
      ]);
      if (!error) {
        setShowModal(false);
        fetchUsers();
      } else {
        alert("Gagal tambah user: " + error.message);
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
    const { error } = await supabase.from("users").delete().eq("id", deleteId);
    if (!error) {
      fetchUsers();
      setShowDeleteModal(false);
      setDeleteId(null);
    } else {
      alert("Gagal hapus user: " + error.message);
    }
    setLoading(false);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Users</h1>
          <p className="text-gray-500">Manage user accounts and permissions</p>
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
                <Input
                  placeholder="Search by name"
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Select
                value={roleFilter}
                onValueChange={(val) => setRoleFilter(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id.slice(0, 8)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                          <Image
                            src={user.image || "/placeholder.svg"}
                            alt={user.name || user.email}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span>{user.name || "-"}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.role === "user"
                            ? "bg-purple-100 text-black hover:bg-gray-100"
                            : "bg-green-100 text-green-800 hover:bg-green-100"
                        }
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleOpenEdit(user)}
                          className="bg-black text-white hover:bg-gray-800 rounded-lg px-4 py-1 cursor-pointer"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-100 text-red-700 hover:bg-red-200 rounded-lg px-4 py-1 cursor-pointer"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-400">
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal Tambah/Edit User */}
      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 transition-all duration-200">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {editingUser ? "Edit User" : "Add New User"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  required
                  disabled={!!editingUser}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg px-4 py-1 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white hover:bg-gray-800 rounded-lg px-4 py-1 cursor-pointer"
                >
                  {loading ? "Saving..." : editingUser ? "Update" : "Create"}
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
            <DialogTitle>Hapus User?</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-center">
            <div className="mx-auto mb-4 flex items-center justify-center h-14 w-14 rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-lg font-semibold mb-2">Apakah Anda yakin ingin menghapus user ini?</p>
            <p className="text-gray-500 text-sm">Tindakan ini tidak dapat dibatalkan.</p>
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
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
      `}</style>
    </div>
  );
}