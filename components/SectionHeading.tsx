/** Editorial section header: a numbered mono kicker over a big serif title. */
export default function SectionHeading({
  index,
  label,
  title,
}: {
  index: string; // "01"
  label: string; // "the toolkit"
  title?: string; // big serif line under the kicker
}) {
  return (
    <div className="mb-8">
      <p className="kicker">
        <span className="text-accent">{index}</span>
        <span aria-hidden> / </span>
        {label}
      </p>
      {title ? (
        <h2 className="display mt-2 text-3xl text-foreground sm:text-4xl">
          {title}
        </h2>
      ) : (
        // keep the document outline intact for screen readers
        <h2 className="sr-only">{label}</h2>
      )}
    </div>
  );
}
