export function FeedShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="custom-container mx-auto">
      <div className="gap-xl pt-xl pb-3xl md:gap-3xl mx-auto flex w-full max-w-150 flex-col md:pt-[clamp(16px,-11.43px+3.57vw,40px)]">
        {children}
      </div>
    </div>
  );
}
