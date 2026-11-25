export const dynamic = "force-dynamic";

import PublicFooter from '@/components/shared/PublicFooter'
import { PublicNavbar } from '@/components/shared/PublicNavbar'
import { ReactNode } from 'react'

const CommonLayout = ({ children }: {
    children: ReactNode
}) => {
  return (
    <div>
        <PublicNavbar />
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>
        <PublicFooter />
    </div>
  )
}

export default CommonLayout