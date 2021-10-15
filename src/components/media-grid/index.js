import React, { useEffect, useState } from "react";
import { Container, Padding } from '../layout'
import { Button, PlainText } from '../button'
import { InfoSimple } from '../info-simple'
import { VisuallyHidden } from '../visually-hidden'
import { RenderMedia } from '../render-media'
import { MimeTypeIcon } from '../mimetype-icon'
import { PATH } from '../../constants'
import { getDeltaSecond } from '../../datetime'
import styles from './styles.module.scss'
import Masonry from 'react-masonry-css'
import { Timer } from "../timer";

export const ResponsiveMasonry = ({ children }) => {
  const getColumns = () => {


    if (global.innerWidth > 600) {
      return 2
    }

    return 1
  }
  const [columns, setColumns] = useState(getColumns())

  useEffect(() => {
    const resize = () => {
      setColumns(getColumns())
    }
    global.addEventListener('resize', resize)

    return () => global.removeEventListener('resize', resize)
  }, [])

  return (
    <Masonry
      breakpointCols={columns}
      className={styles.list}
      columnClassName={styles.column}
    >
      {children}
    </Masonry>
  )
}
export const MediaItem = ({ item, index, auction }) => {
  // const [linkEnabled, setLinkEnabled] = useState(true)
  const linkEnabled = true
  const { tokenInfo, tokenId, issuer, alias, sales, totalAmount } = item
  var { mimeType, uri } = tokenInfo.formats[0]

  // var linkEnabled = false
  // mimeType = MIMETYPE.JPEG
  // uri = tokenInfo.displayUri


  return (
    <div className={styles.mediaItemBtn}>
      <Button to={linkEnabled ? (auction ? `${PATH.AUCTION}/${item.auctionId}` : `${PATH.AKAOBJ}/${tokenId}`) : '#'}
        key={auction ? item.auctionId : tokenId}
        onClick={linkEnabled ? null : ((e) => { e.preventDefault() })}
        customClass={styles.wrapButton}></Button>
      <PlainText>
        <VisuallyHidden>{`Go to akaOBJ: ${tokenInfo.name}`}</VisuallyHidden>
        <div className={styles.item}>
          <div className={styles.media}>
            <div className={styles.rollover}>
              <MimeTypeIcon mimeType={mimeType} />
            </div>
            {
              // if it is image -> use thumbnail, else original media
              <RenderMedia
                mimeType={mimeType}
                uri={uri.split('//')[1]}
                metadata={item}
                frameColor={tokenInfo.frameColor}
              ></RenderMedia>}
            {
              auction &&
              <div className={styles.auctionInfo}>
                <span className={styles.id}>
                  #{item.auctionId}
                </span>
                <span className={styles.countdown}>
                  <Timer seconds={getDeltaSecond(item.dueTime)} type="dhms"></Timer>
                </span>
              </div>
            }
            {getDeltaSecond(item.dueTime) < 0 &&
              <div className={styles.cover}>
              </div>
            }

          </div>
          <div className={styles.bottomInfo}>
            <InfoSimple
              tokenInfo={tokenInfo}
              tokenId={tokenId}
              item={item}
              totalAmount={totalAmount}
              sales={sales}
              auction={auction}
              issuer={auction ? issuer : null}
              alias={auction ? alias : null}
            // voteHover={() => setLinkEnabled(false)}
            // voteHoverLeave={() => setLinkEnabled(true)}
            />
          </div>
        </div>
      </PlainText>
    </div>)
}
export const MediaGrid = ({ items, auction }) => {

  return (
    <Container large>
      <Padding>
        <ResponsiveMasonry>
          {items.map((item, index) => {
            return <MediaItem
              item={item}
              key={'item_' + index}
              index={index}
              auction={auction} />
          })}
        </ResponsiveMasonry>
      </Padding>
    </Container>
  )
}
