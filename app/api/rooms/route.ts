import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  const body = await req.json()
  const { data, error } = await supabase.from("rooms").insert([body])

  if (error) return new Response(error.message, { status: 500 })
  return new Response(JSON.stringify(data), { status: 201 })
}