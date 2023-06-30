import { ethers } from 'ethers'
import { useEffect, useState} from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import {
  nftaddress, marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')

  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com")
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, provider)
    const data = await contract.fetchMarketItems()

    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded')
  
  
  }

  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }
  
  if (loadingState === 'loaded' && !nfts.length) 
  return (<h1 className="px-20 py-10 flex justify-center text-3xl text-white">No items in marketplace</h1>)


  return (
    <main>
    <div className="bg-neutral-800 flex justify-center">
     <div className='px-4' style={{maxwidth: '1600px'}}>
      <div className='col-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4'>
        {
          nfts.map((nft, i) => (
            <div key={i} className="border shadow rounded-xl overflow-hidden">
              <img src={nft.image} height="100" width="250"/>
              <div className='p-4'>
                <p style={{height: '64px'}} className='text-2xl text-white font-semibold'>
                  {nft.name}
                </p>
                <div style={{height: '70px', overflow: 'hidden'}}>
                  <p className='text-white'>
                    {nft.description}
                  </p>
                </div>
              </div>
              <div className='p-4 bg-black'>
                <p className='text-2xl mb-4 font-bold text-white'>{nft.price} Matic</p>
                <button className='w-full bg-green-600 text-white font-bold py-2 px-12 rounded' onClick={() => buyNft(nft)}>
                  Buy
                </button>
              </div>
            </div>
          ))
        }
      </div>

     </div>
    </div>
    </main>
  )
}
