import { NextResponse } from 'next/server';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { type, payload } = await req.json();
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured on server' }, { status: 500 });
    }

    const prompt = `
      You are an AI Orchestration agent evaluating incoming business events.
      Event Type: ${type}
      Payload: "${payload}"
      
      Evaluate this event and determine:
      1. What action should be taken? (Keep it concise, 1-2 sentences. Be specific as if you are interacting with downstream APIs).
      2. Assign a confidence score from 0-100 based on how safe it is to execute this autonomously. 
         - Routine inquiries (password resets, pricing), clear lead behaviors: > 90
         - Complex quotes, ambiguous project blockers, custom logic, or requiring human context: < 80
      
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

    const resultText = data.candidates[0].content.parts[0].text;
    
    // Clean up markdown block if Gemini returns it
    const cleanedText = resultText.replace(/```json\n?|\n?```/g, '').trim();
    const resultJson = JSON.parse(cleanedText);

    // Enforce status based on confidence rule deterministically
    const finalStatus = resultJson.confidence >= 90 ? 'autonomous' : 'review';

    return NextResponse.json({
      confidence: resultJson.confidence,
      action: resultJson.action,
      status: finalStatus
    });
  } catch (error: any) {
    console.error('Orchestration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
