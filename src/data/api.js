// import { WalletPostMessageTransport } from '@airgap/beacon-sdk'
import { SanitiseAkaObj } from '../utils/sanitise'
import { getItem, setItem } from '../utils/storage'
import {
  setLanguage,
  // setNews,
  setNotifications,
  setCurationList,
  setAbout,
  setAkaObjBlockList,
  getAkaObjBlockList,
  setWalletBlockList,
  getWalletBlockList,
  setBanBlockList,
  setGachaWhiteList,
  setGachaClosedList,
  CLOUDFLARE_GATEWAY,
  INFURA_GATEWAY,
  DWEB_GATEWAY,
  MY_PINATA_GATEWAY,
  DEFAULT_IPFS_GATEWAY,
  USE_DEFAULT_IPFS_GATEWAY,
} from '../constants'

const axios = require('axios')

/**
 * This loads the initial data (language.json, o.json, w.json, b.json)
 */
export const getInitialData = () => {
  const language = getItem('language') || setItem('language', 'en')

  return Promise.all([
    axios.get(`${process.env.REACT_APP_LANGUAGE_ROOT}/${language}.json`), // loads language file
    axios.get(process.env.REACT_APP_BLOCKLIST_AKAOBJ), // loads blocked akaObj
    axios.get(process.env.REACT_APP_BLOCKLIST_WALLET), // loads blocked wallets
    axios.get(process.env.REACT_APP_BLOCKLIST_BURN), // blocked wallets (dont allow to visualise in /tz/walletid)
    axios.get(process.env.REACT_APP_GACHA_WHITELIST), // gacha_stage1_whitelist
    axios.get(process.env.REACT_APP_GACHA_CLOSEDLIST),
    // axios.get(`/news/news.json`), // loads news
    axios.get(process.env.REACT_APP_NOTIFICATION), // loads news
    axios.get(`${process.env.REACT_APP_ABOUT_ROOT}/new/${language}.json`),
    axios.get(process.env.REACT_APP_CURATION_LIST),
    // axios.get(process.env.REACT_APP_FEATUREDLIST_WALLET)
  ]).then((results) => {
    setLanguage(results[0].data)
    setAkaObjBlockList(results[1].data)
    setWalletBlockList(results[2].data)
    setBanBlockList(results[3].data)
    // setAkaObjBlockList([])
    // setWalletBlockList([])
    // setBanBlockList([])
    // setNews(results[4].data)
    setGachaWhiteList(results[4].data)
    setGachaClosedList(results[5].data)
    setNotifications(results[6].data)
    setAbout(results[7].data)
    setCurationList(results[8].data)
    return true
  })
}

// filter all feeds to remove akaObj and wallets that are blocked.
// DO NOT CHANGE! (Andre)
const filterFeeds = (original) => {
  const oblock = getAkaObjBlockList()
  const wblock = getWalletBlockList()
  const filtered = SanitiseAkaObj(original)
    // filters akaObj's out if they are flagged
    .filter((i) => !oblock.includes(i.tokenId))
    // filter akaObj's out if they're from flagged wallets
    .filter((i) => !wblock.includes(i.tokenInfo.creators[0]))
  return filtered
}

/**
 * Gets Feed for homepage
 * filters it against a blocklist json
 */
export const GetLatestFeed = async ({ counter }) => {
  return new Promise((resolve, reject) => {
    axios.get(process.env.REACT_APP_AKAOBJS, {
      params: { counter: counter }
    })
      .then((res) => {
        resolve({ feed: filterFeeds(res.data.tokens), hasMore: res.data.hasMore })
      })
      .catch((e) => reject(e)) // TODO: send error message to context. have an error component to display the error
  })
}

/**
 * Get Featured Feed
 */
export const GetFeaturedFeed = async ({ counter }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(process.env.REACT_APP_AKAOBJS, {
        params: { counter: counter, size: 30, random: true, featured: true }
      })
      .then((res) => {
        resolve({ feed: filterFeeds(res.data.tokens), hasMore: res.data.hasMore })
      })
      .catch((e) => reject(e)) // TODO: send error message to context. have an error component to display the error
  })
}

/**
 * Get akaOBJ detail page
 */
export const GetAkaObj = async ({ id }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${process.env.REACT_APP_AKAOBJS}/${id}`)
      .then((res) => {
        resolve(res.data)
      })
      .catch((e) => reject(e)) // TODO: send error message to context. have an error component to display the error
  })
}

/**
 * Get akaOBJ detail page
 */
export const GetAkaObjRecords = async ({ id }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${process.env.REACT_APP_AKAOBJS}/${id}/records`)
      .then((res) => {
        resolve(res.data)
      })
      .catch((e) => reject(e)) // TODO: send error message to context. have an error component to display the error
  })
}

/**
 * Get akaOBJ of same tag
 */
export const GetTag = async ({ tag, counter }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(process.env.REACT_APP_AKAOBJS, {
        params: { tag, counter, size: 30 },
      })
      .then((res) => {
        resolve({ feed: res.data.tokens, hasMore: res.data.hasMore })
      })
      .catch((e) => reject(e)) // TODO: send error message to context. have an error component to display the error
  })
}

/**
 * Get tag list
 */
export const GetTagList = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get(process.env.REACT_APP_TAGS)
      .then((res) => {
        resolve(res.data)
      })
      .catch((e) => reject(e)) // TODO: send error message to context. have an error component to display the error
  })
}

/**
 * Get Gachas
 */
export const GetGachaList = async ({ counter }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(process.env.REACT_APP_GACHAS, {
        params: { counter },
      })
      .then((res) => {
        resolve({ feed: res.data.gachas, hasMore: res.data.hasMore })
      })
      .catch((e) => reject(e)) // TODO: send error message to context. have an error component to display the error
  })
}

/**
 * Get Gacha detail page
 */
export const GetGacha = async ({ id }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${process.env.REACT_APP_GACHAS}/${id}`)
      .then((res) => {
        resolve(res.data)
      })
      .catch((e) => reject(e)) // TODO: send error message to context. have an error component to display the error
  })
}

/**
 * Get Gacha detail page
 */
export const GetGachaRecords = async ({ id }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${process.env.REACT_APP_GACHAS}/${id}/records`)
      .then((res) => {
        resolve(res.data)
      })
      .catch((e) => reject(e)) // TODO: send error message to context. have an error component to display the error
  })
}

/**
 * Get Bundles
 */
export const GetBundleList = async ({ counter }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(process.env.REACT_APP_BUNDLES, {
        params: { counter, size: 9 },
      })
      .then((res) => {
        resolve({ feed: res.data.bundles, hasMore: res.data.hasMore })
      })
      .catch((e) => reject(e)) // TODO: send error message to context. have an error component to display the error
  })
}

/**
 * Get Bundle detail page
 */
export const GetBundle = async ({ id }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${process.env.REACT_APP_BUNDLES}/${id}`)
      .then((res) => {
        resolve(res.data.bundle)
      })
      .catch((e) => reject(e)) // TODO: send error message to context. have an error component to display the error
  })
}

/**
 * Get Auctions
 */
export const GetAuctionList = async ({ counter }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(process.env.REACT_APP_AUCTIONS, {
        params: { counter, days: 21 },
      })
      .then((res) => {
        resolve({ feed: res.data.auctions, hasMore: res.data.hasMore })
      })
      .catch((e) => reject(e)) // TODO: send error message to context. have an error component to display the error
  })
}

/**
 * Get Auction detail page
 */
export const GetAuction = async ({ id }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${process.env.REACT_APP_AUCTIONS}/${id}`)
      .then((res) => {
        resolve(res.data.auction)
      })
      .catch((e) => reject(e)) // TODO: send error message to context. have an error component to display the error
  })
}

/**
 * Get Curation
 */
export const GetCuration = async ({ name }) => {
  return new Promise((resolve, reject) => {
    axios
      .get(process.env.REACT_APP_AKAOBJS, {
        params: { curation: name },
      })
      .then((res) => {
        resolve({ feed: res.data.tokens })
      })
      .catch((e) => reject(e)) // TODO: send error message to context. have an error component to display the error
  })
}


export const GetIpfsLink = async (hash) => {
  if (hash === undefined || hash === '') {
    return ''
  }
  if (!(hash.startsWith('Qm') && hash.length === 46)) {
    return hash
  }
  if (USE_DEFAULT_IPFS_GATEWAY) {
    return `${DEFAULT_IPFS_GATEWAY}${hash}`
  }
  let url = `${MY_PINATA_GATEWAY}${hash}`
  let res = await axios.head(url).catch(e => e)
  if (res !== undefined && res.status === 200) {
    return url
  }
  url = `${CLOUDFLARE_GATEWAY}${hash}`
  res = await axios.head(url).catch(e => e)
  if (res !== undefined && res.status === 200) {
    return url
  }
  url = `${INFURA_GATEWAY}${hash}`
  res = await axios.head(url).catch(e => e)
  if (res !== undefined && res.status === 200) {
    return url
  }
  url = `${DWEB_GATEWAY}${hash}`
  return url
}

/**
 * Get User Metaata from tzkt.io
 */
export const GetUserMetadata = async (walletAddr) => {
  const data = await axios
    .get(
      `https://api.tzkt.io/v1/accounts/${walletAddr}/metadata`
    )
    .catch()
  if (data.data !== "") {
    data.data.logo = walletAddr;
  }
  return data;
}

export const GetUserName = async (walletAddr) => {
  const data = await axios
    .get(
      `https://api.tzkt.io/v1/accounts/${walletAddr}/metadata`
    )
    .catch()
  return (data.data !== "") ? data.data.alias : ""
}
