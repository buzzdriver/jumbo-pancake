import React from 'react'
import { BsArrowUpRight } from 'react-icons/bs'
function AnnouncementBanner() {
  return (
    <div className="grid grid-cols-1 items-center justify-center gap-x-8 gap-y-2 bg-alert-300 p-4  text-center text-sm text-white sm:flex">
      <p className="font-bold">Announcement</p>
      <p className="">
        Staking contracts are migrated. Please unstake and restake your assets
        on dapp starting May 6th 12:30 UTC.
      </p>
      <p
        className="flex cursor-pointer items-center justify-center underline"
        onClick={() =>
          window.open(
            'https://jonesdao.ghost.io/upgrading-our-farms/',
            '_blank'
          )
        }
      >
        Learn more <BsArrowUpRight className="ml-1" />
      </p>
    </div>
  )
}

export default AnnouncementBanner
