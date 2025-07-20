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
        "bg-gradient-to-b from-purple-500/10 to-purple-900/5",
        "border-purple-500/20",
        "p-4 text-start sm:p-6",
        "hover:from-purple-500/20 hover:to-purple-900/10",
        "hover:border-purple-400/30",
        "max-w-[320px] sm:max-w-[320px]",
        "transition-all duration-300",
        "backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 border-2 border-purple-500/30">
          <AvatarImage src={author.avatar || "/placeholder.svg"} alt={author.name} />
        </Avatar>
        <div className="flex flex-col items-start">
          <h3 className="text-md font-semibold leading-none text-white">{author.name}</h3>
          <p className="text-sm text-purple-300">{author.handle}</p>
        </div>
      </div>
      <p className="sm:text-md mt-4 text-sm text-gray-300">{text}</p>
    </Card>
  )
}
