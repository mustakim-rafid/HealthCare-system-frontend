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
        {children}
        <PublicFooter />
    </div>
  )
}

export default CommonLayout