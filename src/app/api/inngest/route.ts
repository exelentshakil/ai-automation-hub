import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { processAIEvent } from "./functions";

// Create an API that serves zero-dependency functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processAIEvent,
  ],
});
