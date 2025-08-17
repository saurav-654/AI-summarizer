import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { textinput, customPrompt } = await request.json();

    if (!textinput) {
      return NextResponse.json({ error: 'Text content is required' }, { status: 400 });
    }

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      prompt: `${customPrompt || 'Summarize the following text'}: ${textinput}`,
    });

    const sendtext = `${text}`;
    console.log(sendtext);

    return NextResponse.json({ sendtext });
  } catch (error) {
    // This will show detailed error logs in your Vercel dashboard
    console.error('Error generating summary:', error);
    return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 });
  }
}
