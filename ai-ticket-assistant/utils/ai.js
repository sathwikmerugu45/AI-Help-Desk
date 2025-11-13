// import { createAgent, gemini } from "@inngest/agent-kit";

// const analyzeTicket = async (ticket) => {
//   console.log("🔮 Starting Gemini AI analysis for ticket:", ticket.title);
  
//   try {
//     const supportAgent = createAgent({
//       model: gemini({
//         model: "gemini-1.5-flash-8b",
//         apiKey: process.env.GEMINI_API_KEY,
//       }),
//       name: "AI Ticket Triage Assistant",
//       system: `You are an expert AI assistant that processes technical support tickets. 

// Your job is to:
// 1. Analyze the technical issue described
// 2. Determine priority based on urgency and impact
// 3. Provide specific, actionable technical advice
// 4. Identify the required technical skills to solve this issue

// CRITICAL: Respond with ONLY valid JSON format. No markdown, no code blocks, no extra text.`,
//     });

//     const prompt = `Analyze this support ticket and provide detailed technical assistance:

// TICKET TITLE: "${ticket.title}"
// TICKET DESCRIPTION: "${ticket.description}"

// Provide a JSON response with these exact fields:
// - "priority": "low", "medium", or "high" (based on urgency and business impact)
// - "helpfulNotes": Detailed technical guidance, debugging steps, and specific solutions. Include code examples if relevant.
// - "relatedSkills": Array of technical skills needed to resolve this issue
// - "summary": Brief 1-2 sentence summary of the problem

// IMPORTANT: 
// - For Python issues, provide specific debugging steps and code fixes
// - For urgent issues, suggest immediate workarounds
// - Be technical and specific in your advice
// - Return ONLY raw JSON, no other text

// Example response format:
// {
//   "priority": "high",
//   "helpfulNotes": "The user is experiencing a Python ImportError. This is likely due to... Try these steps: 1. Check if pandas is installed: pip list | grep pandas 2. If not, install it: pip install pandas 3. Verify the import statement...",
//   "relatedSkills": ["python", "debugging", "pandas"],
//   "summary": "User facing Python ImportError with pandas library"
// }`;

//     console.log("📤 Sending prompt to Gemini API...");
//     console.log("📝 Prompt length:", prompt.length, "characters");
    
//     const response = await supportAgent.run(prompt);
    
//     console.log("📥 Raw Gemini response received");
//     console.log("🔍 Response structure:", Object.keys(response));
    
//     const rawOutput = response.output[0].context;
//     console.log("📄 Raw response content:");
//     console.log("=" .repeat(50));
//     console.log(rawOutput);
//     console.log("=" .repeat(50));
//     console.log("📏 Raw response length:", rawOutput.length, "characters");

//     // Multiple parsing strategies
//     let parsedResponse;
    
//     // Strategy 1: Direct JSON parsing
//     try {
//       parsedResponse = JSON.parse(rawOutput.trim());
//       console.log("✅ Direct JSON parsing successful");
//     } catch (e1) {
//       console.log("🔄 Direct parsing failed, trying markdown extraction...");
      
//       // Strategy 2: Extract from markdown code blocks
//       try {
//         const jsonMatch = rawOutput.match(/\{[\s\S]*\}/);
//         if (jsonMatch) {
//           parsedResponse = JSON.parse(jsonMatch[0]);
//           console.log("✅ JSON extraction successful");
//         } else {
//           throw new Error("No JSON object found");
//         }
//       } catch (e2) {
//         console.log("🔄 JSON extraction failed, trying cleanup...");
        
//         // Strategy 3: Clean up and try again
//         try {
//           const cleaned = rawOutput
//             .replace(/```json\s*/gi, '')
//             .replace(/```\s*/gi, '')
//             .replace(/^json\s*/gi, '')
//             .trim();
          
//           const finalMatch = cleaned.match(/\{[\s\S]*\}/);
//           if (finalMatch) {
//             parsedResponse = JSON.parse(finalMatch[0]);
//             console.log("✅ Cleanup parsing successful");
//           } else {
//             throw new Error("No valid JSON found after cleanup");
//           }
//         } catch (e3) {
//           console.error("❌ All parsing attempts failed");
//           console.error("Final error:", e3.message);
//           throw new Error(`Failed to parse AI response: ${e3.message}`);
//         }
//       }
//     }

//     // Validate and enhance the response
//     if (!parsedResponse || typeof parsedResponse !== 'object') {
//       throw new Error("Parsed response is not a valid object");
//     }

//     const finalResponse = {
//       summary: parsedResponse.summary || `User needs help with: ${ticket.title}`,
//       priority: ["low", "medium", "high"].includes(parsedResponse.priority?.toLowerCase()) 
//         ? parsedResponse.priority.toLowerCase() 
//         : "medium",
//       helpfulNotes: parsedResponse.helpfulNotes || "Technical analysis provided by AI",
//       relatedSkills: Array.isArray(parsedResponse.relatedSkills) 
//         ? parsedResponse.relatedSkills 
//         : ["technical", "support"]
//     };

//     console.log("🎉 FINAL PARSED RESPONSE FROM GEMINI:");
//     console.log("📊 Summary:", finalResponse.summary);
//     console.log("⚡ Priority:", finalResponse.priority);
//     console.log("🛠️ Skills:", finalResponse.relatedSkills);
//     console.log("📝 Notes preview:", finalResponse.helpfulNotes.substring(0, 100) + "...");
//     console.log("📏 Notes length:", finalResponse.helpfulNotes.length, "characters");

//     return finalResponse;

//   } catch (error) {
//     console.error("❌ ERROR in analyzeTicket function:");
//     console.error("Error message:", error.message);
//     console.error("Error stack:", error.stack);
    
//     // Enhanced fallback
//     return getEnhancedFallbackAnalysis(ticket);
//   }
// };

// // Enhanced fallback with better analysis
// function getEnhancedFallbackAnalysis(ticket) {
//   console.log("🔄 Using enhanced fallback analysis");
  
//   const titleLower = ticket.title.toLowerCase();
//   const descLower = ticket.description.toLowerCase();
  
//   // Priority detection
//   let priority = "medium";
//   if (titleLower.includes('urgent') || descLower.includes('urgent') ||
//       titleLower.includes('critical') || descLower.includes('critical') ||
//       titleLower.includes('broken') || descLower.includes('broken')) {
//     priority = "high";
//   } else if (titleLower.includes('minor') || descLower.includes('minor') ||
//              titleLower.includes('feature') || descLower.includes('feature')) {
//     priority = "low";
//   }

//   // Skill detection
//   const skills = new Set(["support", "technical"]);
  
//   // Language detection
//   if (descLower.includes('python') || titleLower.includes('python')) {
//     skills.add("python");
//     skills.add("debugging");
//   }
//   if (descLower.includes('javascript') || descLower.includes('js ') || titleLower.includes('javascript')) {
//     skills.add("javascript");
//     skills.add("web development");
//   }
//   if (descLower.includes('java ') || titleLower.includes('java')) {
//     skills.add("java");
//   }
  
//   // Domain detection
//   if (descLower.includes('import') || descLower.includes('module') || descLower.includes('package')) {
//     skills.add("dependency management");
//   }
//   if (descLower.includes('error') || descLower.includes('debug') || descLower.includes('fix')) {
//     skills.add("debugging");
//     skills.add("troubleshooting");
//   }
//   if (descLower.includes('api') || descLower.includes('endpoint') || descLower.includes('request')) {
//     skills.add("api");
//     skills.add("web services");
//   }
//   if (descLower.includes('database') || descLower.includes('mongodb') || descLower.includes('mysql')) {
//     skills.add("database");
//   }

//   // Generate helpful notes based on content
//   let helpfulNotes = "AI analysis was unavailable. Based on the ticket content:\n\n";
  
//   if (descLower.includes('python') && descLower.includes('import')) {
//     helpfulNotes += "This appears to be a Python import issue. Common solutions:\n";
//     helpfulNotes += "1. Check if the required package is installed: pip list\n";
//     helpfulNotes += "2. Verify the import statement syntax\n";
//     helpfulNotes += "3. Check Python path and virtual environment\n";
//     helpfulNotes += "4. Look for circular imports\n";
//   } else if (descLower.includes('error') || descLower.includes('debug')) {
//     helpfulNotes += "This appears to be a debugging issue. Suggested approach:\n";
//     helpfulNotes += "1. Reproduce the error consistently\n";
//     helpfulNotes += "2. Check error logs and stack traces\n";
//     helpfulNotes += "3. Isolate the problematic code section\n";
//     helpfulNotes += "4. Test with simplified examples\n";
//   } else {
//     helpfulNotes += "Please review the ticket details and provide technical assistance based on the specific issue described.";
//   }

//   return {
//     summary: `Technical assistance needed for: ${ticket.title}`,
//     priority,
//     helpfulNotes,
//     relatedSkills: Array.from(skills)
//   };
// }

// export default analyzeTicket;
// utils/ai.js - SIMPLIFIED TEST VERSION
// utils/ai.js - DIRECT GEMINI API CALL
// utils/ai.js - ENHANCED DEBUGGING VERSION
// utils/ai.js - CORRECT GEMINI MODELS
// utils/ai.js - WORKING GEMINI API VERSION
const analyzeTicket = async (ticket) => {
  console.log("🔮 WORKING GEMINI API for ticket:", ticket.title);
  
  try {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    console.log("✅ GEMINI_API_KEY found, making API call...");
    
    const prompt = `Analyze this support ticket and return ONLY valid JSON:

{
  "priority": "low/medium/high",
  "helpfulNotes": "Detailed technical guidance and solutions",
  "relatedSkills": ["array", "of", "technical", "skills"],
  "summary": "Brief summary of the issue"
}

Ticket Title: "${ticket.title}"
Ticket Description: "${ticket.description}"

Guidelines:
- Priority: "high" for urgent/critical issues, "medium" for important issues, "low" for minor issues
- helpfulNotes: Provide specific technical advice, debugging steps, and solutions
- relatedSkills: Include relevant technical skills needed to resolve this issue
- summary: 1-2 sentence summary

Return ONLY the JSON object, no other text or markdown.`;

    console.log("📤 Sending request to Gemini API...");
    
    // ✅ USING WORKING MODELS FROM YOUR TEST
    const workingModels = [
      'gemini-2.0-flash-exp',           // Experimental but available
      'gemini-2.0-flash',               // Stable flash model
      'gemini-pro-latest',              // Latest pro model
      'gemini-flash-latest'             // Latest flash model
    ];

    let lastError = null;
    
    for (const model of workingModels) {
      try {
        console.log(`🔄 Trying model: ${model}`);
        
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: prompt
                }]
              }],
              generationConfig: {
                temperature: 0.1,
                maxOutputTokens: 1000,
              }
            })
          }
        );

        console.log(`📥 API Response status for ${model}:`, response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log(`❌ Model ${model} failed:`, response.status);
          lastError = new Error(`Model ${model}: ${response.status}`);
          continue; // Try next model
        }

        const data = await response.json();
        console.log(`✅ Model ${model} successful!`);
        
        // Extract the text from Gemini response
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
          throw new Error("Invalid API response format");
        }

        const geminiText = data.candidates[0].content.parts[0].text;
        console.log("📄 Raw Gemini response:", geminiText);

        // Parse the JSON response
        let parsedResponse;
        try {
          // Clean and parse the response
          const cleanText = geminiText.replace(/```json|```/g, '').trim();
          parsedResponse = JSON.parse(cleanText);
          console.log("✅ Successfully parsed Gemini JSON");
        } catch (parseError) {
          console.error("❌ JSON parse error:", parseError.message);
          // Try to extract JSON from the text
          const jsonMatch = geminiText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            parsedResponse = JSON.parse(jsonMatch[0]);
            console.log("✅ Extracted JSON from response");
          } else {
            throw new Error("Failed to parse Gemini response as JSON");
          }
        }

        console.log("🎉 ACTUAL GEMINI API RESPONSE RECEIVED!");
        console.log("📊 Priority:", parsedResponse.priority);
        console.log("🛠️ Skills:", parsedResponse.relatedSkills);
        console.log("📝 Notes preview:", parsedResponse.helpfulNotes?.substring(0, 150) + "...");

        // Return the actual Gemini API response
        return {
          priority: parsedResponse.priority || "medium",
          helpfulNotes: parsedResponse.helpfulNotes || "Gemini analysis provided",
          relatedSkills: parsedResponse.relatedSkills || ["technical", "support"],
          summary: parsedResponse.summary || `Analysis: ${ticket.title}`
        };

      } catch (modelError) {
        console.log(`❌ Model ${model} error:`, modelError.message);
        lastError = modelError;
        continue; // Try next model
      }
    }

    // If all models failed
    throw lastError || new Error("All Gemini models failed");

  } catch (error) {
    console.error("❌ GEMINI API CALL FAILED:", error.message);
    
    // Use the superior fallback as backup
    console.log("🔄 Falling back to superior analysis");
    return getSuperiorFallbackAnalysis(ticket);
  }
};

// Superior fallback analysis (keep your existing excellent version)
function getSuperiorFallbackAnalysis(ticket) {
  console.log("🚀 Generating superior analysis for:", ticket.title);
  
  const title = ticket.title.toLowerCase();
  const description = ticket.description.toLowerCase();
  
  // Advanced content analysis
  const analysis = analyzeContent(title, description);
  
  return {
    priority: analysis.priority,
    helpfulNotes: analysis.helpfulNotes,
    relatedSkills: analysis.skills,
    summary: analysis.summary
  };
}

function analyzeContent(title, description) {
  // Priority analysis
  let priority = "medium";
  const urgentKeywords = ['urgent', 'critical', 'broken', 'down', 'emergency', 'not working', 'failed'];
  const lowKeywords = ['minor', 'enhancement', 'feature request', 'improvement', 'suggestion'];
  
  if (urgentKeywords.some(keyword => title.includes(keyword) || description.includes(keyword))) {
    priority = "high";
  } else if (lowKeywords.some(keyword => title.includes(keyword) || description.includes(keyword))) {
    priority = "low";
  }

  // Skill and content detection
  const skills = new Set(["support", "technical"]);
  let category = "general";
  let detailedAdvice = "";
  
  // Python-related issues
  if (description.includes('python') || title.includes('python')) {
    category = "python";
    skills.add("python");
    skills.add("debugging");
    skills.add("programming");
    
    detailedAdvice = `## Python Code Assistance 🐍

**Common Python Issues & Solutions:**

🔍 **Syntax & Basic Issues:**
• Check indentation (Python is strict about whitespace)
• Verify all parentheses, brackets, and quotes are balanced
• Ensure proper colon usage after if/for/while/def/class statements

📦 **Import & Module Issues:**
• Check if required packages are installed: \`pip list | grep package_name\`
• Verify Python path: \`import sys; print(sys.path)\`
• Check for circular imports
• Ensure \_\_init\_\_.py files exist in packages

🐛 **Debugging Techniques:**
• Use \`print()\` statements to trace execution
• Try the built-in debugger: \`python -m pdb your_script.py\`
• Use \`logging\` module for better output control
• Check exception details with try-except blocks

⚡ **Quick Checks:**
• Python version: \`python --version\`
• Syntax check: \`python -m py_compile your_script.py\`
• Virtual environment activated?
• File permissions and paths correct?`;

  } 
  // Web development issues
  else if (description.includes('web') || description.includes('javascript') || 
           description.includes('react') || description.includes('html') || 
           description.includes('css') || title.includes('web')) {
    category = "web";
    skills.add("javascript");
    skills.add("web development");
    skills.add("frontend");
    
    if (description.includes('react')) {
      skills.add("react");
      skills.add("frontend framework");
    }
    if (description.includes('html') || description.includes('css')) {
      skills.add("html/css");
    }
    
    detailedAdvice = `## Web Development Assistance 🌐

**Frontend Debugging Strategy:**

🛠️ **Browser Developer Tools (F12):**
• **Console Tab**: Check for JavaScript errors and warnings
• **Elements Tab**: Inspect HTML structure and CSS styles
• **Network Tab**: Monitor API calls and resource loading
• **Sources Tab**: Set breakpoints and debug JavaScript

🔧 **Common Frontend Issues:**
• JavaScript errors in console
• CSS styling not applying correctly
• Event handlers not firing
• API responses not as expected
• Cross-origin (CORS) issues`;
  }
  // Default general assistance
  else {
    category = "general";
    detailedAdvice = `## Technical Support Guidance 💻

**To Provide the Best Assistance:**

📋 **Please Share These Details:**

**Problem Description:**
• What exactly are you trying to accomplish?
• What specific behavior are you expecting?
• What actual behavior are you observing?

**Error Information:**
• Complete error messages (if any)
• Stack traces or log output
• Steps to reproduce the issue

**Technical Areas We Can Help With:**
• Programming languages (Python, JavaScript, Java, etc.)
• Web development (HTML, CSS, React, Node.js)
• APIs and web services
• Database issues
• Debugging and troubleshooting`;
  }

  // Generate summary based on category
  const summaries = {
    python: "Python programming assistance required",
    web: "Web development technical support",
    api: "API/backend integration issue",
    database: "Database-related technical problem", 
    debugging: "Technical debugging and troubleshooting",
    general: "Technical assistance requested"
  };

  return {
    priority,
    helpfulNotes: detailedAdvice,
    skills: Array.from(skills),
    summary: summaries[category]
  };
}

export default analyzeTicket;