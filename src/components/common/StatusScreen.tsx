import gsap from 'gsap';
import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';

export interface StatusDetail {
  label: string;
  value: string;
  tone?: 'error';
}

interface StatusScreenProps {
  badge: string;
  code: string;
  chip: string;
  title: string;
  description: string;
  documentTitle: string;
  details: StatusDetail[];
  children: ReactNode; // the action buttons
}

export function StatusScreen({
  badge,
  code,
  chip,
  title,
  description,
  documentTitle,
  details,
  children,
}: StatusScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const previous = document.title;
    document.title = documentTitle;
    headingRef.current?.focus(); // announce the new "page" to screen-reader and keyboard users
    return () => {
      document.title = previous;
    };
  }, [documentTitle]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-enter]',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.09, ease: 'power2.out', clearProps: 'transform,opacity' },
      );
      gsap.fromTo(
        '[data-code]',
        { scale: 0.92, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'power3.out', clearProps: 'transform,opacity' },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-[70vh] flex-col items-center justify-center gap-5 overflow-hidden px-4 py-12 text-center"
    >
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <p
        data-enter
        className="relative inline-flex items-center gap-2 rounded-full bg-card px-3 py-1 font-mono text-[11px] text-muted-foreground"
      >
        <span className="size-1.5 rounded-full bg-destructive" aria-hidden="true" />
        {badge}
      </p>

      <div className="relative flex flex-col items-center">
        <p
          data-code
          aria-hidden="true"
          className="bg-linear-to-b from-primary to-primary/20 bg-clip-text font-heading text-[clamp(6rem,18vw,11rem)] font-bold leading-none text-transparent"
        >
          {code}
        </p>
        <code data-enter className="-mt-3 rounded-md bg-card px-3 py-1 font-mono text-xs text-muted-foreground">
          {chip}
        </code>
      </div>

      <div data-enter className="relative max-w-xl space-y-2">
        <h1 ref={headingRef} tabIndex={-1} className="font-heading text-headline-md focus:outline-none md:text-headline-lg">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <dl
        data-enter
        className="relative grid w-full max-w-2xl grid-cols-1 gap-2 rounded-2xl border border-border bg-card p-3 text-left sm:grid-cols-3"
      >
        {details.map((d) => (
          <div key={d.label} className="min-w-0 rounded-xl bg-background px-3 py-2">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{d.label}</dt>
            <dd
              title={d.value}
              className={`mt-0.5 break-words font-mono text-xs ${d.tone === 'error' ? 'text-destructive' : 'text-foreground'}`}
            >
              {d.value}
            </dd>
          </div>
        ))}
      </dl>

      <div data-enter className="relative flex flex-wrap items-center justify-center gap-3">
        {children}
      </div>
    </div>
  );
}

export const primaryAction =
  'inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
export const secondaryAction =
  'inline-flex items-center gap-2 rounded-xl bg-muted px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-primary';