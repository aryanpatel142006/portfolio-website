"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/content";
import ChatRichText from "./ChatRichText";
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
  const { messages, sendMessage, status, error, stop } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const busy = status === "submitted" || status === "streaming";
  const started = messages.length > 0;
  const me = firstName(profile.name).toLowerCase();

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
    <section id="chat" aria-label="Ask me anything" className="scroll-mt-20">
      <SectionHeading
        index="02"
        label="query me"
        title="Don't just read about me — ask me."
      />
      <p className="-mt-4 mb-6 max-w-md text-[13.5px] leading-relaxed text-muted">
        A live model, grounded in my actual resume — it only knows what&rsquo;s
        true about me.
      </p>

      {/* the terminal */}
      <div className="field-focus overflow-hidden rounded-lg border border-border-strong bg-surface shadow-[var(--shadow)]">
        {/* title bar */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
          <span aria-hidden className="flex gap-1.5">
            <i className="h-2.5 w-2.5 rounded-full border border-border-strong bg-card-hover" />
            <i className="h-2.5 w-2.5 rounded-full border border-border-strong bg-card-hover" />
            <i className="h-2.5 w-2.5 rounded-full border border-border-strong bg-live/60" />
          </span>
          <span className="ml-2 font-mono text-[11px] text-muted">
            {me}@portfolio — ask anything
          </span>
        </div>

        {/* conversation */}
        <div
          ref={scrollRef}
          role="log"
          aria-live="polite"
          className="min-h-[280px] max-h-[440px] overflow-y-auto p-5 font-mono text-[13px] leading-relaxed"
        >
          <p className="text-muted-strong">
            <span className="text-accent">$</span> hey! ask anything about{" "}
            {firstName(profile.name)}.
            <span
              aria-hidden
              className="caret-blink ml-1.5 inline-block h-3.5 w-[7px] translate-y-0.5 bg-accent/70"
            />
          </p>

          {/* suggestion chips stay available for follow-ups, not just openers */}
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => submit(q)}
                disabled={busy}
                className="hitbox rounded-md border border-border bg-card px-3 py-1.5 text-[12px] text-muted-strong transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-accent/50 hover:bg-card-hover hover:text-foreground disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {messages.map((m) => {
            const text = m.parts
              .map((p) => (p.type === "text" ? p.text : ""))
              .join("");
            return (
              <div key={m.id} className="mt-4">
                <span className={m.role === "user" ? "text-accent" : "text-live"}>
                  {m.role === "user" ? "you" : me}
                  <span className="text-muted"> &gt; </span>
                </span>
                {m.role === "assistant" ? (
                  <ChatRichText text={text} />
                ) : (
                  <span className="whitespace-pre-wrap text-foreground">
                    {text}
                  </span>
                )}
              </div>
            );
          })}

          {busy && messages[messages.length - 1]?.role === "user" && (
            <div className="mt-4 text-muted">
              {me}
              <span> &gt; </span>
              <span className="animate-pulse">…</span>
            </div>
          )}

          {error && (
            <p className="mt-4 whitespace-pre-wrap text-[12px] text-red-500/90">
              {error.message && error.message !== "An error occurred."
                ? error.message
                : "hmm, something went sideways — give it another try, or just email me instead."}
            </p>
          )}
        </div>

        {/* input row */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
          className="relative flex items-center gap-2 border-t border-border px-4 py-3"
        >
          <span className="font-mono text-accent" aria-hidden>
            &gt;
          </span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="send a message..."
            aria-label="Ask a question"
            className="flex-1 bg-transparent font-mono text-[13px] text-foreground placeholder:text-muted focus:outline-none"
          />
          {busy ? (
            <button
              type="button"
              onClick={() => stop()}
              aria-label="Stop generating"
              className="hitbox text-muted transition-colors hover:text-foreground"
            >
              <span
                aria-hidden
                className="block h-3 w-3 rounded-[2px] bg-current"
              />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send"
              className="hitbox text-muted transition-colors hover:text-foreground disabled:opacity-40"
            >
              <SendIcon width={16} height={16} />
            </button>
          )}
        </form>
      </div>
    </section>
  );
}
