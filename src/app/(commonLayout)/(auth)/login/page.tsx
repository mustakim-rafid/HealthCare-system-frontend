export const dynamic = "force-dynamic";

import LoginForm from "@/components/module/Auth/LoginForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const LoginPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ redirect: string }>
}) => {
  const params = await searchParams
  const { redirect } = params

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center p-3">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              Enter your email and password below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm redirect={redirect} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage