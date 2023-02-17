import Image from 'next/image'
import React from 'react'

interface PartnerProps {
  name: string
  width: string
  height: string
  link: string
}

const partners: Array<PartnerProps> = [
  {
    name: 'dopex',
    width: '120px',
    height: '36px',
    link: 'https://twitter.com/dopex_io',
  },
  {
    name: 'olympus',
    width: '127.7px',
    height: '23.82px',
    link: 'https://twitter.com/OlympusDAO',
  },
  {
    name: 'badger',
    width: '131.91px',
    height: '36px',
    link: 'https://twitter.com/BadgerDAO',
  },
  {
    name: 'citadel',
    width: '120px',
    height: '36px',
    link: 'https://twitter.com/TheCitadel_DAO',
  },
  {
    name: 'gmx',
    width: '95.7px',
    height: '24.16px',
    link: 'https://twitter.com/GMX_IO',
  },
  {
    name: 'plutus',
    width: '150px',
    height: '90px',
    link: 'https://twitter.com/PlutusDAO_io',
  },
]

function Partners() {
  return (
    <div>
      <p className="mt-32 text-center text-2xl font-bold">Partners</p>
      <div className="mt-6 grid grid-cols-2 items-center justify-center gap-x-5 gap-y-10 px-5 pb-20 md:ml-10 lg:grid-cols-6">
        {partners.map((p) => (
          <img
            src={`/partners/${p.name}.svg`}
            alt="partner"
            key={p.name}
            width={p.width}
            height={p.height}
            className="block cursor-pointer object-fill"
            onClick={() => window.open(p.link, '_blank')}
          />
        ))}
      </div>
    </div>
  )
}

export default Partners
