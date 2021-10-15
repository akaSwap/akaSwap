import React, { useState, useEffect, useContext } from 'react'
import { getLanguage, getCurationList } from '../../constants'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import { Purchase } from '../../components/button'
import { PATH } from '../../constants'
import { showWallet } from '../../utils/string'
import { Button } from '../../components/button'
import styles from './styles.module.scss'
import { InfoDetailCol, InfoDetailContainer, InfoDetailItem } from '../../components/info-detail'
import { DEFAULT_IPFS_GATEWAY } from '../../constants'
import { GetIpfsLink } from '../../data/api'

const _ = require('lodash')
export const Info = ({ tokenId,
  tokenInfo,
  sales,
  totalAmount }) => {

  useEffect(() => {
    if (!hasIpfsUrl) {
      GetIpfsLink(formats[0].uri.replace('ipfs://', ''))
        .then(res => {
          if (isMounted) {
            setIpfsUrl(res)
            setHasIpfsUrl(true)
          }
        })
        .catch()
    }
    return () => { setIsMounted(false) }
  })

  const [isMounted, setIsMounted] = useState(true)

  const [hasIpfsUrl, setHasIpfsUrl] = useState(false)
  const { name, description, tags, formats, creators, creatorShares, aliases } = tokenInfo
  const [ipfsUrl, setIpfsUrl] = useState(formats[0].uri.replace('ipfs://', DEFAULT_IPFS_GATEWAY))
  const language = getLanguage()
  const curationList = getCurationList()
  const detail = {
    creators,
    creatorShares,
    aliases,
    sales,
    tags,
    "mimeType": formats[0].mimeType,
    ipfsUrl,
    "total": totalAmount
  }
  const { syncTaquito, collect, acc } = useContext(AkaSwapContext)
  // const { syncTaquito, collect, vote, acc } = useContext(AkaSwapContext)
  const address = acc?.address
  let s = _.minBy(detail.sales?.swaps, (o) => Number(o.xtzPerAkaObj))
  var message = ''
  try {
    message =
      detail.sales?.swaps[0] !== undefined
        ? Number(s.xtzPerAkaObj) / 1000000
        : language.detail.notForSale

  } catch (e) {
    message = language.detail.notForSale
  }

  // For VIP-only Curation

  curationList.map((curation) => {
    if (curation.isPrivate && curation.akaOBJs.indexOf(tokenId) >= 0 && curation.vip.indexOf(address) < 0) {
      message = language.detail.notForSale
    }
    return () => { }
  })
  const handleCollect = (event) => {
    event.currentTarget.disabled = true;

    if (acc === null) {
      syncTaquito().catch()
      event.currentTarget.disabled = false;
    } else {

      collect(1, s.swapId, s.xtzPerAkaObj * 1, tokenId).then((e) => {
        window.location.reload()
      })
    }
  }
  // const handleVote = (event) => {
  //   voteHover()
  //   if (acc === null) {
  //     syncTaquito().catch()
  //     return;
  //   }
  //   const r = global.confirm(
  //     `${language.detail.curate.confirm}${VOTE_FEE / 1000000}⩘ ?`
  //   )
  //   if (r) {
  //     // curate(parseInt(VOTE_FEE),parseInt(id)).then((e) => {
  //     //   window.location.reload()
  //     // })
  //     console.log("To vote on akaOBJ#" + parseInt(id) + " , issuer = " + detail.creators[0])
  //     vote(parseInt(id), detail.creators[0]).then((e) => {
  //       window.location.reload()
  //     })
  //   }
  // }
  return (
    <div className={styles.info}>
      <InfoDetailContainer
        title={name}
      >
        <InfoDetailItem
          description={description}
          inline={false}
        />
        <InfoDetailItem tags={detail.tags} />
        <InfoDetailItem
          subtitle={language.detail.akaObj}
          content={'#' + tokenId}
        />
        <InfoDetailItem
          subtitle={language.detail.info.mediaType + ":"}
          content={detail.mimeType}
        >
          <Button href={detail.ipfsUrl}>
            <span className="text">
              &nbsp;(<label className="link">{language.detail.info.ipfsLink}</label>)
            </span>
          </Button>
        </InfoDetailItem>
        <InfoDetailItem
          subtitle={language.detail.creator + ':'}
          path={PATH.ISSUER + '/' + detail.creators[0]}
          content={showWallet({ wallet: detail.creators[0], full: false, alias: detail.aliases[0] })}
        />
        <InfoDetailCol>
          <InfoDetailItem
            subtitle={language.mint.label.royalties + ':'}
            content={` ${detail.creatorShares.reduce((a, b) => a + b) / 10}%`}
          />
          <InfoDetailItem
            subtitle={language.detail.editions + ':'}
            content={` ${detail.total}`}
          />
        </InfoDetailCol>
        <div className={styles.control}>
          <div className={styles.vote_wrapper}>
            {/* vote button */}
            {/* { !auction &&
            <Button onMouseEnter={()=>voteHover()} onMouseLeave={()=>voteHoverLeave()} onClick={(event) => handleVote(event)}>
            <span className={styles.vote_count}>
              {akaDAO_balance/1000000}
              <VoteIcon className={styles.vote_icon} alt="VOTE"/>
            </span>
            <div className={styles.tooltips}>{language.detail.vote.replace('%Vote%',VOTE_FEE/1000000)}</div>
            </Button>
          } */}
          </div>
          {/* collect button */}
          <Button onClick={(event) => handleCollect(event)} disabled={message === language.detail.notForSale || acc?.address === s.issuer}>
            <Purchase>{message === language.detail.notForSale || false ? message : ((language.detail.collect).replace("%Price%", message))}</Purchase>
          </Button>
        </div>
      </InfoDetailContainer>
    </div>
  )
}
