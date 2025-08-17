import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';

export async function POST(request: Request) {
    try {
        
        const { textinput, customPrompt } = await request.json();
        
        if (!textinput) {
            return Response.json({ error: 'Text content is required' }, { status: 400 });
        }
        
        const { text } = await generateText({
            model: groq('llama-3.3-70b-versatile'),
            prompt: `${customPrompt || 'Summarize the following text'}: ${textinput}`,
        });
        const sendtext = `${text}`;
        console.log(sendtext);

        return Response.json({ sendtext });
        
    } catch (error) {
        console.error('Error generating summary:', error);
        return Response.json({ error: 'Failed to generate summary' }, { status: 500 });
    }
}
