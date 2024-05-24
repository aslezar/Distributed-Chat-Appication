/**
 * v0 by Vercel.
 * @see https://v0.dev/t/BR9NvFGmdQZ
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"

export default function Component() {
  return (
    <div className="grid h-screen w-full grid-cols-[300px_1fr] bg-white dark:bg-gray-950">
      <div className="border-r border-gray-200 dark:border-gray-800">
        <div className="flex h-[60px] items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
          <Link className="flex items-center gap-2 font-semibold" href="#">
            <MessageCircleIcon className="h-6 w-6" />
            <span>Chat</span>
          </Link>
          <Button size="icon" variant="ghost">
            <SearchIcon className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        </div>
        <Tabs className="h-[calc(100%-60px)] w-full" defaultValue="chat">
          <TabsList className="flex border-b border-gray-200 dark:border-gray-800">
            <TabsTrigger className="flex-1 py-3 text-center" value="chat">
              Chat
            </TabsTrigger>
            <TabsTrigger className="flex-1 py-3 text-center" value="calls">
              Calls
            </TabsTrigger>
          </TabsList>
          <TabsContent className="h-full overflow-auto" value="chat">
            <div className="grid gap-2 p-4">
              <div className="flex items-center gap-3 rounded-md bg-gray-100 p-3 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                <Avatar>
                  <AvatarImage alt="John Doe" src="/placeholder-avatar.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Hey, how's it going?</div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">2:30 PM</div>
              </div>
              <div className="flex items-center gap-3 rounded-md bg-gray-100 p-3 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                <Avatar>
                  <AvatarImage alt="Jane Smith" src="/placeholder-avatar.jpg" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">Jane Smith</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Did you see the new design?</div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">11:45 AM</div>
              </div>
              <div className="flex items-center gap-3 rounded-md bg-gray-100 p-3 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                <Avatar>
                  <AvatarImage alt="Group Chat" src="/placeholder-avatar.jpg" />
                  <AvatarFallback>GC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">Design Team</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">New design review at 3pm</div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">9:00 AM</div>
              </div>
            </div>
          </TabsContent>
          <TabsContent className="h-full overflow-auto" value="calls">
            <div className="grid gap-2 p-4">
              <div className="flex items-center gap-3 rounded-md bg-gray-100 p-3 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                <Avatar>
                  <AvatarImage alt="John Doe" src="/placeholder-avatar.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">John Doe</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Missed call</div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">2:30 PM</div>
              </div>
              <div className="flex items-center gap-3 rounded-md bg-gray-100 p-3 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                <Avatar>
                  <AvatarImage alt="Jane Smith" src="/placeholder-avatar.jpg" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">Jane Smith</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Incoming call</div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">11:45 AM</div>
              </div>
              <div className="flex items-center gap-3 rounded-md bg-gray-100 p-3 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                <Avatar>
                  <AvatarImage alt="Group Call" src="/placeholder-avatar.jpg" />
                  <AvatarFallback>GC</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">Design Team</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Group call</div>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">9:00 AM</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex flex-col">
        <div className="flex h-[60px] items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage alt="John Doe" src="/placeholder-avatar.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">John Doe</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Online</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost">
              <VideoIcon className="h-5 w-5" />
              <span className="sr-only">Video Call</span>
            </Button>
            <Button size="icon" variant="ghost">
              <PhoneIcon className="h-5 w-5" />
              <span className="sr-only">Voice Call</span>
            </Button>
            <Button size="icon" variant="ghost">
              <MoveHorizontalIcon className="h-5 w-5" />
              <span className="sr-only">More Options</span>
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="grid gap-4">
            <div className="flex items-end gap-3">
              <Avatar>
                <AvatarImage alt="John Doe" src="/placeholder-avatar.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="max-w-[70%] space-y-2">
                <div className="rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800">Hey, how's it going?</div>
                <div className="text-right text-xs text-gray-500 dark:text-gray-400">2:30 PM</div>
              </div>
            </div>
            <div className="flex items-end gap-3 justify-end">
              <div className="max-w-[70%] space-y-2">
                <div className="rounded-lg bg-primary p-3 text-sm text-white">I'm doing great, thanks for asking!</div>
                <div className="text-right text-xs text-gray-500 dark:text-gray-400">2:31 PM</div>
              </div>
              <Avatar>
                <AvatarImage alt="You" src="/placeholder-avatar.jpg" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-end gap-3">
              <Avatar>
                <AvatarImage alt="John Doe" src="/placeholder-avatar.jpg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="max-w-[70%] space-y-2">
                <div className="rounded-lg bg-gray-100 p-3 text-sm dark:bg-gray-800">Did you see the new design?</div>
                <div className="text-right text-xs text-gray-500 dark:text-gray-400">2:32 PM</div>
              </div>
            </div>
            <div className="flex items-end gap-3 justify-end">
              <div className="max-w-[70%] space-y-2">
                <div className="rounded-lg bg-primary p-3 text-sm text-white">Yes, I really like it! Great work.</div>
                <div className="text-right text-xs text-gray-500 dark:text-gray-400">2:33 PM</div>
              </div>
              <Avatar>
                <AvatarImage alt="You" src="/placeholder-avatar.jpg" />
                <AvatarFallback>YO</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
        <div className="flex h-[60px] items-center justify-between border-t border-gray-200 px-4 dark:border-gray-800">
          <Input className="flex-1 bg-transparent" placeholder="Type your message..." type="text" />
          <Button size="icon" variant="ghost">
            <PaperclipIcon className="h-5 w-5" />
            <span className="sr-only">Attach File</span>
          </Button>
          <Button size="icon" variant="ghost">
            <SmileIcon className="h-5 w-5" />
            <span className="sr-only">Add Emoji</span>
          </Button>
          <Button size="icon" variant="ghost">
            <SendIcon className="h-5 w-5" />
            <span className="sr-only">Send Message</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

function MessageCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}


function MoveHorizontalIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 8 22 12 18 16" />
      <polyline points="6 8 2 12 6 16" />
      <line x1="2" x2="22" y1="12" y2="12" />
    </svg>
  )
}


function PaperclipIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}


function PhoneIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}


function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}


function SendIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  )
}


function SmileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  )
}


function VideoIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  )
}