import { stack } from "@/lib/content";

/** The grouped skills index under the marquee — set like a colophon table. */
export default function StackGroups() {
  if (stack.length === 0) return null;

  return (
    <div className="flex flex-col">
      {stack.map((group) => (
        <div
          key={group.label}
          className="grid grid-cols-1 gap-1.5 border-b border-border py-4 sm:grid-cols-[180px_1fr] sm:gap-6"
        >
          <span className="kicker pt-0.5">{group.label}</span>
          <p className="text-[13.5px] leading-relaxed text-muted-strong">
            {group.items.map((item, i) => (
              <span key={item}>
                <span className="text-foreground/85">{item}</span>
                {i < group.items.length - 1 && (
                  <span aria-hidden className="text-muted"> · </span>
                )}
              </span>
            ))}
          </p>
        </div>
      ))}
    </div>
  );
}
