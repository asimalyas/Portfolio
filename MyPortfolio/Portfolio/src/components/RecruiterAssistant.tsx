import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

type ChatMessage = {
  role: "assistant" | "user";
  text: string;
};

const MAX_QUESTION_CHARS = 300;

const welcomeMessage =
  "Hi, I'm Asim's AI recruiter assistant. Ask me about his skills, projects, education, achievements, or contact details.";
const unavailableMessage = "The AI assistant is temporarily unavailable. Please try again shortly.";

function renderInlineMarkdown(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${part}-${index}`} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
  });
}

function AssistantMarkdown({ text }: { text: string }) {
  const lines = text
    .replace(/<[^>]*>/g, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flushBullets = () => {
    if (!bullets.length) return;

    blocks.push(
      <ul key={`bullets-${blocks.length}`} className="my-1 list-disc space-y-1 pl-4">
        {bullets.map((bullet, index) => (
          <li key={`${bullet}-${index}`}>{renderInlineMarkdown(bullet)}</li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  lines.forEach((line) => {
    const bulletMatch = line.match(/^[-*]\s+(.+)$/);

    if (bulletMatch) {
      bullets.push(bulletMatch[1]);
      return;
    }

    flushBullets();
    blocks.push(
      <p key={`paragraph-${blocks.length}`} className="my-1">
        {renderInlineMarkdown(line)}
      </p>,
    );
  });

  flushBullets();

  return <>{blocks}</>;
}

export default function RecruiterAssistant() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: welcomeMessage },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const hasUserQuestion = messages.some((message) => message.role === "user");

  useEffect(() => {
    if (!open) return;
    latestMessageRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading, open]);

  const askQuestion = async (rawQuestion: string) => {
    const nextQuestion = rawQuestion.trim();
    setError("");

    if (!nextQuestion) {
      setError("Please enter a question.");
      return;
    }

    if (nextQuestion.length > MAX_QUESTION_CHARS) {
      setError(`Questions must be ${MAX_QUESTION_CHARS} characters or fewer.`);
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setSuggestionsOpen(false);
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", text: nextQuestion }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: nextQuestion }),
      });

      let data: { answer?: string; error?: string } = {};
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        try {
          data = (await response.json()) as { answer?: string; error?: string };
        } catch {
          data = {};
        }
      }

      if (!response.ok) {
        throw new Error(unavailableMessage);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.answer || unavailableMessage,
        },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : unavailableMessage;
      setError(message);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: message },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void askQuestion(question);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-20 left-3 right-3 top-3 flex max-h-[calc(100dvh-6rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-purple-500/15 lg:bottom-24 lg:left-auto lg:right-6 lg:top-auto lg:h-[min(620px,calc(100dvh-7rem))] lg:w-[420px] lg:max-h-[calc(100dvh-7rem)]"
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">AI Recruiter Assistant</h2>
                  <p className="text-xs text-muted-foreground">Answers from portfolio data only</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Close AI recruiter assistant"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  ref={index === messages.length - 1 ? latestMessageRef : undefined}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                        : "border border-border bg-muted/60 text-foreground"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <AssistantMarkdown text={message.text} />
                    ) : (
                      <p>{message.text}</p>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div ref={latestMessageRef} className="flex justify-start">
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-border px-4 py-3">
              {!hasUserQuestion && (
                <div className="mb-3 grid gap-2">
                  {portfolioData.suggestedQuestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      disabled={isLoading}
                      onClick={() => void askQuestion(suggestion)}
                      className="rounded-xl border border-border bg-muted/50 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-indigo-500/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {hasUserQuestion && (
                <div className="mb-2">
                  <button
                    type="button"
                    onClick={() => setSuggestionsOpen((value) => !value)}
                    className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                    aria-expanded={suggestionsOpen}
                  >
                    {suggestionsOpen ? "Hide suggestions" : "Show suggestions"}
                  </button>

                  {suggestionsOpen && (
                    <div className="mt-2 max-h-24 space-y-1 overflow-y-auto pr-1">
                      {portfolioData.suggestedQuestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          disabled={isLoading}
                          onClick={() => void askQuestion(suggestion)}
                          className="block w-full rounded-lg border border-border bg-muted/40 px-2 py-1 text-left text-[11px] text-muted-foreground transition-colors hover:border-indigo-500/50 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {error && (
                <p className="mb-2 text-xs text-red-500 dark:text-red-400" role="alert">
                  {error}
                </p>
              )}

              <form onSubmit={handleSubmit} className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <input
                    type="text"
                    value={question}
                    maxLength={MAX_QUESTION_CHARS}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Ask about Asim's fit..."
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-right text-[11px] text-muted-foreground">
                    {question.length}/{MAX_QUESTION_CHARS}
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !question.trim()}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-purple-500/20 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send question"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((value) => !value)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className="ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl shadow-purple-500/30 ring-1 ring-white/20"
        aria-label={open ? "Close AI recruiter assistant" : "Open AI recruiter assistant"}
        aria-expanded={open}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>
    </div>
  );
}
