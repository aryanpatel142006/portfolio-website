export default function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 font-serif text-2xl font-medium text-foreground">
      {children}
    </h2>
  );
}
