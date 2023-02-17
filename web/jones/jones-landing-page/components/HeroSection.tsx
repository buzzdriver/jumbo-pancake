import { Button, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { fetchUrl, getTokenPriceUsd } from '../queries'

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
    fill={fill || '#B05931'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.1204 9.79817C11.6544 9.79817 12 9.40498 12 8.83879V0.990826C12 0.29882 11.623 0 11.0105 0H3.14136C2.56021 0 2.19895 0.346003 2.19895 0.880734C2.19895 1.41547 2.57592 1.7772 3.15707 1.7772H6.94241L9.21989 1.61992L7.09948 3.6173L0.298429 10.4273C0.125654 10.6003 0 10.8362 0 11.0878C0 11.6383 0.361257 12 0.910995 12C1.20942 12 1.42932 11.8742 1.60209 11.7012L8.38743 4.92267L10.3665 2.8152L10.2094 5.3945V8.85452C10.2094 9.43644 10.5707 9.79817 11.1204 9.79817Z" />
  </svg>
)

interface CardListProps {
  value: string
  type: string
}

const CardList: Array<CardListProps> = [
  { value: '4', type: 'Number of jAssets' },
  { value: '1', type: 'Chain' },
]

const FloatCard = (props: CardListProps) => {
  return (
    <div className="transform rounded-xl bg-jones-slate bg-opacity-50 p-4 text-center hover:bg-gray-hover hover:bg-opacity-100">
      <p className="transform text-lg text-[#ffffff]">{props.value}</p>
      <p className="transform text-base font-light text-[#c4c4c4]">
        {props.type}
      </p>
    </div>
  )
}

function HeroSection() {
  const [jonesPrice, setJonesPrice] = useState('Fetching...')
  const [tvl, setTvl] = useState('Fetching...')

  try {
    getTokenPriceUsd('jones-dao').then((res) =>
      setJonesPrice(`$ ${res.toFixed(2)}`)
    )
    fetchUrl('https://data.jonesdao.io/api/v1/jones/tvl').then((res) =>
      setTvl(
        res
          ? `$${Math.trunc(res.tvl.total).toLocaleString('EN')}`
          : 'Fetching...'
      )
    )
  } catch (err) {
    console.error(err)
    setJonesPrice('Fetching...')
    setTvl('Fetching...')
  }

  return (
    <div>
      <img
        className="pointer-events-none absolute -top-20 animate-fog-animation opacity-80"
        src="/hero-mist.png"
        alt="mist"
      />

      {/* Fog V2 */}
      {/* <div id="foglayer_01" className="fog">
        <div className="image01"></div>
        <div className="image02"></div>
      </div>
      <div id="foglayer_02" className="fog">
        <div className="image01"></div>
        <div className="image02"></div>
      </div>
      <div id="foglayer_03" className="fog">
        <div className="image01"></div>
        <div className="image02"></div>
      </div> */}

      <img
        className="absolute top-10 right-0 z-20 hidden animate-pulse object-cover md:flex"
        src="/hero-sunset.svg"
        alt="sunset"
      />
      <div className="mt-24">
        <p className="transform text-4xl font-bold">
          Auto-Pilot <br /> Options Strategies
        </p>
        <p className="mt-8 transform font-light">
          One-click vaults that enable institutional-grade options strategies.
          <br />
          Unlock liquidity and capital efficiency for DeFi options with
          vault-backed jAssets.
        </p>
      </div>

      <div className="mt-6 flex space-x-3">
        <Button
          size="md"
          variant="primary"
          onClick={() => window.open('https://app.jonesdao.io', '_blank')}
        >
          Launch App
        </Button>
        <Button
          size="md"
          variant="secondary"
          onClick={() =>
            window.open('https://docs.jonesdao.io/jones-dao', '_blank')
          }
        >
          <Text variant="secondary">Learn more</Text>
          <ArrowUpRightIcon />
        </Button>
        {/* <button
          className="rounded-xl bg-gradient-to-br from-purple-500 to-primary-700 py-3 px-4 text-sm font-semibold text-black hover:animate-pulse"
          onClick={() => window.open('https://app.jonesdao.io', '_blank')}
        >
          Launch App
        </button>
        <div className="btn-gradient-border-purple-orange hover:animate-pulse">
          <div className="btn-gradient-bg">
            <button
              className="btn-gradient-text-purple-orange flex items-center rounded-xl p-3 text-sm font-semibold"
              onClick={() =>
                window.open('https://docs.jonesdao.io/jones-dao', '_blank')
              }
            >
              Learn more <ArrowUpRightIcon />
            </button>
          </div>
        </div> */}
      </div>

      <div className="mt-24 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-4">
        <div className="transform rounded-xl bg-jones-slate bg-opacity-50 p-4 text-center hover:bg-gray-hover hover:bg-opacity-100">
          <p className="transform text-lg text-[#ffffff]">{jonesPrice}</p>
          <p className="transform font-light text-[#c4c4c4]">JONES price</p>
        </div>
        <div className="transform rounded-xl bg-jones-slate bg-opacity-50 p-4 text-center hover:bg-gray-hover hover:bg-opacity-100">
          <p
            className={`transform text-lg text-[#ffffff] ${
              tvl === 'Fetching...' ? 'animate-pulse' : ''
            } `}
          >
            {tvl}
          </p>
          <p className="transform font-light text-[#c4c4c4]">
            Total Locked Value
          </p>
        </div>
        {CardList.map((card) => (
          <FloatCard value={card.value} type={card.type} key={card.value} />
        ))}
      </div>
    </div>
  )
}

export default HeroSection
