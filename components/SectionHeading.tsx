/** Editorial section header. The number sits in the page's left gutter as
    a folio, the way a printed journal numbers its margins, and the heading
    stands alone: no small caps label repeating what the title says. Sections
    that only have a label promote it to the heading, set small in the
    display face. Below 640px the gutter is too thin, so the folio sits as a
    bare number above the heading instead. */
export default function SectionHeading({
  index,
  label,
  title,
}: {
  index: string; // "01"
  label: string; // "the toolkit"
  title?: string; // big serif line; falls back to the label
}) {
  const text = title ?? label;
  return (
    <h2
      className={`display relative mb-8 text-foreground ${
        title ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"
      }`}
    >
      <span
        aria-hidden
        className={`folio ${title ? "sm:top-[0.55rem] md:top-[0.7rem]" : "sm:top-[0.4rem] md:top-[0.55rem]"}`}
      >
        {index}
      </span>
      {text}
    </h2>
  );
}
