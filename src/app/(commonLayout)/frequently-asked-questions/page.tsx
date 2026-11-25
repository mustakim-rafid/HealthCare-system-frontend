import FAQ from '@/components/module/Home/FAQ'
import { Metadata } from 'next';

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "FAQ",
}

const FAQPage = () => {
  return (
    <div>
        <FAQ />
    </div>
  )
}

export default FAQPage