import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type BookingWithDetails = {
  id: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: string;
  created_at: string;
  room: {
    id: string;
    room_number: string;
    room_type: string;
    price_per_night: number;
    capacity: number;
    amenities: string[];
    room_images: {
      image_url: string;
      is_primary: boolean;
    }[];
  };
};

export async function getBookingsByUserId(userId: string): Promise<BookingWithDetails[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      room:rooms (
        id,
        room_number,
        room_type,
        price_per_night,
        capacity,
        amenities,
        room_images (
          image_url,
          is_primary
        )
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }

  return data || [];
}

export async function getBookingById(bookingId: string): Promise<BookingWithDetails | null> {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      room:rooms (
        id,
        room_number,
        room_type,
        price_per_night,
        capacity,
        amenities,
        room_images (
          image_url,
          is_primary
        )
      )
    `)
    .eq("id", bookingId)
    .single();

  if (error) {
    console.error("Error fetching booking:", error);
    return null;
  }

  return data;
}

// CREATE BOOKING
export async function createBooking({
  user_id,
  room_id,
  check_in_date,
  check_out_date,
  total_price,
}: {
  user_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
}): Promise<{ success: boolean; error?: string }> {
  // Validasi tanggal
  if (new Date(check_in_date) >= new Date(check_out_date)) {
    return { success: false, error: "Check-out date must be after check-in date." };
  }
  // Cek bentrok booking
  const { data: conflicts } = await supabase
    .from("bookings")
    .select("id")
    .eq("room_id", room_id)
    .or(`
      and(check_in_date.lte.${check_out_date},check_out_date.gte.${check_in_date})
    `)
    .not("status", "eq", "cancelled");
  if (conflicts && conflicts.length > 0) {
    return { success: false, error: "Room is already booked for the selected dates." };
  }
  // Insert booking
  const { error } = await supabase.from("bookings").insert({
    user_id,
    room_id,
    check_in_date,
    check_out_date,
    total_price,
    status: "pending",
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// UPDATE BOOKING STATUS (e.g. cancel)
export async function updateBookingStatus({
  booking_id,
  status,
  user_id,
}: {
  booking_id: string;
  status: string;
  user_id: string;
}): Promise<{ success: boolean; error?: string }> {
  // Hanya user pemilik booking yang bisa update
  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", booking_id)
    .eq("user_id", user_id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// DELETE BOOKING (opsional)
export async function deleteBooking({
  booking_id,
  user_id,
}: {
  booking_id: string;
  user_id: string;
}): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", booking_id)
    .eq("user_id", user_id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

// EDIT BOOKING (update tanggal dan total_price)
export async function editBooking({
  booking_id,
  user_id,
  check_in_date,
  check_out_date,
  total_price,
}: {
  booking_id: string;
  user_id: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
}): Promise<{ success: boolean; error?: string }> {
  if (new Date(check_in_date) >= new Date(check_out_date)) {
    return { success: false, error: "Check-out date must be after check-in date." };
  }
  // Ambil room_id booking ini
  const { data: bookingData, error: bookingError } = await supabase
    .from("bookings")
    .select("room_id")
    .eq("id", booking_id)
    .single();
  if (bookingError || !bookingData) {
    return { success: false, error: "Booking not found." };
  }
  // Cek bentrok booking lain (kecuali booking ini sendiri)
  const { data: conflicts } = await supabase
    .from("bookings")
    .select("id")
    .eq("room_id", bookingData.room_id)
    .neq("id", booking_id)
    .or(`
      and(check_in_date.lte.${check_out_date},check_out_date.gte.${check_in_date})
    `)
    .not("status", "eq", "cancelled");
  if (conflicts && conflicts.length > 0) {
    return { success: false, error: "Room is already booked for the selected dates." };
  }
  // Update booking
  const { error } = await supabase
    .from("bookings")
    .update({ check_in_date, check_out_date, total_price })
    .eq("id", booking_id)
    .eq("user_id", user_id);
  if (error) return { success: false, error: error.message };
  return { success: true };
} 