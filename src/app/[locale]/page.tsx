import { CurrencyProvider } from "@/components/landing/currency-context"
import { LanguageProvider } from "@/components/landing/language-context"
import LandingPage from "@/components/landing/landing-page"
import Head from 'next/head'

export default function Page() {
  return (
    <>
      <Head>
        <title>Pagado! - Gestiona tu dinero con Pagado!</title>
        <meta name="description" content="Gestiona tu dinero con Pagado! - Gestiona tu dinero con Pagado!" />
        <meta name="keywords" content="Pagado!, Gestiona tu dinero, Gestiona tu dinero con Pagado!" />
        <meta name="author" content="Pagado!" />
        <meta name="google-site-verification" content="_PGD5VRry7jI_vSJwRSOnjIc7uuxFrIrYZqvwRVch2k" />
      </Head>
      <CurrencyProvider>
        <LandingPage />
      </CurrencyProvider>
      {/* // </LanguageProvider> */}
    </>
  )
}
