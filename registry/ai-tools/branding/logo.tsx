import { cn } from "@/lib/utils"

export function Logo({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 32"
      role="img"
      aria-label="AI Tools"
      className={cn("text-foreground h-6", className)}
      {...props}
    >
      <title>AI Tools</title>
      <g transform="translate(0,0)" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="0.75" y="0.75" width="30.5" height="30.5" rx="7" />
        <circle cx="8" cy="8" r="2" fill="currentColor" />
        <circle cx="24" cy="8" r="2" fill="currentColor" />
        <circle cx="8" cy="24" r="2" fill="currentColor" />
        <circle cx="24" cy="24" r="2" fill="currentColor" />
        <path d="M8 8 L24 24M24 8 L8 24" opacity="0.6" />
        <path d="M16 9 L18.8 16 L16 23 L13.2 16 Z" fill="currentColor" stroke="none" opacity="0.9" />
      </g>
      <g transform="translate(40,22)" fill="currentColor">
        <text x="0" y="0" fontFamily="inherit" fontWeight="700" fontSize="16">AI</text>
        <text x="20" y="0" fontFamily="inherit" fontWeight="500" fontSize="16">Tools</text>
      </g>
    </svg>
  )
}
