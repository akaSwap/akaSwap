import React, { useContext } from 'react'
import { getCurationList, getLanguage} from '../../constants'
import { PATH, MAX_AUCTION_PURCHASE_PRICE } from '../../constants'
import { getDeltaSecond } from '../../datetime'
import { Button, Primary,  PlainText } from '../button'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import { showWallet } from '../../utils/string'
import { ReactComponent as GachaIcon } from '../../imgs/gachaIcon.svg'
import { ReactComponent as BundleIcon } from '../../imgs/bundleIcon.svg'
import { ReactComponent as AuctionIcon } from '../../imgs/auctionIcon.svg'
import styles from './styles.module.scss'
//import { ReactComponent as VoteIcon } from './imgs/vote.svg'

const _ = require('lodash')

export const InfoSimple = ({
  tokenId,
  tokenInfo,
  sales,
  item,
  auction,
  issuer,
  alias
  // voteHover = () => null,
  // voteHoverLeave = () => null
}) => {
  const language = getLanguage()
  const curationList = getCurationList()
  // const { syncTaquito, vote, acc } = useContext(AkaSwapContext)
  const { acc } = useContext(AkaSwapContext)
  const address = acc?.address
  var auctionEnded = false

  let s = _.minBy(sales?.swaps, (o) => Number(o.xtzPerAkaObj))

  var message = ''
  var bid = ''

  if (!auction) {
    try {
      message =
        sales?.swaps[0] !== undefined
          ? Number(s.xtzPerAkaObj) / 1000000
          : language.detail.notForSale

    } catch (e) {
      message = language.detail.notForSale
    }
  }
  else {
    if (getDeltaSecond(item.dueTime) < 0) {
      auctionEnded = true
    }
    try {
      message = (Number(item.directPrice) / 1000000).toString()
    } catch (e) {
      message = language.detail.notForSale
    }
    bid = item.currentBidPrice === 0 ?
      item.startPrice.toString() : item.currentBidPrice.toString()
  }

  curationList.map((curation) => {
    if (curation.isPrivate && curation.akaOBJs.indexOf(tokenId) >= 0 && curation.vip.indexOf(address) < 0) {
      message = language.detail.notForSale
      bid = 0
    }
    return () => { }
  })

  // const handleVote = (event) => {
  //   voteHover()
  //   if (acc === null) {
  //     syncTaquito().catch()
  //     return;
  //   }

  //   // if(acc){
  //   //   return; 
  //   // }

  //   const r = global.confirm(
  //     `${language.detail.curate.confirm}${VOTE_FEE / 1000000}⩘ ?`
  //   )
  //   if (r) {
  //     // curate(parseInt(VOTE_FEE),parseInt(tokenId)).then((e) => {
  //     //   window.location.reload()
  //     // })
  //     console.log("To vote on akaOBJ#" + parseInt(tokenId) + " , issuer = " + tokenInfo.creators[0])
  //     vote(parseInt(tokenId), tokenInfo.creators[0]).then((e) => {
  //       window.location.reload()
  //     })
  //   }
  // }

  return (

    <>
      <div className={`${styles.container} ${auction ? styles.auction : ''}`}>

        <div className={styles.infoCol}>
          {/*Creator*/}
          <div className={styles.inline}>
            {(!auction) &&
              <>
                <p>{language.detail.creator}:&nbsp;</p>
                <Button to={`${PATH.ISSUER}/${tokenInfo.creators[0]}`}>
                  <Primary><span className="text translucent">{showWallet({ wallet: tokenInfo.creators[0], alias: tokenInfo.aliases[0] })}</span></Primary>
                </Button>
              </>
            }
            {(auction) &&
              <>
                <p className={styles.creator}>{language.detail.issuer}:&nbsp;</p>
                <Button to={`${PATH.ISSUER}/${issuer}`}>
                  <Primary>{showWallet({ wallet: issuer, alias: alias })}</Primary>
                </Button>
              </>
            }
          </div>
          {/*akaOBJ*/}
          <div className={styles.inline}>
            <Button to={`${PATH.AKAOBJ}/${tokenId}`}>
              <PlainText>akaOBJ #{tokenId}</PlainText>
            </Button>
          </div>
        </div>

        <div className={styles.priceCol + ' ' + (auction ? styles.auction : '')}>
          {/* <div className={styles.vote_wrapper}>
            { !auction &&
            <Button onMouseEnter={()=>voteHover()} onMouseLeave={()=>voteHoverLeave()} onClick={(event) => handleVote(event)}>
            <span className={styles.vote_count}>
              {akaDAO_balance/1000000}
              <VoteIcon className={styles.vote_icon} alt="VOTE"/>
            </span>
            <div className={styles.tooltips}>{language.detail.vote.replace('%Vote%',VOTE_FEE/1000000)}</div>
            </Button>
            }
          </div> */}
          {!auction && (
            <>
              {
                sales.gachas && sales.gachas.length > 0 &&
                <div><GachaIcon className={styles.icon} alt="gacha" /></div>
              }
              {
                sales.bundles && sales.bundles.length > 0 &&
                <div><BundleIcon className={styles.icon} alt="bundle" /></div>
              }
              {
                sales.auctions && sales.auctions.length > 0 &&
                <div><AuctionIcon className={styles.icon} alt="auction" /></div>
              }
            </>
          )
          }
          {/* collect button */}
          {message === language.detail.notForSale ? (
            <div></div>
          ) : (Number(message) >= MAX_AUCTION_PURCHASE_PRICE ?
            null : (!auctionEnded &&
              <div className={styles.price_wrapper}>
                <div className={styles.price}>
                  {message} xtz
                </div>
                <div className={styles.price_detail}>
                  {auction ? language.detail.auction.btn_purchase : null}</div>
              </div>
            )
          )
          }

          {/* Auction */}
          {auction ?
            <div className={styles.price_wrapper}>
              {

                (
                  item.currentBidPrice === 0 ?

                    <div className={styles.startPrice}>
                      {auctionEnded
                        ? language.auction.auctionPass
                        : Number(bid) / 1000000 + " xtz"}
                    </div>

                    : <div className={styles.price}>
                      {Number(bid) / 1000000 + " xtz"}
                    </div>
                )
              }
              <div className={styles.price_detail}>{auction ? (
                item.currentBidPrice === 0 ?
                  !auctionEnded && language.detail.auction.label.startPrice :
                  auctionEnded
                    ? language.auction.hammerPrice
                    : !auctionEnded && language.detail.auction.btn_bid)
                : null}
              </div>
            </div>
            : null}
        </div>
      </div>
    </>
  )
}
