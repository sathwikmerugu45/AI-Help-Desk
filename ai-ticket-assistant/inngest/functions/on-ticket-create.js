// import { inngest } from "../client.js";
// import Ticket from "../../models/ticket.js";
// import User from "../../models/user.js";
// import { NonRetriableError } from "inngest";
// import analyzeTicket from "../../utils/ai.js"; // ✅ IMPORT THE REAL AI FUNCTION

// export const onTicketCreated = inngest.createFunction(
//   { 
//     id: "on-ticket-created", 
//     name: "Process New Ticket",
//     retries: 3
//   },
//   { event: "ticket/created" },
//   async ({ event, step }) => {
//     console.log("🎫 Inngest function started for ticket:", event.data.ticketId);
    
//     try {
//       const { ticketId, title, description } = event.data;

//       // Step 1: Fetch ticket from database
//       const ticket = await step.run("fetch-ticket", async () => {
//         console.log("📋 Fetching ticket from DB:", ticketId);
//         const ticketDoc = await Ticket.findById(ticketId);
//         if (!ticketDoc) {
//           console.error("❌ Ticket not found:", ticketId);
//           throw new NonRetriableError(`Ticket ${ticketId} not found`);
//         }
//         console.log("✅ Found ticket:", ticketDoc.title);
//         return ticketDoc;
//       });

//       // Step 2: Update ticket status
//       await step.run("update-status", async () => {
//         console.log("🔄 Updating ticket status to IN_PROGRESS");
//         await Ticket.findByIdAndUpdate(ticketId, { 
//           status: "IN_PROGRESS",
//           updatedAt: new Date()
//         });
//         return "Status updated to IN_PROGRESS";
//       });

//       // Step 3: ✅ REAL AI PROCESSING WITH GEMINI API
//       const aiAnalysis = await step.run("ai-analysis", async () => {
//         console.log("🔮 Calling REAL Gemini AI for:", title);
        
//         try {
//           // ✅ CALL THE ACTUAL GEMINI AI FUNCTION
//           const geminiResponse = await analyzeTicket({
//             title: ticket.title,
//             description: ticket.description
//           });
          
//           console.log("🎉 REAL GEMINI RESPONSE RECEIVED!");
//           console.log("📊 Gemini Output:", {
//             priority: geminiResponse.priority,
//             skills: geminiResponse.relatedSkills,
//             notesPreview: geminiResponse.helpfulNotes?.substring(0, 100) + "..."
//           });
          
//           return geminiResponse;
          
//         } catch (aiError) {
//           console.error("❌ Gemini API failed:", aiError.message);
//           // Fallback to simple analysis if Gemini fails
//           return {
//             priority: title.toLowerCase().includes('urgent') ? 'high' : 'medium',
//             helpfulNotes: "Gemini AI analysis failed. Manual review required.",
//             relatedSkills: ["support", "technical"]
//           };
//         }
//       });

//       // Step 4: Update ticket with REAL AI results
//       await step.run("update-with-ai", async () => {
//         console.log("📝 Updating ticket with REAL Gemini analysis");
        
//         // ✅ THIS WILL NOW CONTAIN THE ACTUAL GEMINI PROMPT OUTPUT
//         await Ticket.findByIdAndUpdate(ticketId, {
//           priority: aiAnalysis.priority,
//           helpfulNotes: aiAnalysis.helpfulNotes, // ✅ REAL GEMINI OUTPUT
//           relatedSkills: aiAnalysis.relatedSkills, // ✅ REAL GEMINI SKILLS
//           status: "ANALYZED"
//         });
        
//         console.log("✅ Ticket updated with REAL Gemini analysis");
//         return "Real AI analysis applied";
//       });

//       // Step 5: Assign to moderator
//       const moderator = await step.run("assign-moderator", async () => {
//         console.log("👤 Finding moderator...");
        
//         // Try to find moderator with matching skills
//         let user = await User.findOne({
//           role: "moderator",
//           skills: { $in: aiAnalysis.relatedSkills.map(skill => new RegExp(skill, "i")) }
//         });

//         // Fallback to any moderator
//         if (!user) {
//           user = await User.findOne({ role: "moderator" });
//         }

//         // Final fallback to admin
//         if (!user) {
//           user = await User.findOne({ role: "admin" });
//         }

//         if (user) {
//           console.log(`✅ Assigned to: ${user.email}`);
//           await Ticket.findByIdAndUpdate(ticketId, {
//             assignedTo: user._id,
//             status: "ASSIGNED"
//           });
//         } else {
//           console.log("⚠️ No moderator/admin found for assignment");
//         }

//         return user;
//       });

//       console.log("✅ Ticket processing with REAL Gemini completed successfully");
//       return {
//         success: true,
//         ticketId,
//         assignedTo: moderator?.email || "unassigned",
//         priority: aiAnalysis.priority,
//         status: "ASSIGNED",
//         aiUsed: true
//       };

//     } catch (error) {
//       console.error("❌ Error in ticket processing function:", error);
      
//       // Update ticket status to failed
//       try {
//         await Ticket.findByIdAndUpdate(event.data.ticketId, {
//           status: "FAILED",
//           helpfulNotes: `Processing failed: ${error.message}`
//         });
//       } catch (updateError) {
//         console.error("Failed to update ticket status:", updateError);
//       }
      
//       throw error;
//     }
//   }
// );

import { inngest } from "../client.js";
import Ticket from "../../models/ticket.js";
import User from "../../models/user.js";
import { NonRetriableError } from "inngest";
import analyzeTicket from "../../utils/ai.js";

export const onTicketCreated = inngest.createFunction(
  { 
    id: "on-ticket-created", 
    name: "Process New Ticket",
    retries: 3
  },
  { event: "ticket/created" },
  async ({ event, step }) => {
    console.log("🎫 Inngest function STARTED for ticket:", event.data.ticketId);
    
    try {
      const { ticketId, title, description } = event.data;

      // Step 1: Fetch ticket from database
      console.log("🔍 STEP 1: Fetching ticket...");
      const ticket = await step.run("fetch-ticket", async () => {
        console.log("📋 Fetching ticket from DB:", ticketId);
        const ticketDoc = await Ticket.findById(ticketId);
        if (!ticketDoc) {
          console.error("❌ Ticket not found:", ticketId);
          throw new NonRetriableError(`Ticket ${ticketId} not found`);
        }
        console.log("✅ STEP 1 COMPLETE: Found ticket:", ticketDoc.title);
        return ticketDoc;
      });

      // Step 2: Update ticket status
      console.log("🔍 STEP 2: Updating status...");
      await step.run("update-status", async () => {
        console.log("🔄 Updating ticket status to IN_PROGRESS");
        await Ticket.findByIdAndUpdate(ticketId, { 
          status: "IN_PROGRESS",
          updatedAt: new Date()
        });
        console.log("✅ STEP 2 COMPLETE: Status updated to IN_PROGRESS");
        return "Status updated to IN_PROGRESS";
      });

      // Step 3: TEST AI FUNCTION WITH TIMEOUT
      console.log("🔍 STEP 3: Testing AI function...");
      let aiAnalysis;
      try {
        // Test if AI function is working with timeout
        console.log("⏱️  Calling analyzeTicket with 10 second timeout...");
        
        const aiPromise = analyzeTicket({
          title: ticket.title,
          description: ticket.description
        });
        
        // Add a timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("AI function timeout after 10 seconds")), 10000);
        });
        
        aiAnalysis = await Promise.race([aiPromise, timeoutPromise]);
        console.log("✅ STEP 3 COMPLETE: AI function returned successfully");
        console.log("📊 AI Response:", aiAnalysis);
        
      } catch (aiError) {
        console.error("❌ STEP 3 FAILED: AI function error:", aiError.message);
        // Use fallback
        aiAnalysis = {
          priority: "medium",
          helpfulNotes: "AI service temporarily unavailable - using fallback analysis",
          relatedSkills: ["support", "technical"]
        };
        console.log("🔄 Using fallback analysis:", aiAnalysis);
      }

      // Step 4: Update ticket with results
      console.log("🔍 STEP 4: Updating ticket with results...");
      await step.run("update-with-ai", async () => {
        console.log("📝 Updating ticket with analysis results");
        await Ticket.findByIdAndUpdate(ticketId, {
          priority: aiAnalysis.priority,
          helpfulNotes: aiAnalysis.helpfulNotes,
          relatedSkills: aiAnalysis.relatedSkills,
          status: "ANALYZED"
        });
        console.log("✅ STEP 4 COMPLETE: Ticket updated successfully");
        return "Analysis applied";
      });

      // Step 5: Assign to moderator
      console.log("🔍 STEP 5: Finding moderator...");
      const moderator = await step.run("assign-moderator", async () => {
        console.log("👤 Searching for moderator...");
        
        let user = await User.findOne({
          role: "moderator",
          skills: { $in: aiAnalysis.relatedSkills.map(skill => new RegExp(skill, "i")) }
        });

        if (!user) {
          user = await User.findOne({ role: "moderator" });
        }

        if (!user) {
          user = await User.findOne({ role: "admin" });
        }

        if (user) {
          console.log(`✅ Assigned to: ${user.email}`);
          await Ticket.findByIdAndUpdate(ticketId, {
            assignedTo: user._id,
            status: "ASSIGNED"
          });
        } else {
          console.log("⚠️ No moderator/admin found");
        }

        console.log("✅ STEP 5 COMPLETE: Moderator assignment done");
        return user;
      });

      console.log("🎉 ALL STEPS COMPLETED SUCCESSFULLY!");
      return {
        success: true,
        ticketId,
        assignedTo: moderator?.email || "unassigned",
        priority: aiAnalysis.priority,
        status: "ASSIGNED"
      };

    } catch (error) {
      console.error("💥 CRITICAL ERROR in function:", error.message);
      console.error("Error stack:", error.stack);
      
      try {
        await Ticket.findByIdAndUpdate(event.data.ticketId, {
          status: "FAILED",
          helpfulNotes: `Processing failed: ${error.message}`
        });
      } catch (updateError) {
        console.error("Failed to update ticket status:", updateError);
      }
      
      throw error;
    }
  }
);