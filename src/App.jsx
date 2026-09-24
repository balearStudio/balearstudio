import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Works from './components/Works/Works'
import Studio from './components/Studio/Studio'
import Contact from './components/Contact/Contact'
import Footer from './components/Footer/Footer'
import Chat from './components/Chat/Chat'
import ClientOnly from './components/ClientOnly'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Works />
        <Studio />
        <Contact />
      </main>
      <Footer />
      <ClientOnly>
        <Chat />
      </ClientOnly>
    </>
  )
}
