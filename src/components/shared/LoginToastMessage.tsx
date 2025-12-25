"use client"

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

const LoginToastMessage = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (searchParams.get("loggedIn") === "true") {
            toast.success("Logged in successfully!")
            router.replace(pathname)
        }
    }, [searchParams])

  return null
}

export default LoginToastMessage