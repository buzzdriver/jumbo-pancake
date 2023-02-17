import React from 'react'

const hatCouncil = [
  'tetranode',
  'defigod',
  'redacted',
  'olympus',
  'davidiach',
  'smallcapscience',
  '0xsami',
  'witherblock',
  'revofusion',
]

function HatCouncilMember() {
  return (
    <div>
      <p className="-mt-24 transform text-center text-2xl font-bold">
        Hat Council
      </p>
      <div className="-ml-8 mt-20 grid cursor-pointer grid-cols-2 gap-y-10 sm:ml-0 md:grid-cols-4">
        {/* {hatCouncil.map((hat) => (
          <Image
          id="council-member"
            src={`/hat-council/${hat}.svg`}
            alt="council-member"
            width="232.5px"
            height="163.39px"
            key={hat}
          />
        ))} */}
        <div
          className="transform cursor-pointer"
          id="tetranode"
          onClick={() => window.open('https://twitter.com/Tetranode', '_blank')}
        />
        <div
          className="transform cursor-pointer"
          id="defigod"
          onClick={() => window.open('https://twitter.com/DeFifrog1', '_blank')}
        />
        <div
          className="transform cursor-pointer"
          id="redacted"
          onClick={() =>
            window.open('https://twitter.com/redactedcartel', '_blank')
          }
        />
        <div
          className="transform cursor-pointer"
          id="olympus"
          onClick={() =>
            window.open('https://twitter.com/OlympusDAO', '_blank')
          }
        />
        <div
          className="transform cursor-pointer"
          id="davidiach"
          onClick={() => window.open('https://twitter.com/davidiach', '_blank')}
        />
        <div
          className="transform cursor-pointer"
          id="smallcapscience"
          onClick={() =>
            window.open('https://twitter.com/SmallCapScience', '_blank')
          }
        />
        <div
          className="transform cursor-pointer"
          id="sami"
          onClick={() => window.open('https://twitter.com/0xSami_', '_blank')}
        />
        <div
          className="transform cursor-pointer"
          id="witherblock"
          onClick={() =>
            window.open('https://twitter.com/witherblock', '_blank')
          }
        />
        <div
          className="transform cursor-pointer"
          id="revofusion"
          onClick={() =>
            window.open('https://twitter.com/revofusion', '_blank')
          }
        />
      </div>
      {/* <img src='/hat-council/tetranode.svg' onmouseover="this.src='/hat-council/tetranode-hover.svg';" onmouseout="this.src='/hat-council/tetranode.svg';" /> */}
    </div>
  )
}

export default HatCouncilMember
