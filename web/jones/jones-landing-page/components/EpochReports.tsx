import { Button, Text } from '@chakra-ui/react'
import Image from 'next/image'
import React, { RefObject, useState } from 'react'
import { mutationKey } from 'wagmi/dist/declarations/src/hooks/accounts/useConnect'
import { fetchUrl, vaultsConfig } from '../queries'

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

const logoList: Array<string> = ['eth', 'gohm', 'dpx', 'rdpx']

const VaultAutoRollingIndicator = () => (
  <div className="flex h-8 min-w-fit items-center space-x-1 rounded-2xl bg-button-gray p-2 text-jones-gray">
    <Image
      src="/epoch-reports/autoroll.svg"
      width={16}
      height={16}
      alt="Autoroll logo"
    />
    <p className="text-xs">Auto-Rolling</p>
  </div>
)

const getBestAnnualYield = (): number => {
  const vaultsList = Object.keys(vaultsConfig)
  let maxYield =
    // Math.max.apply(Math, Object.values(vaultsConfig[vaultsList[0]].roi)) * 12
    ((1 +
      Math.max.apply(Math, Object.values(vaultsConfig[vaultsList[0]].roi)) /
        100) **
      12 -
      1) *
    100

  for (let i = 1; i < vaultsList.length; i++) {
    let currentRoi =
      // Math.max.apply(Math, Object.values(vaultsConfig[vaultsList[i]].roi)) * 12
      ((1 +
        Math.max.apply(Math, Object.values(vaultsConfig[vaultsList[i]].roi)) /
          100) **
        12 -
        1) *
      100
    if (maxYield < currentRoi) {
      maxYield = currentRoi
    }
  }
  return maxYield
}

function EpochReports() {
  const [vaultsTvl, setVaultsTvl] = useState('Fetching...')

  const bestAnnualYield = getBestAnnualYield()

  try {
    fetchUrl('https://data.jonesdao.io/api/v1/jones/tvl').then((res) =>
      setVaultsTvl(
        res
          ? `$${Math.trunc(res.tvl.vaults).toLocaleString('EN')}`
          : 'Fetching...'
      )
    )
  } catch (err) {
    console.error(err)
    setVaultsTvl('Fetching...')
  }

  return (
    <div>
      <p className="mt-32 text-center text-2xl font-bold">Vault Reports</p>
      <div className="mt-10 grid transform grid-cols-1 rounded-xl bg-card-300 py-10 px-8 lg:grid-cols-2">
        <div>
          <div className="flex justify-center gap-x-3 text-center">
            {logoList.map((logo) => (
              <Image
                src={`/products/${logo}.svg`}
                alt="token-logo"
                width={45}
                height={45}
                key={logo}
              />
            ))}
          </div>
          <div className="mx-auto">
            <img
              className="mx-auto mt-6 justify-center object-cover"
              src={`/epoch-reports/diamond.svg`}
              alt="diamond"
            />
          </div>
        </div>

        <div>
          <div className="mt-16 grid grid-cols-2">
            <div>
              <p className="text-xl font-bold">
                {bestAnnualYield.toFixed(2)}% APY
              </p>
              <p className="text-sm text-gray-500">Best annualized yield</p>
            </div>
            <div className="">
              <p className="text-xl font-bold">{vaultsTvl}</p>
              <p className="text-sm text-gray-500">Vaults TVL</p>
            </div>
          </div>

          <p className="mt-10 text-sm text-gray-500">
            Generate native yield with an actively managed and hedged options
            spread strategy.
          </p>

          <div className="mt-4 flex space-x-2">
            <VaultAutoRollingIndicator />
            <div className="h-8 min-w-fit items-center rounded-2xl bg-button-gray p-2 text-xs text-jones-gray">
              Monthly Epochs
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button size="md" variant="secondary" disabled>
              <Text variant="secondary">Reports coming soon</Text>
              <ArrowUpRightIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EpochReports
