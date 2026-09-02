import { inngest } from "@/lib/inngest";

export const processAIEvent = inngest.createFunction(
  { id: "process-ai-event", event: "app/ai.process" } as any,
  async ({ event, step }: any) => {
    
    // Step 1: Simulate extraction/preparation
    await step.sleep("simulate-prep", "1s");
    
    // Step 2: Call the LLM
    const aiResult = await step.run("evaluate-event", async () => {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Missing GEMINI_API_KEY");

      const prompt = `
        You are an AI Orchestration agent evaluating incoming business events.
        Event Type: ${event?.data?.type || 'unknown'}
        Payload: "${event?.data?.payload || ''}"
        
        Evaluate this event and determine:
        1. What action should be taken?
        2. Assign a confidence score from 0-100 based on how safe it is to execute autonomously.
        
        Respond ONLY with a valid JSON object matching this structure exactly:
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
      return JSON.parse(cleanedText);
    });

    const finalStatus = aiResult.confidence >= 90 ? 'autonomous' : 'review';

    // Step 3: Save to Database
    await step.run("save-to-database", async () => {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (supabaseUrl && supabaseKey) {
        await fetch(`${supabaseUrl}/rest/v1/orchestration_logs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            event_type: event?.data?.type || 'unknown',
            input_payload: event?.data?.payload || '',
            confidence: aiResult.confidence,
            action: aiResult.action,
            status: finalStatus
          })
        });
      }
    });

    return { ...aiResult, status: finalStatus };
  }
);
