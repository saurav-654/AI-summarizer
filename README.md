# AI Summarizer

An intelligent document summarization tool powered by AI that transforms your documents, PDFs, and text into actionable summaries.

## Features

✨ **Smart Summarization**: Uses advanced AI (Groq LLaMA) to generate intelligent summaries  
📄 **Multiple File Formats**: Supports TXT 
✏️ **Text Input**: Direct text input for quick summarization  
🎯 **Custom Prompts**: Tailor summaries with custom instructions  
📝 **Editable Results**: Edit and refine generated summaries  
📧 **Email Sharing**: Send summaries directly via email  
🎨 **Beautiful UI**: Modern, responsive design with Tailwind CSS

## Technologies Used

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI Integration**: Groq SDK with LLaMA 3.3 70B model
- **Email Service**: Nodemailer with Gmail SMTP
- **Styling**: Custom animations and glassmorphism effects

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm/bun
- Gmail account for email functionality

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd para_summarizer/summarizer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your_gmail_app_password
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Configuration

### AI Setup (Groq)
1. Sign up at [Groq Console](https://console.groq.com/)
2. Generate an API key
3. Add the key to your `.env.local` file

### Email Setup (Gmail)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Google Account → Security → 2-Step Verification → App passwords
3. Use the app password in your `.env.local` file

## Usage

1. **Upload a Document**: Drag and drop or select TXT, PDF, DOC, or DOCX files
2. **Or Enter Text**: Use the text input tab to paste or type content
3. **Add Custom Instructions**: Specify how you want the content summarized
4. **Generate Summary**: Click the generate button to create your AI summary
5. **Edit & Share**: Refine the summary and share via email

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── sendEmail/
│   │   │   └── route.ts          # Email API endpoint
│   │   └── summary_gen/
│   │       └── route.ts          # AI summarization endpoint
│   ├── utils/
│   │   ├── pdf_text.ts           # PDF text extraction
│   │   └── docx-text.ts          # Word document extraction
│   ├── loading.tsx               # Custom loading component
│   ├── not-found.tsx            # Custom 404 page
│   └── page.tsx                 # Main application page
└── ...
```

## API Endpoints

### POST /api/summary_gen
Generates AI summaries from text input.

**Body:**
```json
{
  "textinput": "Text to summarize",
  "customPrompt": "Custom instructions"
}
```

### POST /api/sendEmail
Sends email with summary content.

**Body:**
```json
{
  "recipients": "email1@example.com,email2@example.com",
  "subject": "Email subject",
  "content": "HTML content"
}
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@ai-summarizer.com or create an issue on GitHub.

---

Built with ❤️ using Next.js and AI
