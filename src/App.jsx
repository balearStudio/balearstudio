import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Works from './components/Works/Works'
import Studio from './components/Studio/Studio'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import Chat from './components/Chat/Chat'
import ClientOnly from './components/ClientOnly'
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
            <Hero />
            <Works />
            <Studio />
            <Contact />
          </>
        )}
      </main>
      <Footer />
      <ClientOnly>
        <Chat />
      </ClientOnly>
    </>
  )
}
