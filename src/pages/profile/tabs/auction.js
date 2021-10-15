import React, { useState, useEffect } from 'react'
import { Container, Padding } from '../../../components/layout'
import { Button } from '../../../components/button'
import { Loading } from '../../../components/loading'
import { BannedIcon } from '../../../components/banned'
import { ResponsiveMasonry } from '../../../components/responsive-masonry'
import { RenderMedia } from '../../../components/render-media'
import { PATH } from '../../../constants'
import axios from 'axios'
import styles from '../styles.module.scss'

export const Auction = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const wallet = window.location.pathname.split('/')[2]
  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_ACCOUNTS}/${wallet}/auctions`)
      .then(async (res) => {
        const auctions = res.data.auctions === undefined ? [] : res.data.auctions
        if (isMounted) {
          setItems(auctions)
          setLoading(false)
        }
      })
      .catch()
    return () => { setIsMounted(false) }
  })

  return (
    <Container xlarge>
      {loading && (
        <Container>
          <Padding>
            <Loading top="70%" />
          </Padding>
        </Container>
      )}
      {/* PAGINATION NOT READY YET */}
      {/* {false && (
        <Padding>
          <div className={styles.pagination}>
            {Array.from(
              Array(
                Math.ceil(
                  this.state.collection.length /
                  this.state.collectionItemsPerPage
                )
              )
            ).map((a, i) => {
              const itemClasses = classnames({
                [styles.item]: true,
                [styles.selected]: i === this.state.collectionPage,
              })
              return (
                <div
                  key={`collection-${i}`}
                  className={itemClasses}
                  onClick={() =>
                    this.setState({ collectionPage: i })
                  }
                />
              )
            })}
          </div>
        </Padding>
      )} */}
      <ResponsiveMasonry className={styles.list}>
        {items.map(
          (auction, i) => {
            // pagination
            // const firstIndex =
            //   this.state.collectionPage * this.state.collectionItemsPerPage
            // if (
            //   i >= firstIndex &&
            //   i < (firstIndex + 1) * this.state.collectionItemsPerPage
            // ) {
            const { mimeType, uri } = auction.tokenInfo.formats[0]
            return (
              <Button
                key={auction.auctionId}
                to={`${PATH.AUCTION}/${auction.auctionId}`}
              >
                <div className={styles.container}>
                  {auction.banned !== undefined ?
                    <BannedIcon></BannedIcon>
                    // Contains inappropriate contents
                    :
                    <RenderMedia
                      mimeType={mimeType}
                      uri={uri.split('//')[1]}
                      metadata={auction}
                      frameColor={auction.tokenInfo.frameColor}
                    />
                  }
                  <div className={styles.number}>
                    # {auction.auctionId}
                  </div>
                </div>
              </Button>
            )
          }
          // else {
          // return null
          // }}
        )}
      </ResponsiveMasonry>
    </Container>
  )
}
