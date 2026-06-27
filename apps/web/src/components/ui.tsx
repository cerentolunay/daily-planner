type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

const buttonVariants = {
  primary: "bg-burnt text-[#1A2C30] hover:bg-[#ff925c]",
  secondary: "bg-lagoon text-white hover:bg-[#127b88]",
  ghost: "border border-white/10 bg-white/[0.04] text-white/80 hover:border-lagoon/70 hover:bg-lagoon/20",
  danger: "bg-lust text-white hover:bg-[#ff342f]",
};

export function Button({ className = "", variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-2xl px-5 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${buttonVariants[variant]} ${className}`}
      {...props}
    />
  );
}

export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-[28px] border border-white/10 bg-[#13272c] shadow-glow ${className}`}>
      {children}
    </div>
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="min-h-[220px] w-full resize-none rounded-3xl border border-white/10 bg-[#0f2228] p-4 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-burnt focus:ring-4 focus:ring-burnt/10"
      {...props}
    />
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="w-full rounded-2xl border border-white/10 bg-[#0f2228] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-burnt focus:ring-4 focus:ring-burnt/10"
      {...props}
    />
  );
}
