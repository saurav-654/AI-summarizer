import { toast } from 'react-toastify';

export interface SendEmailParams {
  emailRecipients: string;
  summary: string;
  setIsSendingEmail: (value: boolean) => void;
}

export const shareViaEmail = async ({
  emailRecipients,
  summary,
  setIsSendingEmail
}: SendEmailParams) => {
  if (!emailRecipients.trim() || !summary.trim()) {
    toast("Please enter recipient emails and ensure you have a summary to share.");
    return;
  }

  setIsSendingEmail(true);
  
  try {
    const response = await fetch("/api/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipients: emailRecipients,
        subject: "AI Generated Summary",
        content: summary,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.details || data.error || "Failed to send email");
    }
    
    if (data.success) {
      toast("Email sent successfully!");
      return true; // Return success status
    } else {
      throw new Error(data.error || "Failed to send email");
    }
  } catch (error) {
    console.error("Error sending email:", error);
    toast(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return false; // Return failure status
  } finally {
    setIsSendingEmail(false);
  }
};

// Alternative version that returns result without managing state
export const sendEmail = async (
  recipients: string,
  subject: string,
  content: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch("https://ai-summarizer-pi-nine.vercel.app/api/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipients,
        subject,
        content,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.details || data.error || "Failed to send email");
    }

    return { success: data.success };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};