import { Metaverse } from './metaverse'
import { ENV } from '../../constants'

export const Latest = () => {
  return <Metaverse tab='Latest' />
}

export const Popular = () => {
  return <Metaverse tab='Popular' />
}

export const Featured = () => {
  return <Metaverse tab='Featured' />
}

// export const Random = () => {
//   return <Feeds tab={2} />
// }

export const Bundle = () => {
  return <Metaverse tab='BundleList' />
}

export const Auction = () => {
  return <Metaverse tab='AuctionList' />
}

export const Curation = () => {
  return <Metaverse tab='Curation' />
}

export const Home = () => {
  if (ENV === "test")
    return <Metaverse tab='Latest' />
  else
    return <Metaverse tab='Metaverse' />
}

