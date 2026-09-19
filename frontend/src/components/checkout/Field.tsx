import { cn } from "@/lib/utils";

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-body-sm", className)}>
      <span className="text-caption font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
