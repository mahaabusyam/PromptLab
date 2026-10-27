import { useScrollReveal } from "@/hooks/useScrollReveal";

interface PagePlaceholderProps {
  title: string;
  description: string;
}

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  const ref = useScrollReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="space-y-2">
      <h1 data-reveal className="text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      <p data-reveal className="text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
