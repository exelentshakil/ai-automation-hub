import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
       return NextResponse.json({ logs: [] });
    }

    const res = await fetch(`${supabaseUrl}/rest/v1/orchestration_logs?select=*&order=created_at.desc&limit=20`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    if (!res.ok) {
       return NextResponse.json({ logs: [] }); 
    }

    const logs = await res.json();
    return NextResponse.json({ logs });
  } catch (error) {
    return NextResponse.json({ logs: [] });
  }
}
