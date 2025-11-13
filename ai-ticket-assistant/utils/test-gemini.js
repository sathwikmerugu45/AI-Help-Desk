// test-gemini.js
import dotenv from 'dotenv';
dotenv.config();

async function testGeminiAPI() {
  console.log('🔍 Testing Gemini API Configuration...\n');
  
  // Check if API key exists
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY is missing from .env file');
    console.log('💡 Add this to your .env file: GEMINI_API_KEY=your_actual_key_here');
    return;
  }

  console.log('✅ GEMINI_API_KEY found:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
  
  // Test available models endpoint
  try {
    console.log('\n📡 Testing models endpoint...');
    const modelsResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    console.log('📥 Models endpoint status:', modelsResponse.status);
    
    if (modelsResponse.ok) {
      const modelsData = await modelsResponse.json();
      console.log('✅ Models endpoint working! Available models:');
      modelsData.models.forEach(model => {
        console.log(`   - ${model.name} (${model.displayName})`);
      });
    } else {
      const errorText = await modelsResponse.text();
      console.log('❌ Models endpoint failed:', errorText);
    }
  } catch (error) {
    console.log('❌ Models test failed:', error.message);
  }
}

testGeminiAPI();