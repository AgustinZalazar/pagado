import { CurrencyProvider } from "@/components/landing/currency-context"
import { LanguageProvider } from "@/components/landing/language-context"
import LandingPage from "@/components/landing/landing-page"

export default function Page() {
  return (

    <CurrencyProvider>
      <LandingPage />
    </CurrencyProvider>
    // </LanguageProvider>
  )
}
