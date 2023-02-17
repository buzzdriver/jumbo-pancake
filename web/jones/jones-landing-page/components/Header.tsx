import Image from 'next/image'
import React from 'react'
import AnnouncementBanner from './AnnouncementBanner'

interface HeaderProps {
  isMainPage?: boolean
  currentSection?: string
  scrollProducts?: () => void
  scrollEpochReports?: () => void
  scrollOverview?: () => void
  scrollMission?: () => void
  scrollPartners?: () => void
}

function Header(props: HeaderProps) {
  return (
    <div className="fixed top-0 left-0 z-50 w-[100%]">
      {props.isMainPage && <AnnouncementBanner />}
      <div className="grid h-16 grid-cols-3 items-center bg-[#171717] text-white opacity-95">
        <div className="ml-10 sm:ml-32">
          <Image
            src="/logo/jones-hat.svg"
            alt="jones-logo"
            width={42}
            height={24}
          />
        </div>
        {props.isMainPage && (
          <div className="hidden space-x-4 md:-ml-20 md:flex lg:-ml-0">
            <p
              className={`cursor-pointer ${
                props.currentSection === 'Products'
                  ? 'font-extrabold text-white'
                  : 'text-gray-500'
              }`}
              onClick={props.scrollProducts}
            >
              Products
            </p>
            <p
              className={`cursor-pointer ${
                props.currentSection === 'Epoch Reports'
                  ? 'font-extrabold text-white'
                  : 'text-gray-500'
              }`}
              onClick={props.scrollEpochReports}
            >
              Reports
            </p>
            <p
              className={`cursor-pointer ${
                props.currentSection === 'Overview'
                  ? 'font-extrabold text-white'
                  : 'text-gray-500'
              }`}
              onClick={props.scrollOverview}
            >
              Overview
            </p>
            <p
              className={`cursor-pointer ${
                props.currentSection === 'Mission'
                  ? 'font-extrabold text-white'
                  : 'text-gray-500'
              }`}
              onClick={props.scrollMission}
            >
              Mission
            </p>
            <p
              className={`cursor-pointer ${
                props.currentSection === 'Partners'
                  ? 'font-extrabold text-white'
                  : 'text-gray-500'
              }`}
              onClick={props.scrollPartners}
            >
              Partners
            </p>
          </div>
        )}
        {!props.isMainPage && <div />}
        <div className="md:text-center">
          <button
            className="cursor-pointer rounded-2xl bg-gradient-to-r from-purple-500 to-primary-700 py-2 px-4 text-sm text-black hover:animate-pulse"
            onClick={() => window.open('https://app.jonesdao.io', '_blank')}
          >
            Launch App
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header
