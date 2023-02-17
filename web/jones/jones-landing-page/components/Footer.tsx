import { useRouter } from 'next/router'
import React from 'react'

export interface ExternalLink {
  site: string
  link: string
}

const footerLinks: ExternalLink[] = [
  {
    site: 'Gitbook',
    link: 'https://docs.jonesdao.io/jones-dao/',
  },
  {
    site: 'Discord',
    link: 'https://discord.com/invite/jonesdao',
  },
  {
    site: 'Twitter',
    link: 'https://twitter.com/DAOJonesOptions',
  },
  {
    site: 'Blog',
    link: 'https://jonesdao.ghost.io/',
  },
]

function Footer() {
  const router = useRouter()
  return (
    <div className="mt-10 flex items-center justify-between p-8 text-gray-500">
      <div className="transform space-x-2 sm:space-x-6">
        {footerLinks.map((link) => (
          <a
            href={link.link}
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer text-sm hover:text-jones-orange"
            key={link.site}
          >
            {link.site}
          </a>
        ))}
      </div>
      <p
        className="cursor-pointer text-sm text-gray-500 hover:text-jones-orange sm:right-80"
        onClick={() => router.push('/terms')}
      >
        Terms
      </p>
    </div>
  )
}

export default Footer
