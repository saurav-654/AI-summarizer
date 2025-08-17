"use client";

import { useState } from "react";
import React, { useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { generateSummary,getSummary } from './util/summary';
import { shareViaEmail } from './util/sendmail';
export default function Home() {
  const [uploadedText, setUploadedText] = useState("");
  const [inputText, setInputText] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [summary, setSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [emailRecipients, setEmailRecipients] = useState("");
  const [activeTab, setActiveTab] = useState<"upload" | "text">("upload");
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileType = file.type;
    

    setIsProcessingFile(true);

    try {
      if (fileType === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedText(e.target?.result as string);
          setIsProcessingFile(false);
        };
        reader.onerror = () => {
          ("Error reading text file");
          setIsProcessingFile(false);
        };
        reader.readAsText(file);
      } else {
        toast("Please upload a .txt file (PDF/DOC/DOCX not yet supported)");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast(`Error processing file: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsProcessingFile(false);
    }
  };
const handleSummarize = async () => {
    const textToSummarize = activeTab === "upload" ? uploadedText : inputText;
    
    await generateSummary({
      textToSummarize,
      customPrompt,
      setIsGenerating,
      setSummary
    });
  };


  const summaryEditableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
  if (summaryEditableRef.current && summaryEditableRef.current.innerHTML !== summary) {
    summaryEditableRef.current.innerHTML = summary || '';
  }
}, [summary]);
  

 const handleShareViaEmail = async () => {
    const success = await shareViaEmail({
      emailRecipients,
      summary,
      setIsSendingEmail
    });
    
    if (success) {
      setEmailRecipients(""); // Clear email field on success
    }
  };

  const removeUploadedFile = () => {
    setUploadedText("");
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Summarizer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your documents and text into actionable summaries with AI
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-300">
          {/* Tabs */}
          <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                activeTab === "upload" ? "bg-white shadow-md text-blue-600" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload File
              </span>
            </button>
            <button
              onClick={() => setActiveTab("text")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                activeTab === "text" ? "bg-white shadow-md text-purple-600" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Write Text
              </span>
            </button>
          </div>

          {/* Upload Tab */}
          {activeTab === "upload" && (
            <>
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  disabled={isProcessingFile}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-purple-500 file:text-white hover:file:from-blue-600 hover:file:to-purple-600 file:cursor-pointer file:transition-all disabled:file:bg-gray-400"
                />
                {isProcessingFile && (
                  <div className="mt-4 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-blue-600 font-medium">Processing file...</span>
                  </div>
                )}
              </div>
              {uploadedText && (
                <div className="mt-6 animate-fadeIn">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <p className="text-sm font-medium text-green-700">File uploaded successfully</p>
                    </div>
                    <button
                      onClick={removeUploadedFile}
                      className="flex items-center px-3 py-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-full border border-red-200 transition-colors"
                    >
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove
                    </button>
                  </div>
                  <textarea
                    value={uploadedText}
                    onChange={(e) => setUploadedText(e.target.value)}
                    className="w-full h-64 p-4 border-2 border-blue-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 bg-white/70 leading-relaxed text-sm"
                    placeholder="Extracted text will appear here. You can edit it if needed..."
                  />
                </div>
              )}
            </>
          )}

          {/* Text Tab */}
          {activeTab === "text" && (
            <>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-64 p-4 border-2 border-purple-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-700 bg-white/50 leading-relaxed"
                placeholder="📝 Paste your meeting notes, transcript, or any text you want to summarize..."
              />
              <div className="mt-2 text-right">
                <span className="text-sm text-gray-500">{inputText.length} characters</span>
              </div>
            </>
          )}
        </div>

        {/* Custom Prompt */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Custom Instructions</h2>
          </div>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-700 bg-white/50"
            placeholder="✨ Tell the AI how to summarize your content..."
          />
        </div>

        {/* Generate Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleSummarize}
            disabled={isGenerating || (!uploadedText && !inputText)}
            className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-12 rounded-full transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl"
          >
            <span className="flex items-center">
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Magic...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Summary
                </>
              )}
            </span>
          </button>
        </div>

        {/* Summary */}
        {summary && (
  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8 animate-slideUp hover:shadow-2xl transition-all duration-300">
    <div className="flex items-center mb-6">
      <div className="p-2 bg-green-100 rounded-lg mr-3">
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800">Your AI Summary</h2>
      <span className="ml-auto text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">Editable</span>
    </div>
    <div
      ref={summaryEditableRef}
      contentEditable
      suppressContentEditableWarning
      className="w-full min-h-56 p-4 border-2 border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all leading-relaxed prose prose-sm max-w-none tex text-slate-800"
      onInput={() => {
        setSummary(summaryEditableRef.current?.innerHTML || "");
      }}
    ></div>
  </div>
)}

        {/* Share via Email */}
        {summary && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 animate-slideUp hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-amber-100 rounded-lg mr-3">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Share Your Summary</h2>
            </div>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                multiple
                value={emailRecipients}
                onChange={(e) => setEmailRecipients(e.target.value)}
                placeholder="Enter email addresses (comma-separated)"
                className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all bg-white/50 text-black"
              />
              <button
                onClick={handleShareViaEmail}
                disabled={isSendingEmail}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center">
                  {isSendingEmail ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Email
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
