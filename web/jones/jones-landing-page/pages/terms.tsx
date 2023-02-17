import { useRouter } from 'next/router'
import React from 'react'
import Header from '../components/Header'
import Layout from '../components/Layout'

function terms() {
  const router = useRouter()
  return (
    <div
      className="relative overflow-hidden font-body text-white"
      style={{
        background:
          'radial-gradient(179.65% 114.2% at 50% 42.64%, #000000 0%, #0F1314 100%',
      }}
    >
      <Header isMainPage={false} />
      <Layout hideSideOrbs={true}>
        <p
          className="text-md mt-10 transform cursor-pointer text-gray-200"
          onClick={() => router.push('/')}
        >
          Back
        </p>
        <div>
          <p className="mt-10 transform text-4xl font-semibold">
            Terms of Service
          </p>
          <div className="mt-10 rounded-lg bg-jones-slate bg-opacity-50 p-12 text-gray-200">
            <p className="transform">
              All APYs listed on this site are for guidance purposes only.
              JonesDAO employs strategies across a broad range of markets. The
              available liquidity in said markets changes constantly. As a
              result, JonesDAO cannot calculate APYs in real time. Users
              acknowledge this and also acknowledge the risk of negative returns
              on their deposited funds during certain time periods. By
              depositing funds in JonesDAO’s vaults, the user assumes any
              associated risk of loss.
            </p>
            <br />
            <p className="transform font-bold">
              Risk of loss of funds when using our products
            </p>
            <br />
            <p className="transform">
              Our products are a smart contracts based suite of technologies
              that relies on blockchain technology. By depositing your funds
              into our vaults you recognize and assume all risks inherent in
              such technologies, including but not limited to the risk that the
              smart contracts underlying our vaults could fail, resulting in a
              total loss of user funds. JonesDAO is not responsible for any such
              losses.
            </p>
            <br />
            <p className="transform font-bold">
              Any other parts of the UI that might not work well legally
            </p>
            <br />
            <p className="transform">
              JonesDAO is a decentralized finance project and does not hold any
              securities licenses in the U.S. or any other jurisdiction. Any
              investment made through our protocol shall be made with this in
              mind.
            </p>
            <br />
            <p className="transform">
              Furthermore, by accepting these terms you acknowledge and warrant
              that you are not a citizen of or otherwise accessing the website
              from the following nations: the Balkans, Belarus, Burma, China,
              Cote D'Ivoire (Ivory Coast), Cuba, Democratic Republic of Congo,
              Hong Kong, Iran, Iraq, Liberia, North Korea, Sudan, Syria,
              Zimbabwe, and/or any other jurisdiction prohibited by the United
              States Office of Foreign Asset Control (OFAC).
            </p>
            <br />
            <p className="transform">Version 1.0 </p>
            <p className="transform">Last updated 18 May 2022 </p>
          </div>
        </div>
      </Layout>
    </div>
  )
}

export default terms
