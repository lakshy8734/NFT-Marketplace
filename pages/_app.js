import '../styles/globals.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    
    <div style={{minHeight: '100vh' }}className='bg-neutral-800'>
      <nav className='border-b p-6'>
        <div>
        <p className='text-4xl font-bold text-white'>NFTStore</p>
        </div>
        <div className='flex justify-between mt-4'>
          <Link href="/">
            <a className="text-xl mr-6 text-red-500">
              Home
            </a>
          </Link>
          <Link href="/create-item">
            <a className='text-xl mr-6 text-red-500'>
              Sell NFTs
            </a>
          </Link>
          <Link href="/my-assets">
            <a className='text-xl mr-6 text-red-500'>
              My NFTs
            </a>
          </Link>
          <Link href="/dashboard">
            <a className='text-xl mr-6 text-red-500'>
              Creator Dashboard
            </a>
          </Link>
        </div>

      </nav>
      <Component {...pageProps} />
  </div>
  
  )
}

export default MyApp
