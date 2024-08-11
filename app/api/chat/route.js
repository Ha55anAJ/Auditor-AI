import {NextResponse} from 'next/server' // Import NextResponse from Next.js for handling responses
import OpenAI from 'openai' // Import OpenAI library for interacting with the OpenAI API

// System prompt for the AI, providing guidelines on how to respond to users
const systemPrompt = "You are an AI assistant called Auditor helping users with sleep, stress management or other mental health concerns. You should provide information on these topics when users ask about them. You must be polite and respectful and avoid providing medical advice. You can also provide general information on sleep and stress management.";

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "USER_API_KEY", //Use your API key
    defaultHeaders: {
      'Content-Type': 'application/json'
    }
  }); // Create a new instance of the OpenAI client
  const data = await req.json() // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
    model: 'meta-llama/llama-3.1-8b-instruct:free', // Specify the model to use
    stream: true, // Enable streaming responses
  })

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err) // Handle any errors that occur during streaming
      } finally {
        controller.close() // Close the stream when done
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}


// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: "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",
//   defaultHeaders: {
//     'Content-Type': 'application/json'
//   }
// });

// const systemPrompt = "You are an AI assistant called Auditor helping users with sleep and stress management. You should provide information on these topics when users ask about them. You must be polite and respectful and avoid providing medical advice. You can also provide general information on sleep and stress management.";


// meta-llama/llama-3.1-8b-instruct:free
