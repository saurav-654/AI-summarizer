import { toast } from 'react-toastify';

export interface SummarizeParams {
  textToSummarize: string;
  customPrompt?: string;
  setIsGenerating: (value: boolean) => void;
  setSummary: (value: string) => void;
}


// Get the correct API URL based on environment
const getApiUrl = (): string => {
  // In development, use localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // In production, use environment variable or default
  return process.env.NEXT_PUBLIC_API_URL || process.env.URL || 'http://localhost:3000';
};

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
  
  // Array of endpoints to try
  const endpoints = [
    `${getApiUrl()}/api/summary_gen/`,
    `${getApiUrl()}/api/summary_gen`,
    '/api/summary_gen/',
    '/api/summary_gen'
  ];

  let lastError: Error | null = null;

  for (const endpoint of endpoints) {
    try {
      console.log(`Trying endpoint: ${endpoint}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log("Request timeout triggered");
        controller.abort();
      }, 30000);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          textinput: textToSummarize,
          customPrompt: customPrompt || "Create a comprehensive summary",
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log(`Response status for ${endpoint}: ${response.status}`);

      if (!response.ok) {
        if (response.status === 404) {
          console.log(`Endpoint ${endpoint} not found, trying next...`);
          continue; // Try next endpoint
        }
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.error("Non-JSON response:", responseText);
        throw new Error("API returned non-JSON response");
      }

      const data = await response.json();
      console.log("Response data:", data);
      
      if (!data.sendtext) {
        throw new Error("Invalid response format: missing sendtext field");
      }

      const formattedHTML = data.sendtext
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br>");

      setSummary(formattedHTML);
      toast("Summary generated successfully!");
      setIsGenerating(false);
      return; // Success, exit function

    } catch (error) {
      console.error(`Error with endpoint ${endpoint}:`, error);
      lastError = error instanceof Error ? error : new Error("Unknown error");
      
      // If this is the last endpoint and it's a 404, continue to fallback
      if (endpoint === endpoints[endpoints.length - 1]) {
        break;
      }
    }
  }

}