import { supabase } from '@/lib/supabase'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const { data, error } = await supabase.from('rooms').update(body).eq('id', params.id)

  if (error) return new Response(error.message, { status: 500 })
  return new Response(JSON.stringify(data), { status: 200 })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { error } = await supabase.from('rooms').delete().eq('id', params.id)

  if (error) return new Response(error.message, { status: 500 })
  return new Response(null, { status: 204 })
}