"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

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
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
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
      } catch (err) {
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
    if (e.target.files) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Room List</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Tambah Room
        </button>
      </div>

      {rooms.map((room) => (
        <div key={room.id} className="border p-4 mb-4 rounded shadow-sm">
          <h2 className="font-semibold">
            {room.room_number} - {room.room_type}
          </h2>
          <p>Price: ${room.price_per_night}</p>
          <p>Capacity: {room.capacity}</p>
          <p>Amenities: {room.amenities?.join(" - ")}</p>
          {room.room_images && room.room_images.length > 0 && (
            <div className="mt-4">
              <Image
                src={room.room_images[0].image_url}
                alt="Room Image"
                width={160}
                height={80}
                className="object-cover rounded"
              />
            </div>
          )}
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => handleEditClick(room)}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(room.id)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Hapus
            </button>
          </div>
        </div>
      ))}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingRoom ? "Update Room" : "Add New Room"}
            </h2>
            <form
              onSubmit={editingRoom ? handleUpdate : handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium">Room Number</label>
                <input
                  type="text"
                  name="room_number"
                  value={formData.room_number}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Room Type</label>
                <input
                  type="text"
                  name="room_type"
                  value={formData.room_type}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Price per Night
                </label>
                <input
                  type="number"
                  name="price_per_night"
                  value={formData.price_per_night}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Amenities</label>
                <textarea
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Room Image</label>
                {imagePreview && (
                  <div className="mb-2">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={128}
                      height={128}
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border p-2 rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${
                    isLoading ? "bg-gray-400" : "bg-blue-600"
                  } text-white px-4 py-2 rounded`}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
