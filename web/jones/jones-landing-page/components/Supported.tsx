import Image from 'next/image'
import React from 'react'

const logoList: Array<string> = ['jones', 'eth', 'gohm', 'dpx', 'rdpx']
const networkList: Array<string> = ['arbitrum', 'avalanche']

function Supported() {
  return (
    <div className="mt-32 grid grid-cols-1 gap-y-10 md:grid-cols-2">
      <div>
        <p className="text-2xl font-bold">Supported assets</p>
        <div className="mt-9 flex gap-x-6">
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
      </div>
      <div>
        <p className="text-2xl font-bold">Supported networks</p>
        <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-3">
          {networkList.map((network) => (
            <img
              src={`/supported/${network}.svg`}
              alt="network-logo"
              key={network}
            />
          ))}
          <img
            className="brightness-50"
            src={`/supported/polygon.svg`}
            alt="network-logo"
          />
        </div>
      </div>
    </div>
  )
}

export default Supported
