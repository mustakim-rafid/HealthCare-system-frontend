import { Inter } from 'next/font/google'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
}

export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.className}>
      <body className="h-screen w-full flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full text-center shadow-lg p-8 border-none">
          <CardHeader>
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <CardTitle className="text-3xl font-bold">404 - Page Not Found</CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Oops! The page you’re looking for doesn’t exist or has been moved.
            </CardDescription>
          </CardHeader>

          <CardContent className="mt-6">
            <Link href="/">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Go Back Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </body>
    </html>
  )
}
