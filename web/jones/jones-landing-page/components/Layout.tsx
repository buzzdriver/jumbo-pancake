import Head from 'next/head'
import React from 'react'
import Footer from './Footer'
const Layout: React.FC<{ hideSideOrbs: boolean }> = ({
  hideSideOrbs,
  children,
}) => {
  return (
    <div
      className="relative mt-16 min-h-screen min-w-fit overflow-hidden"
      style={{
        background:
          'radial-gradient(179.65% 114.2% at 50% 42.64%, #000000 0%, #0F1314 100%',
      }}
    >
      <Head>
        <title>Jones DAO</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta property="og:title" content="Jones DAO" />
        <meta property="og:type" content="article" />
        <meta
          property="og:image"
          content="https://app.jonesdao.io/logo/jones-preview.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="og:description"
          content="Yield, strategy and liquidity protocol for DeFi options."
        />
        <meta property="og:site_name" content="Jones DAO" />
        <meta name="twitter:image:alt" content="Jones DAO" />
        <meta name="twitter:site" content="@DAOJonesOptions" />
      </Head>
      {/** Ellipse 772 orange */}
      <div
        className="pointer-events-none absolute -left-[70%] top-0 h-[2304px] w-[2016px] opacity-25"
        style={{
          background:
            'radial-gradient(41.29% 41.29% at 50% 51.77%, #CA5E32 15.1%, rgba(255, 131, 32, 0) 94.73%)',
        }}
      />
      {/* Ellipse gray */}
      <div
        className="pointer-events-none absolute -left-[57%] -top-[30%] h-[2304px] w-[2016px] opacity-30"
        style={{
          background:
            'radial-gradient(46.13% 46.13% at 50% 51.77%, #3E4344 16.66%, rgba(53, 123, 142, 0) 97.39%)',
        }}
      />

      {/** Ellipse 775 purple */}
      <div
        className="pointer-events-none absolute -left-[57%] -top-[30%] h-[2304px] w-[2016px] opacity-30"
        style={{
          background:
            'radial-gradient(46.13% 46.13% at 50% 51.77%, #935176 16.66%, rgba(98, 59, 81, 0) 97.39%)',
        }}
      />
      {/** Ellipse 774 blue */}
      <div
        className="pointer-events-none absolute -left-[62%] -top-[60%] h-[2304px] w-[2016px] opacity-40"
        style={{
          background:
            'radial-gradient(46.13% 46.13% at 50% 51.77%, #2A2866 16.66%, #0A0B3C 45.31%, rgba(10, 11, 60, 0) 95.83%)',
        }}
      />

      {/* Right purple and orange */}
      {!hideSideOrbs && (
        <div
          className="pointer-events-none absolute top-[2%] left-[60%] h-[800px] w-[780px] opacity-40"
          style={{
            background:
              'radial-gradient(46.13% 46.13% at 50% 51.77%, #935176 16.66%, rgba(98, 59, 81, 0) 97.39%)',
          }}
        />
      )}
      {!hideSideOrbs && (
        <div
          className="pointer-events-none absolute top-[6%] left-[65%] h-[750px] w-[950px] opacity-20"
          style={{
            background:
              'radial-gradient(41.29% 41.29% at 50% 51.77%, #CA5E32 15.1%, rgba(255, 131, 32, 0) 94.73%)',
          }}
        />
      )}

      {/* Bottom orange and purple */}
      <div
        className="pointer-events-none absolute -left-[70%] top-[40%] h-[1800px] w-[2200px] opacity-20"
        style={{
          background:
            'radial-gradient(41.29% 41.29% at 50% 51.77%, #CA5E32 15.1%, rgba(255, 131, 32, 0) 94.73%)',
        }}
      />
      <div
        className="pointer-events-none absolute -left-[70%] top-[55%] h-[1800px] w-[2200px] opacity-30"
        style={{
          background:
            'radial-gradient(46.13% 46.13% at 50% 51.77%, #935176 16.66%, rgba(98, 59, 81, 0) 97.39%)',
        }}
      />

      <>
        {/* <DesktopNav toggleMobileMenu={toggleMobileMenu} navLinks={navLinks} /> */}

        <div className="mx-auto max-w-6xl px-6 py-2 sm:px-8">
          {children}
          <Footer />
        </div>
      </>
    </div>
  )
}

export default Layout
