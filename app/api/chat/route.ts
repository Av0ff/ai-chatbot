import { HfInference } from '@huggingface/inference';
import { HuggingFaceStream, StreamingTextResponse } from 'ai';
import { experimental_buildOpenAssistantPrompt } from 'ai/prompts';

// Create a new HuggingFace Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  const response = Hf.textGenerationStream({
    model: 'Avin0ff/distilgpt2QACode',
    inputs: experimental_buildOpenAssistantPrompt(messages),
    parameters: {
      max_new_tokens: 200,
      // @ts-ignore (this is a valid parameter specifically in OpenAssistant models)
      typical_p: 0.2,
      repetition_penalty: 1,
      truncate: 1000,
      return_full_text: false,
    },
  });

  // Convert the response into a friendly text-stream
  const stream = HuggingFaceStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
// import OpenAI from 'openai';
// import { OpenAIStream, StreamingTextResponse } from 'ai';
 
// // Create an OpenAI API client (that's edge friendly!)
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
 
// // IMPORTANT! Set the runtime to edge
// export const runtime = 'edge';
 
// export async function POST(req: Request) {
//   const { messages } = await req.json();
 
//   // Ask OpenAI for a streaming chat completion given the prompt
//   const response = await openai.chat.completions.create({
//     model: 'gpt-3.5-turbo',
//     stream: true,
//     messages,
//   });
 
//   // Convert the response into a friendly text-stream
//   const stream = OpenAIStream(response);
//   // Respond with the stream
//   return new StreamingTextResponse(stream);
// }


// export async function POST(req: Request) {
//     // Extract the `prompt` from the body of the request
//     const { prompt } = await req.json();
 
//     const body = JSON.stringify({
//       prompt,
//       model: 'command-nightly',
//       max_tokens: 300,
//       stop_sequences: [],
//       temperature: 0.9,
//       return_likelihoods: 'NONE',
//       stream: true,
//     });
   
//     const response = await fetch('https://api.cohere.ai/v1/generate', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
//       },
//       body,
//     });
   
//     // Check for errors
//     if (!response.ok) {
//       return new Response(await response.text(), {
//         status: response.status,
//       });
//     }
   
//     // Extract the text response from the Cohere stream
//     const stream = CohereStream(response);
   
//     // Respond with the stream
//     return new StreamingTextResponse(stream);
// }
