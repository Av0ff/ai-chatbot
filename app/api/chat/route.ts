import { HfInference } from '@huggingface/inference';
import { HuggingFaceStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

// Create a new HuggingFace Inference instance
const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

// IMPORTANT Set the runtime to edge
export const runtime = 'edge';

type Message = {
  content: string;
  role: 'user' | 'assistant';
};

// Build a prompt from the messages
function buildPrompt(messages: Message[]) {
  return (
    messages
     .map(({content, role}) => {
        if (role === 'user') {
          return `<|prompter|>${content}<|endoftext|>`;
        } else {
          return `<|assistant|>${content}<|endoftext|>`;
        }
      })
     .join('') + '<|assistant|>'
  );
}

// API route handler
export async function POST(request: Request) {
  try {
    // Extract `messages` from the request body
    const { messages }: { messages: Message[] } = await request.json();

    const prompt = buildPrompt(messages);
    const response = await Hf.textGenerationStream({
      model: 'IlyaGusev/saiga_mistral_7b_gguf',
      inputs: prompt,
      parameters: {
        max_length: 2048,
        temperature: 0.7, // Adjust the temperature parameter as needed
        top_p: 0.9, // Adjust the top_p parameter as needed
      },
    });

    // Convert the response into a friendly text-stream
    const stream = HuggingFaceStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   // Check the request method
//   if (req.method!== 'POST') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   // Extract the `messages` from the body of the request
//   const { messages }: { messages: Message[] } = req.body;

//   try {
//     const response = await Hf.textGenerationStream({
//       model: 'Avin0ff/distilgpt2QACode',
//       messages: [{ content: buildPrompt(messages) }],
//     });

//     // Конвертация ответа в строку
//     const result = response.toString();

//     // Отправка результата в ответе
//     res.status(200).send(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// }


// import { HfInference } from '@huggingface/inference'
// import { HuggingFaceStream, StreamingTextResponse } from 'ai'

// // Create a new HuggingFace Inference instance
// const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY)

// // IMPORTANT! Set the runtime to edge
// export const runtime = 'edge'

// // Build a prompt from the messages
// function buildPompt(
//   messages: { content: string; role: 'system' | 'user' | 'assistant' }[]
// ) {
//   return (
//     messages
//       .map(({ content, role }) => {
//         if (role === 'user') {
//           return `<|prompter|>${content}<|endoftext|>`
//         } else {
//           return `<|assistant|>${content}<|endoftext|>`
//         }
//       })
//       .join('') + '<|assistant|>'
//   )
// }

// export async function POST(req: Request) {
//   // Extract the `messages` from the body of the request
//   const { messages } = await req.json()

//   const response = await Hf.textGenerationStream({
//     model: 'Avin0ff/distilgpt2QACode',
//     messages: [{
//       content: buildPompt(messages)
//     }],
//   })

//   // Convert the response into a friendly text-stream
//   const stream = HuggingFaceStream(response)

//   // Respond with the stream
//   return new StreamingTextResponse(stream)
// }


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
