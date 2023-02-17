import { Button, Text } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

const ArrowUpRightIcon = ({
  fill,
  width,
  height,
}: {
  fill?: string
  width?: number
  height?: number
}) => (
  <svg
    className="ml-2 inline-block align-baseline"
    width={width ?? 12}
    height={height ?? 12}
    viewBox="0 0 12 12"
    fill={fill || '#7163BB'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.1204 9.79817C11.6544 9.79817 12 9.40498 12 8.83879V0.990826C12 0.29882 11.623 0 11.0105 0H3.14136C2.56021 0 2.19895 0.346003 2.19895 0.880734C2.19895 1.41547 2.57592 1.7772 3.15707 1.7772H6.94241L9.21989 1.61992L7.09948 3.6173L0.298429 10.4273C0.125654 10.6003 0 10.8362 0 11.0878C0 11.6383 0.361257 12 0.910995 12C1.20942 12 1.42932 11.8742 1.60209 11.7012L8.38743 4.92267L10.3665 2.8152L10.2094 5.3945V8.85452C10.2094 9.43644 10.5707 9.79817 11.1204 9.79817Z" />
  </svg>
)

interface TenetsProps {
  description: string
  category: string
}

const Tenets: Array<TenetsProps> = [
  {
    description:
      "Utilize our option strategist's expertise to generate yield with by depositing into the Jones vaults. Learn about options strategy through the community.",
    category: 'Options Apprentices',
  },
  {
    description:
      'Unlock deep liquidity for the decentralized options ecosystem through composable jAssets while earning yield.',
    category: 'Autonomous Depositors',
  },
  {
    description:
      'A service for trustless treasury management solutions to maximize growth.',
    category: 'DAO Treasuries',
  },
]

function JonesTenets() {
  return (
    <div className="relative">
      <div className="z-10 md:absolute">
        <p className="mt-32 text-2xl font-bold">The Tenets of Jones</p>
        <p className="mt-10 font-light">
          Jones DAO is a yield, strategy, and liquidity protocol for options. We
          deploy vaults that enable one-click access to institutional-grade
          options strategies while unlocking capital efficiency & liquidity for
          DeFi options through yield-bearing options-backed asset tokens.
          <br />
          <br />
          There are three main categories of users Jones DAO is built for:
        </p>
        <div className="mt-8 grid grid-cols-1 gap-x-3 gap-y-5 md:grid-cols-3">
          {Tenets.map((t) => (
            <div
              key={t.category}
              className="rounded-lg bg-jones-slate/70 px-6 py-10 backdrop-blur-sm"
            >
              <p>{t.category}</p>
              <p className="mt-3 text-gray-200">{t.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex justify-end">
          <Button size="md" variant="secondary" disabled>
            <Text variant="secondary">Overview coming soon</Text>
            <ArrowUpRightIcon />
          </Button>
        </div>
      </div>

      <div className="">
        <div className="h-40"></div>
        <img src="/tenets-sunset.svg" className="mx-auto" />
      </div>
    </div>
  )
}

export default JonesTenets
