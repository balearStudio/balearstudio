import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Problem from './components/Problem/Problem'
import HowItWorks from './components/HowItWorks/HowItWorks'
import UseCases from './components/UseCases/UseCases'
import Comparison from './components/Comparison/Comparison'
import Security from './components/Security/Security'
import Works from './components/Works/Works'
import Studio from './components/Studio/Studio'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import ProjectPage from './components/ProjectPage/ProjectPage'
import { useLanguage } from './i18n/LanguageContext'

export default function App() {
  const { slug } = useLanguage()
  return (
    <>
      <Header />
      <main>
        {slug ? (
          <ProjectPage slug={slug} />
        ) : (
          <>
            {/* ToolDeck first; the studio and its work follow, and the page
                closes on the demo request. */}
            <Hero />
            <Problem />
            <HowItWorks />
            <UseCases />
            <Comparison />
            <Security />
            <Studio />
            <Works />
            <Contact />
          </>
        )}
      </main>
      <Footer />
      {/* Chat assistant hidden for now: its worker still answers as the old
          studio and doesn't know ToolDeck yet. To bring it back, import Chat
          and ClientOnly and render <ClientOnly><Chat /></ClientOnly> here. */}
    </>
  )
}
