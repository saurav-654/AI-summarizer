import { toast } from 'react-toastify';

export interface SummarizeParams {
  textToSummarize: string;
  customPrompt?: string;
  setIsGenerating: (value: boolean) => void;
  setSummary: (value: string) => void;
}

export const generateSummary = async ({
  textToSummarize,
  customPrompt,
  setIsGenerating,
  setSummary
}: SummarizeParams) => {
  if (!textToSummarize.trim()) {
    toast("Please upload a file or enter text first.");
    return;
  }

  setIsGenerating(true);
  try {
    const response = await fetch("/api/summary_gen/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        textinput: textToSummarize,
        customPrompt: customPrompt || "Create a comprehensive summary",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const formattedHTML = data.sendtext
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");

    setSummary(formattedHTML);
  } catch (error) {
    console.error("Error generating summary:", error);
    toast("Failed to generate summary. Please try again.");
  } finally {
    setIsGenerating(false);
  }
};

// Alternative version that returns the summary instead of setting state
export const getSummary = async (
  textToSummarize: string,
  customPrompt?: string
): Promise<string> => {
  if (!textToSummarize.trim()) {
    throw new Error("Text input is required");
  }

  const response = await fetch("https://ai-summarizer-pi-nine.vercel.app/api/summary_gen/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      textinput: textToSummarize,
      customPrompt: customPrompt || "Create a comprehensive summary",
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.sendtext
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br>");
};