"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function RoomList() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    room_number: "",
    room_type: "",
    price_per_night: "",
    capacity: "",
    amenities: "",
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  // Fetch rooms dari Supabase
  const fetchRooms = async () => {
    const { data } = await supabase.from("rooms").select("*, room_images(*)");
    setRooms(data || []);
  };

  // Fungsi untuk menghandle perubahan input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fungsi untuk mengupload gambar ke Cloudinary
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
      throw new Error("Cloudinary upload preset is not set in environment variables");
    }
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
    );
    formData.append("folder", "booking-hotel");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (data?.secure_url) {
      return data.secure_url;
    } else {
      throw new Error("Gagal mendapatkan URL gambar dari Cloudinary");
    }
  };

  // Fungsi untuk menambahkan room
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { room_number, room_type, price_per_night, capacity, amenities } =
      formData;

    setIsLoading(true);

    try {
      const { data: roomData, error } = await supabase
        .from("rooms")
        .insert([
          {
            room_number,
            room_type,
            price_per_night: parseFloat(price_per_night),
            capacity: parseInt(capacity),
            amenities: amenities
              ? amenities.split(",").map((item) => item.trim())
              : null,
          },
        ])
        .select()
        .single();

      if (error) {
        alert("Gagal menambahkan room: " + error.message);
        setIsLoading(false);
        return;
      }

      if (image) {
        try {
          const imageUrl = await uploadToCloudinary(image);

          const { error: imageInsertError } = await supabase
            .from("room_images")
            .insert([
              {
                room_id: roomData.id,
                image_url: imageUrl,
                is_primary: true,
              },
            ]);

          if (imageInsertError) {
            console.error(
              "Gagal menyimpan gambar ke database:",
              imageInsertError.message
            );
            alert(
              "Gagal menyimpan gambar ke database: " + imageInsertError.message
            );
          }
        } catch (err: any) {
          console.error("Error uploading image:", err);
          alert("Error uploading image: " + err.message);
        }
      }

      setShowModal(false);
      setFormData({
        room_number: "",
        room_type: "",
        price_per_night: "",
        capacity: "",
        amenities: "",
      });
      setImage(null);
      setImagePreview(null);
      fetchRooms();
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menghandle klik edit
  const handleEditClick = (room: any) => {
    setEditingRoom(room);
    setFormData({
      room_number: room.room_number,
      room_type: room.room_type,
      price_per_night: String(room.price_per_night),
      capacity: String(room.capacity),
      amenities: room.amenities?.join(", ") || "",
    });
    setImagePreview(room.room_images?.[0]?.image_url || null);
    setShowModal(true);
  };

  // Fungsi untuk memperbarui room
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingRoom) return;

    const { room_number, room_type, price_per_night, capacity, amenities } =
      formData;

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase
        .from("rooms")
        .update({
          room_number,
          room_type,
          price_per_night: parseFloat(price_per_night),
          capacity: parseInt(capacity),
          amenities: amenities
            ? amenities.split(",").map((item) => item.trim())
            : null,
        })
        .eq("id", editingRoom.id);

      if (updateError) {
        throw new Error("Gagal memperbarui data kamar: " + updateError.message);
      }

      if (image) {
        const imageUrl = await uploadToCloudinary(image);

        // Opsional: Hapus gambar lama jika hanya ingin satu gambar utama
        await supabase
          .from("room_images")
          .delete()
          .eq("room_id", editingRoom.id)
          .eq("is_primary", true);

        const { error: imageInsertError } = await supabase
          .from("room_images")
          .insert([
            {
              room_id: editingRoom.id,
              image_url: imageUrl,
              is_primary: true,
            },
          ]);

        if (imageInsertError) {
          throw new Error(
            "Gagal menyimpan gambar ke database: " + imageInsertError.message
          );
        }
      }

      alert("Data kamar berhasil diperbarui!");
      setEditingRoom(null);
      setFormData({
        room_number: "",
        room_type: "",
        price_per_night: "",
        capacity: "",
        amenities: "",
      });
      setImage(null);
      setImagePreview(null);
      fetchRooms();
      setShowModal(false);
    } catch (error: any) {
      console.error(error);
      alert("Terjadi kesalahan saat memperbarui data kamar: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi untuk menghapus room
  const handleDelete = async (roomId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus room ini?")) return;

    const { error } = await supabase.from("rooms").delete().eq("id", roomId);
    if (error) {
      alert("Gagal menghapus room: " + error.message);
      return;
    }

    fetchRooms();
  };

  // Fungsi untuk menghandle perubahan gambar
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Rooms</h1>
          <p className="text-gray-500">View and manage all rooms</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setShowModal(true);
              setEditingRoom(null);
              setFormData({
                room_number: "",
                room_type: "",
                price_per_night: "",
                capacity: "",
                amenities: "",
              });
              setImage(null);
              setImagePreview(null);
            }}
            className="gap-1 bg-black text-white hover:bg-gray-800 rounded-lg px-4 py-2"
          >
            <Plus className="h-4 w-4" /> Add New Room
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border rounded-xl shadow-lg p-5 bg-white hover:shadow-2xl transition-shadow duration-200 flex flex-col"
          >
            <div className="flex items-center gap-4 mb-3">
              {room.room_images && room.room_images.length > 0 && (
                <Image
                  src={room.room_images[0].image_url}
                  alt="Room Image"
                  width={120}
                  height={80}
                  className="object-cover rounded-lg border"
                />
              )}
              <div className="flex-1">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  {room.room_number}
                  <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">
                    {room.room_type}
                  </span>
                </h2>
                <div className="text-gray-600 text-sm mt-1">
                  <span className="font-semibold">Price:</span> Rp. {room.price_per_night}
                  <span className="mx-2">|</span>
                  <span className="font-semibold">Capacity:</span> {room.capacity}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {room.amenities?.map((am: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-xs px-2 py-0.5 rounded-full"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-auto">
              <Button
                onClick={() => handleEditClick(room)}
                className="bg-black text-white hover:bg-gray-800 rounded-lg px-4 py-1"
              >
                Edit
              </Button>
              <Button
                onClick={() => handleDelete(room.id)}
                className="bg-red-100 text-red-700 hover:bg-red-200 rounded-lg px-4 py-1"
              >
                Hapus
              </Button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex justify-center items-center z-50 transition-all duration-200">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {editingRoom ? "Update Room" : "Add New Room"}
            </h2>
            <form
              onSubmit={editingRoom ? handleUpdate : handleSubmit}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold mb-1">Room Number</label>
                <input
                  type="text"
                  name="room_number"
                  value={formData.room_number}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Room Type</label>
                <input
                  type="text"
                  name="room_type"
                  value={formData.room_type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">Price/Night</label>
                  <input
                    type="number"
                    name="price_per_night"
                    value={formData.price_per_night}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Amenities</label>
                <textarea
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                  placeholder="Separate with comma, e.g. Wifi, TV, AC"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Room Image</label>
                {imagePreview && (
                  <div className="mb-2 flex justify-center">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={128}
                      height={128}
                      className="object-cover rounded-lg border"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 p-2 rounded-lg"
                />
              </div>
              <hr className="my-2" />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className={`${
                    isLoading
                      ? "bg-gray-400"
                      : "bg-black text-white hover:bg-gray-800"
                  } text-white px-4 py-2 rounded-lg font-semibold`}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
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