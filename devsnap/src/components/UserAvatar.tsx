import Image from "next/image"
import { cn } from "@/lib/utils"

interface UserAvatarProps {
  name?: string | null
  image?: string | null
  className?: string
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export default function UserAvatar({ name, image, className }: UserAvatarProps) {
  const sizeClass = cn(
    "h-8 w-8 shrink-0 rounded-full overflow-hidden flex items-center justify-center text-xs font-semibold",
    className
  )

  if (image) {
    return (
      <div className={sizeClass}>
        <Image src={image} alt={name ?? "User"} width={32} height={32} className="object-cover" />
      </div>
    )
  }

  const initials = name ? getInitials(name) : "?"

  return (
    <div className={cn(sizeClass, "bg-sidebar-primary text-sidebar-primary-foreground")}>
      {initials}
    </div>
  )
}
