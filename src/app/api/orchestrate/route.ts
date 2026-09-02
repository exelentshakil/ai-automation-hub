import { NextResponse } from 'next/server';
import { inngest } from '@/lib/inngest';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { type, payload } = await req.json();
    
    // In a real app we would just trigger Inngest and return a 202 Accepted:
    // await inngest.send({ name: "app/ai.process", data: { type, payload } });
    
    // But for this MVP demo, we want instant UI feedback, so we'll do the LLM call here,
    // save to Supabase, and return the result synchronously so the UI updates.

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured on server' }, { status: 500 });
    }

    const prompt = `
      You are an AI Orchestration agent evaluating incoming business events.
      Event Type: ${type}
      Payload: "${payload}"
      
      Evaluate this event and determine:
      1. What action should be taken? (Keep it concise, 1-2 sentences. Be specific).
      2. Assign a confidence score from 0-100 based on how safe it is to execute autonomously. 
      
      Respond ONLY with a valid JSON object matching this structure exactly (no markdown formatting, just raw JSON):
      {
        "confidence": number,
        "action": "string"
      }
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'Gemini API Error');

    const cleanedText = data.candidates[0].content.parts[0].text.replace(/```json\n?|\n?```/g, '').trim();
    const resultJson = JSON.parse(cleanedText);
    const finalStatus = resultJson.confidence >= 90 ? 'autonomous' : 'review';

    // Save to Database so it persists on refresh
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    let savedRecord = null;
    if (supabaseUrl && supabaseKey) {
      const dbRes = await fetch(`${supabaseUrl}/rest/v1/orchestration_logs?select=*`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          event_type: type,
          input_payload: payload,
          confidence: resultJson.confidence,
          action: resultJson.action,
          status: finalStatus
        })
      });
      
      if (dbRes.ok) {
        const records = await dbRes.json();
        if (records.length > 0) savedRecord = records[0];
      }
    }

    return NextResponse.json({
      id: savedRecord?.id || `temp-${Date.now()}`,
      created_at: savedRecord?.created_at || new Date().toISOString(),
      confidence: resultJson.confidence,
      action: resultJson.action,
      status: finalStatus
    });
  } catch (error: any) {
    console.error('Orchestration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
