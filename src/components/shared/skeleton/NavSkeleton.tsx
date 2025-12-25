import { Skeleton } from "@/components/ui/skeleton"

export function NavbarSkeleton() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-lg bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-5 w-24 bg-gray-300 dark:bg-gray-700" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Skeleton className="h-4 w-12 bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-4 w-10 bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-4 w-14 bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-4 w-16 bg-gray-300 dark:bg-gray-700" />
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Skeleton className="h-9 w-20 rounded-md bg-gray-300 dark:bg-gray-700" />
            <Skeleton className="h-8 w-8 rounded-md bg-gray-300 dark:bg-gray-700" />
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <Skeleton className="h-9 w-9 rounded-md bg-gray-300 dark:bg-gray-700" />
          </div>
        </div>
      </div>
    </nav>
  )
}
