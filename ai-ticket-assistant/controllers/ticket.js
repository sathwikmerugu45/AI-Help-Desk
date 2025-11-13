import { inngest } from "../inngest/client.js";
import Ticket from "../models/ticket.js";

export const createTicket = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ 
        message: "Title and description are required" 
      });
    }

    console.log("🎫 Creating new ticket:", { title, description });

    const newTicket = await Ticket.create({
      title,
      description,
      status: "open"
    });

    console.log("✅ Ticket created in DB:", newTicket._id);

    // Send event to Inngest
    try {
      console.log("🚀 Sending event to Inngest...");
      await inngest.send({
        name: "ticket/created",
        data: {
          ticketId: newTicket._id.toString(),
          title,
          description,
        },
      });
      console.log("✅ Event sent to Inngest successfully");
    } catch (inngestError) {
      console.error("❌ Inngest event failed:", inngestError);
      // Don't fail the request if Inngest fails
    }

    return res.status(201).json({
      message: "Ticket created successfully",
      ticket: newTicket,
    });
    
  } catch (error) {
    console.error("❌ Error creating ticket:", error);
    return res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};
export const getTickets = async (req, res) => {
  try {
    // ✅ Get all tickets without user filtering
    const tickets = await Ticket.find({})
      .sort({ createdAt: -1 });

    return res.status(200).json({
      tickets: tickets,
      count: tickets.length
    });
    
  } catch (error) {
    console.error("Error fetching tickets", error.message);
    return res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};

export const getTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ 
        message: "Ticket not found" 
      });
    }

    return res.status(200).json({
      ticket: ticket
    });
    
  } catch (error) {
    console.error("Error fetching ticket", error.message);
    return res.status(500).json({ 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};