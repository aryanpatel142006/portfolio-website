"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/content";
import SectionHeading from "./SectionHeading";
import { SendIcon } from "./icons";

const SUGGESTIONS = [
  "tell me about yourself",
  "what projects have you built?",
  "what are your technical skills?",
];

function firstName(name: string) {
  return name.split(" ")[0] || name;
}

export default function QueryMe() {
  const { messages, sendMessage, status, error } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const busy = status === "submitted" || status === "streaming";
  const started = messages.length > 0;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    sendMessage({ text: trimmed });
    setInput("");
  }

  return (
    <section aria-label="Ask me anything">
      <SectionHeading>query me</SectionHeading>

      <div className="field-focus flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md">
        {/* Conversation area */}
        <div
          ref={scrollRef}
          className="min-h-[280px] max-h-[440px] overflow-y-auto p-5 font-mono text-[13px] leading-relaxed"
        >
          <p className="text-muted-strong">
            Hey! Ask anything about {firstName(profile.name)}.
          </p>

          {!started && (
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => submit(q)}
                  className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-[12px] text-foreground/70 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/20 hover:text-foreground/90"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className="mt-4">
              <span
                className={
                  m.role === "user" ? "text-accent" : "text-muted"
                }
              >
                {m.role === "user" ? "you" : firstName(profile.name).toLowerCase()}
                <span className="text-muted"> &gt; </span>
              </span>
              <span className="whitespace-pre-wrap text-foreground">
                {m.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("")}
              </span>
            </div>
          ))}

          {busy && messages[messages.length - 1]?.role === "user" && (
            <div className="mt-4 text-muted">
              {firstName(profile.name).toLowerCase()}
              <span> &gt; </span>
              <span className="animate-pulse">…</span>
            </div>
          )}

          {error && (
            <p className="mt-4 whitespace-pre-wrap text-[12px] text-red-400/80">
              {error.message && error.message !== "An error occurred."
                ? error.message
                : "couldn't reach the model — check AI_GATEWAY_API_KEY (and that AI Gateway billing is enabled)."}
            </p>
          )}
        </div>

        {/* Input row */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="flex items-center gap-2 border-t border-white/[0.08] px-4 py-3"
        >
          <span className="font-mono text-accent" aria-hidden>
            &gt;
          </span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="send a message..."
            disabled={busy}
            aria-label="Ask a question"
            className="flex-1 bg-transparent font-mono text-[13px] text-foreground placeholder:text-muted focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send"
            className="text-muted transition-colors hover:text-foreground disabled:opacity-40"
          >
            <SendIcon width={16} height={16} />
          </button>
        </form>
      </div>
    </section>
  );
}
