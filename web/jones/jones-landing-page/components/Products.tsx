import { ethers } from 'ethers'
import Image from 'next/image'
import React, { useState } from 'react'
import { BiInfoCircle } from 'react-icons/bi'
import { useContractRead } from 'wagmi'

import { Box, Button, Center, Text, Tooltip } from '@chakra-ui/react'

import { ABI_MAPPING } from '../contract_abi'
import { fetchUrl, getTokenPriceUsd, vaultsConfig } from '../queries'

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
    className="inline-block ml-2 align-baseline"
    width={width ?? 12}
    height={height ?? 12}
    viewBox="0 0 12 12"
    fill={fill || '#7163BB'}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.1204 9.79817C11.6544 9.79817 12 9.40498 12 8.83879V0.990826C12 0.29882 11.623 0 11.0105 0H3.14136C2.56021 0 2.19895 0.346003 2.19895 0.880734C2.19895 1.41547 2.57592 1.7772 3.15707 1.7772H6.94241L9.21989 1.61992L7.09948 3.6173L0.298429 10.4273C0.125654 10.6003 0 10.8362 0 11.0878C0 11.6383 0.361257 12 0.910995 12C1.20942 12 1.42932 11.8742 1.60209 11.7012L8.38743 4.92267L10.3665 2.8152L10.2094 5.3945V8.85452C10.2094 9.43644 10.5707 9.79817 11.1204 9.79817Z" />
  </svg>
)

const calculateVaultApy = (token: string): number => {
  const roiList = Object.values(vaultsConfig[token].roi)
  const avgRoi = roiList.reduce((a, b) => a + b) / roiList.length / 100
  return ((1 + avgRoi) ** 12 - 1) * 100
}

interface VaultsProps {
  icon: string
  name: string
  apy: string
  apr: string
  contract_address: string
  api_id: string
}

const VaultsList: Array<VaultsProps> = [
  {
    icon: 'eth',
    name: 'ETH',
    apy: String(calculateVaultApy('ETH').toFixed(2)),
    apr: String(
      // ((1 + avgRoi) ** 12 - 1) * 100
      (
        ((1 +
          Math.max.apply(Math, Object.values(vaultsConfig['ETH'].roi)) / 100) **
          12 -
          1) *
        100
      ).toFixed(2)
    ),
    contract_address: '0xF46Ce0C13577232D5F29D9Bd78a9Cab278755346',
    api_id: 'ethereum',
  },
  {
    icon: 'gohm',
    name: 'gOHM',
    apy: String(calculateVaultApy('GOHM').toFixed(2)),
    apr: String(
      (
        ((1 +
          Math.max.apply(Math, Object.values(vaultsConfig['GOHM'].roi)) /
            100) **
          12 -
          1) *
        100
      ).toFixed(2)
    ),
    contract_address: '0x8883E5bb2920bBE766A2c9e86ad9aA45a573f3F5',
    api_id: 'governance-ohm',
  },
  {
    icon: 'dpx',
    name: 'DPX',
    apy: String(calculateVaultApy('DPX').toFixed(2)),
    apr: String(
      (
        ((1 +
          Math.max.apply(Math, Object.values(vaultsConfig['DPX'].roi)) / 100) **
          12 -
          1) *
        100
      ).toFixed(2)
    ),
    contract_address: '0x5BA98Ad75AB87eB90fFc2b680bCfC6b9030E1246',
    api_id: 'dopex',
  },
  {
    icon: 'rdpx',
    name: 'rDPX',
    apy: String(calculateVaultApy('RDPX').toFixed(2)),
    apr: String(
      (
        ((1 +
          Math.max.apply(Math, Object.values(vaultsConfig['RDPX'].roi)) /
            100) **
          12 -
          1) *
        100
      ).toFixed(2)
    ),
    contract_address: '0x42448fDDCec02124cf6dB19a9f91Dea7bB0e88e5',
    api_id: 'dopex-rebate-token',
  },
]

const VaultCard = (props: VaultsProps) => {
  const [tvl, setTvl] = useState(0)
  const vaultName = props.name
  const ABI = ABI_MAPPING[vaultName as keyof object]
  const totalAssets = useContractRead(
    {
      addressOrName: props.contract_address,
      contractInterface: ABI,
    },
    'totalAssets',
    {
      chainId: 42161,
    }
  )

  try {
    getTokenPriceUsd(`${props.api_id}`).then((res) =>
      setTvl(
        res *
          Number(
            ethers.utils.formatEther(totalAssets.data ? totalAssets.data : 0)
          )
      )
    )
  } catch (err) {
    console.error(err)
    setTvl(0)
  }

  return (
    <div
      className="grid items-center w-full grid-cols-2 px-6 duration-300 ease-in cursor-pointer rounded-2xl bg-jones-slate hover:bg-gray-hover sm:grid-cols-4"
      onClick={() => window.open('https://app.jonesdao.io/vaults', '_blank')}
    >
      <div className="flex items-center space-x-4 sm:ml-10">
        <Image
          src={`/products/${props.icon}.svg`}
          alt="token-logo"
          width={42}
          height={42}
        />
        <p className="text-lg font-semibold transform">{props.name}</p>
      </div>
      <div className="py-8 -ml-10 text-center">
        <Center>
          <p className="font-bold transform">{props.apy}% APY</p>
          <Tooltip
            label="Average historical annualized return is calculated by annualizing the average of the vault's monthly yields since inception. This is an indicator of previous performance, and is not a guarantee of future returns."
            rounded="xl"
            p="4"
            bg="gray.800"
            textColor="white"
          >
            <Box ml={1}>
              <BiInfoCircle />
            </Box>
          </Tooltip>
        </Center>
        <p className="text-xs text-gray-200 transform">Avg. Historical Yield</p>
      </div>
      <div className="py-8 text-center -ml-14">
        <p className="font-bold transform">{props.apr}% APY</p>

        <p className="text-xs text-gray-200 transform">Best Annualized Epoch</p>
      </div>
      <div className="flex items-center ml-6">
        <div className="py-8 text-center">
          <p
            className={`transform font-bold ${tvl > 0 ? '' : 'animate-pulse'} `}
          >
            {tvl > 0 ? `$ ${(tvl / 1000000).toFixed(2)} M` : 'Fetching...'}
          </p>
          <p className="text-xs text-gray-200 transform">TVL</p>
        </div>
        <div className="ml-6 md:ml-18 lg:ml-24">
          <Image
            src={`/icon/arrow-right.svg`}
            alt="arrow"
            width={12}
            height={12}
          />
        </div>
      </div>
      <div></div>
    </div>
  )
}

interface StakeProps {
  icon: string
  name: string
  apr: string
  pool: Number
  api_id: string
}

const StakeList: Array<StakeProps> = [
  {
    icon: 'jdpx-dpx',
    name: 'jDPX-DPX',
    apr: '-',
    pool: 4,
    api_id: 'dopex',
  },
  {
    icon: 'jrdpx-rdpx',
    name: 'jrDPX-rDPX',
    apr: '-',
    pool: 5,
    api_id: 'dopex-rebate-token',
  },
  {
    icon: 'jeth-eth',
    name: 'jETH-ETH',
    apr: '-',
    pool: 2,
    api_id: 'ethereum',
  },
  {
    icon: 'jgohm-gohm',
    name: 'jgOHM-gOHM',
    apr: '-',
    pool: 3,
    api_id: 'governance-ohm',
  },
]

const StakeCard = (props: StakeProps) => {
  const [tvl, setTvl] = useState(0)
  const [apr, setApr] = useState(0)

  try {
    fetchUrl('https://data.jonesdao.io/api/v1/jones/farms/general').then(
      ({ farms }) => {
        const farm = farms.find(
          ({ farmName }: { farmName: string }) =>
            farmName.toLowerCase() === props.name.toLowerCase()
        )
        setApr(farm?.apr ?? 0)
        setTvl(farm?.totalStakedValue ?? 0)
      }
    )
  } catch (err) {
    console.error(err)
    setTvl(0)
    setApr(0)
  }
  return (
    <div
      className="grid items-center w-full grid-cols-2 px-6 duration-300 ease-in cursor-pointer rounded-2xl bg-jones-slate hover:bg-gray-hover sm:grid-cols-3"
      onClick={() => window.open('https://app.jonesdao.io/staking', '_blank')}
    >
      <div className="flex items-center ml-4 space-x-4 sm:ml-10">
        <Image
          src={`/products/${props.icon}.svg`}
          alt="token-logo"
          width={80}
          height={80}
        />
        <p className="text-lg font-semibold transform">{props.name}</p>
      </div>
      <div className="py-8 ml-20 text-center">
        <p className={`transform font-bold ${apr > 0 ? '' : 'animate-pulse'} `}>
          {apr > 0 ? `${apr.toFixed(2)}%` : 'Fetching...'}
        </p>
        <p className="text-xs text-gray-200 transform">APR</p>
      </div>
      <div className="flex items-center w-full ml-12">
        <div className="py-8 text-center">
          <p
            className={`transform font-bold ${tvl > 0 ? '' : 'animate-pulse'} `}
          >
            {tvl > 0 ? `$ ${(tvl / 1000000).toFixed(2)} M` : 'Fetching...'}
          </p>
          <p className="text-xs text-gray-200 transform">TVL</p>
        </div>
        <div className="ml-10 sm:ml-36">
          <Image
            src={`/icon/arrow-right.svg`}
            alt="arrow"
            width={12}
            height={12}
          />
        </div>
      </div>
      <div></div>
    </div>
  )
}

function Products() {
  const [product, setProduct] = useState('Vaults')

  return (
    <div>
      <p className="mt-32 text-2xl font-bold text-center">Products</p>

      <div className="flex justify-center mt-5 space-x-10 text-center text-gray-500">
        <h1
          className={`transform cursor-pointer pb-2 text-lg ${
            product === 'Vaults'
              ? 'rounded-[1px] border-b-4 border-white px-2 text-white'
              : ''
          }`}
          onClick={() => setProduct('Vaults')}
        >
          Vaults
        </h1>
        <p
          className={`cursor-pointer pb-2 text-lg ${
            product === 'Staking'
              ? 'rounded-[1px] border-b-4 border-white  px-2 text-white'
              : ''
          }`}
          onClick={() => setProduct('Staking')}
        >
          Staking
        </p>
        <p
          className={`cursor-pointer pb-2 text-lg ${
            product === 'Vejones'
              ? 'rounded-[1px] border-b-4 border-white  px-2 text-white'
              : ''
          }`}
          onClick={() => setProduct('Vejones')}
        >
          veJONES
        </p>
      </div>

      <div className="mt-10 space-y-3">
        {product === 'Vaults' &&
          VaultsList.map((v) => (
            <VaultCard
              icon={v.icon}
              name={v.name}
              apy={v.apy}
              apr={v.apr}
              contract_address={v.contract_address}
              api_id={v.api_id}
              key={v.name}
            />
          ))}
        {product === 'Staking' &&
          StakeList.map((s) => (
            <StakeCard
              icon={s.icon}
              name={s.name}
              apr={s.apr}
              pool={s.pool}
              api_id={s.api_id}
              key={s.name}
            />
          ))}
        {product === 'Vejones' && (
          <div className="flex items-center justify-center space-x-5 animate-pulse">
            <Image
              className="animate-spin"
              src={`/products/jones.svg`}
              alt="token-logo"
              width={42}
              height={42}
            />
            <p className="text-lg transform ">Coming soon jonioneenis</p>
          </div>
        )}
      </div>

      {product !== 'Vejones' && (
        <div className="flex justify-end mt-8">
          <Button
            size="md"
            variant="secondary"
            onClick={() =>
              window.open(
                `${
                  product === 'Vaults'
                    ? 'https://app.jonesdao.io/vaults'
                    : 'https://app.jonesdao.io/staking'
                }`,
                '_blank'
              )
            }
          >
            <Text variant="secondary">View All</Text>
            <ArrowUpRightIcon />
          </Button>
        </div>
      )}
    </div>
  )
}

export default Products
