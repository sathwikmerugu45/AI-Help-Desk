import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "ticket-system",
  name: "Ticket Management System",
  // Add better logging
  logger: {
    info: (message) => console.log(`[Inngest INFO] ${message}`),
    error: (message) => console.error(`[Inngest ERROR] ${message}`),
  },
});