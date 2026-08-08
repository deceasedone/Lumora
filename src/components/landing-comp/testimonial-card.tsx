import { cn } from "@/lib/utils"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
  className?: string
}

export function TestimonialCard({ author, text, href, className }: TestimonialCardProps) {
  const Card = href ? "a" : "div"

  return (
    <Card
      {...(href ? { href } : {})}
      className={cn(
        "flex flex-col rounded-lg border-t",
        "bg-white",
        "border-[#A8C5D4]/30",
        "p-4 text-start sm:p-6",
        "hover:bg-[#E8F0EC]",
        "hover:border-[#7AB8A8]/40",
        "max-w-[320px] sm:max-w-[320px]",
        "transition-all duration-300",
        "shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 border-2 border-[#A8C5D4]/40">
          <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-md font-semibold leading-none text-[#2C3338]">{author.name}</h3>
          <p className="text-sm text-[#7AB8A8]">{author.handle}</p>
        </div>
      </div>
      <p className="sm:text-md mt-4 text-sm text-[#2C3338]/70">{text}</p>
    </Card>
  )
}
