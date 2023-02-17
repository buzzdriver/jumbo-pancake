/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/vaults',
        destination: 'https://app.jonesdao.io/vaults',
        permanent: true,
      },
      {
        source: '/staking',
        destination: 'https://app.jonesdao.io/staking',
        permanent: true,
      },
      {
        source: '/farms',
        destination: 'https://app.jonesdao.io/staking',
        permanent: true,
      },
      {
        source: '/sale',
        destination: 'https://app.jonesdao.io/sale',
        permanent: true,
      },
      {
        source: '/airdrop',
        destination: 'https://app.jonesdao.io/airdrop',
        permanent: true,
      },
    ]
  },
}
