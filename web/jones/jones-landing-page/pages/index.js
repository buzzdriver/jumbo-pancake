import { Button, Text } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import AnnouncementBanner from '../components/AnnouncementBanner'
import EpochReports from '../components/EpochReports'
import HatCouncilMember from '../components/HatCouncil'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import JonesTenets from '../components/JonesTenets'
import Layout from '../components/Layout'
import Partners from '../components/Partners'
import Products from '../components/Products'
import Supported from '../components/Supported'

const Home = () => {
  const [currentSection, setCurrentSection] = useState('Products')
  const productRef = useRef(null)
  const epochReportsRef = useRef(null)
  const overviewRef = useRef(null)
  const missionRef = useRef(null)
  const partnersRef = useRef(null)

  const scrollProducts = () => {
    productRef.current &&
      productRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    setCurrentSection('Products')
  }
  const scrollEpochReports = () => {
    epochReportsRef.current &&
      epochReportsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    setCurrentSection('Epoch Reports')
  }
  const scrollOverview = () => {
    overviewRef.current &&
      overviewRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    setCurrentSection('Overview')
  }
  const scrollMission = () => {
    missionRef.current &&
      missionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    setCurrentSection('Mission')
  }

  const scrollPartners = () => {
    partnersRef.current &&
      partnersRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    setCurrentSection('Partners')
  }

  return (
    <div
      className="relative overflow-hidden font-body text-white"
      style={{
        background:
          'radial-gradient(179.65% 114.2% at 50% 42.64%, #000000 0%, #0F1314 100%',
      }}
    >
      <AnnouncementBanner />
      <Header
        isMainPage={true}
        currentSection={currentSection}
        scrollProducts={scrollProducts}
        scrollEpochReports={scrollEpochReports}
        scrollOverview={scrollOverview}
        scrollMission={scrollMission}
        scrollPartners={scrollPartners}
      />
      <Layout hideSideOrbs={false}>
        <HeroSection />
        <div ref={productRef} />
        <Products />
        <div ref={epochReportsRef} />
        <EpochReports />
        <div ref={overviewRef} />
        <Supported />
        <div ref={missionRef} />
        <JonesTenets />
        <HatCouncilMember />
        <div ref={partnersRef} />
        <Partners />
      </Layout>
    </div>
  )
}

export default Home
