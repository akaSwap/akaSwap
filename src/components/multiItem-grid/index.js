import React, { useEffect, useState } from 'react'
import { Button, PlainText } from '../button'
import { BundleCarousel, GachaCarousel } from '../render-carousel'
import { PATH, getLanguage } from '../../constants'
import { getDeltaSecond } from '../../datetime'
import styles from './styles.module.scss'
import Masonry from 'react-masonry-css'
import { ReactComponent as GachaIcon } from '../../imgs/gachaIcon.svg'
import { ReactComponent as BundleIcon } from '../../imgs/bundleIcon.svg'
import { BannedIcon } from '../banned'
import { GetIpfsLink } from '../../data/api'

export const ResponsiveMasonry = ({ children }) => {
  const getColumns = () => {
    if (global.innerWidth > 600) {
      return 2
    }

    return 1
  }
  const [colums, setColumns] = useState(getColumns())

  useEffect(() => {
    const resize = () => {
      setColumns(getColumns())
    }
    global.addEventListener('resize', resize)

    return () => global.removeEventListener('resize', resize)
  }, [])

  return (
    <Masonry
      breakpointCols={colums}
      className={styles.list}
      columnClassName={styles.column}
    >
      {children}
    </Masonry>
  )
}

export const MultiItemGrid = ({ items, type }) => {
  // const getColumns = () => {
  //   if (global.innerWidth > 600) {
  //     return 2
  //   }
  //   return 1
  // }
  // const [columns, setColumns] = useState(getColumns())
  const [thumbnails, setThumbnails] = useState([])
  const [lastThumbnail, setLastThumbnail] = useState([])
  const isBundle = type === 'bundle'

  // let lastThumbnail = []
  // let thumbnails = []
  // if (isBundle) {

  //   thumbnails = items.map((item) =>
  //     item.bundleItems.map(
  //       (token) => {
  //         return ({
  //           uri: DEFAULT_IPFS_GATEWAY + token.tokenInfo.thumbnailUri.split('//')[1],
  //           frame: token.tokenInfo.frameColor
  //         })
  //       }
  //     )
  //   )

  // } else {

  //   thumbnails = items.map((item) =>
  //     item.gachaItems.map(
  //       (token) => {
  //         return ({
  //           uri: DEFAULT_IPFS_GATEWAY + token.tokenInfo.thumbnailUri.split('//')[1],
  //           frame: token.tokenInfo.frameColor
  //         })
  //       }
  //     )
  //   )

  //   lastThumbnail = items.map(
  //     (item) => {
  //       return ({
  //         uri: DEFAULT_IPFS_GATEWAY + item.lastPrize.tokenInfo.thumbnailUri.split('//')[1],
  //         frame: item.lastPrize.tokenInfo.frameColor
  //       })
  //     }
  //   )
  // }

  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {
    // const resize = () => {
    //   setColumns(getColumns())
    // }
    // global.addEventListener('resize', resize)

    getThumbnailData(items, isBundle)
      .then(data => {
        if (isMounted) {
          setThumbnails(data.thumbnails)
          setLastThumbnail(data.lastThumbnail)
        }
      })
      .catch(e => e)

    return () => {
      // global.removeEventListener('resize', resize)
      setIsMounted(false)
      //setIsMounted(false)
    }
  }, [items, isBundle, isMounted])

  const getThumbnailData = async (items, isBundle) => {
    let thumbnails = []
    let lastThumbnail = []
    if (isBundle) {
      thumbnails = await Promise.all(items.map(async (item) =>
        await Promise.all(item.bundleItems.map(async (token) => {
          return ({
            uri: await GetIpfsLink(token.tokenInfo.thumbnailUri.split('//')[1]),
            frame: token.tokenInfo.frameColor
          })
        }))
      ))
    } else {
      [thumbnails, lastThumbnail] = await Promise.all([
        await Promise.all(items.map(async (item) =>
          await Promise.all(item.gachaItems.map(async (token) => {
            return ({
              uri: await GetIpfsLink(token.tokenInfo.thumbnailUri.split('//')[1]),
              frame: token.tokenInfo.frameColor
            })
          }))
        )),
        await Promise.all(items.map(async (item) => {
          return ({
            uri: await GetIpfsLink(item.lastPrize.tokenInfo.thumbnailUri.split('//')[1]),
            frame: item.lastPrize.tokenInfo.frameColor
          })
        }))
      ])
    }

    return { thumbnails, lastThumbnail }
  }
  const MultiItem = (item, i) => {
    var path, itemId, title, icon, amount, carousel, price, desc, comingSoon, ended, soldout
    title = item.metadata.title ? (item.metadata.title.substring(0, 30) + (item.metadata.title.length > 30 ? '...' : '')) : ''
    desc = formatDescription(item.metadata.description)
    comingSoon = item.issueTime && getDeltaSecond(item.issueTime) > 0
    ended = item.cancelTime && getDeltaSecond(item.cancelTime) <= 0
    soldout = item.gachaAmount && item.gachaAmount === 0
    if (isBundle) {
      path = `${PATH.BUNDLE}/${item.bundleId}`
      itemId = item.bundleId
      icon = <BundleIcon className={styles.icon} alt="bundle_icon" />
      amount = item.bundleAmount
      carousel = <BundleCarousel isThumbnail imgs={thumbnails[i]} />
      price = `${item.xtzPerBundle / 1000000.0} xtz`
    } else {
      path = `${PATH.GACHA}/${item.gachaId}`
      itemId = item.gachaId
      icon = <GachaIcon className={styles.icon} alt="gacha_icon" />
      amount = `${item.gachaAmount} / ${item.gachaTotal}`
      carousel = <GachaCarousel
        isThumbnail
        imgs={thumbnails[i]}
        lastPrize={lastThumbnail[i]}
        id={item.gachaId}
      />
      price = ended ? getLanguage().gacha.titleEnd
        : soldout ? getLanguage().gacha.titleSoldOut
          : `${item.xtzPerGacha / 1000000.0} xtz`
    }
    carousel = item.banned !== undefined ?
      <BannedIcon></BannedIcon>
      : carousel

    return (
      <div className={styles.gridItem}
        key={i}
      >
        {ended &&
          <div className={styles.cover}>
            <div className={styles.titleEnd}>
              {getLanguage().gacha.titleEnd}
            </div>
          </div>
        }
        <Button to={path}>
          <PlainText>
            <div className={styles.topInfo}>
              <span className={styles.id}>
                # {itemId} &nbsp;&nbsp;
                {title}
              </span>
              {comingSoon &&
                <div className={styles.issueTime}>{getLanguage().detail.comingSoon}</div>
              }
              {icon}
              <div className={styles.amount}>{amount}</div>
            </div>
          </PlainText>
        </Button>

        {carousel}

        <Button to={path}>
          <PlainText>
            <div className={styles.bottomInfo}>
              <div className={styles.description}>
                {desc}
              </div>
              <div className={styles.amount}>
                <div className={styles.price + ' ' + ((ended || soldout) ? styles.ended : '')}>
                  {price}
                </div>
              </div>
            </div>
          </PlainText>
        </Button>
      </div >
    )
  }

  const formatDescription = (str) => {
    str = str.substring(0, 50) + (str.length > 50 ? "..." : "")
    const paragraph = str.split(/\r\n|\r|\n/)
    // console.log(paragraph.length)
    if (paragraph.length > 1) {
      str = ''.concat(paragraph[0], '\n', paragraph[1], ' ...')
    }
    return str
    // 
  }


  return (
    <div className={styles.gridContainer}>
      {items.length <= thumbnails.length &&
        items.map((item, i) => MultiItem(item, i))
      }
    </div>
  )
}

