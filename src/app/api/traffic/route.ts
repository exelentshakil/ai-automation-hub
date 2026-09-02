import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { path, userAgent, timestamp } = await req.json();
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    
    // In a real app, this would write to Supabase
    // Using process.env.SUPABASE_URL and process.env.SUPABASE_SERVICE_ROLE_KEY
    console.log(`[TRAFFIC] ${ip} visited ${path} at ${timestamp} using ${userAgent}`);

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      // Simulate Geo lookup
      let city = 'Unknown', country = 'Unknown';
      if (ip !== 'unknown' && ip !== '::1' && ip !== '127.0.0.1') {
         try {
           const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,city`);
           const geo = await geoRes.json();
           if (geo.status === 'success') {
             city = geo.city;
             country = geo.country;
           }
         } catch(e) {}
      }

      await fetch(`${supabaseUrl}/rest/v1/traffic_logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          path,
          ip_address: ip,
          city,
          country,
          user_agent: userAgent
        })
      }).catch(() => {}); // fire and forget
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
