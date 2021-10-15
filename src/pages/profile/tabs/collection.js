import React, { useState, useEffect } from 'react'
import { Container, Padding } from '../../../components/layout'
import { Button } from '../../../components/button'
import { Loading } from '../../../components/loading'
import { BannedIcon } from '../../../components/banned'
import { RenderMedia } from '../../../components/render-media'
import { ResponsiveMasonry } from '../../../components/responsive-masonry'
import { SanitiseAkaObj } from '../../../utils/sanitise'
import { PATH } from '../../../constants'
import axios from 'axios'
import styles from '../styles.module.scss'

export const Collection = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const wallet = window.location.pathname.split('/')[2]
  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_ACCOUNTS}/${wallet}/collections`)
      .then(async (res) => {
        let collections = res.data.collections === undefined ? [] : res.data.collections
        collections = SanitiseAkaObj(collections).filter(
          (e) => wallet !== e.tokenInfo.creators[0]
        )
        if (isMounted) {
          setItems(collections)
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
          (nft, i) => {
            // pagination
            // const firstIndex =
            //   this.state.collectionPage * this.state.collectionItemsPerPage
            // if (
            //   i >= firstIndex &&
            //   i < (firstIndex + 1) * this.state.collectionItemsPerPage
            // ) {
            const { mimeType, uri } = nft.tokenInfo.formats[0]
            return (
              <Button
                key={nft.tokenId}
                to={`${PATH.AKAOBJ}/${nft.tokenId}`}
              >
                <div className={styles.container}>
                  {nft.banned !== undefined ?
                    <BannedIcon></BannedIcon>
                    // Contains inappropriate contents
                    :
                    <RenderMedia
                      mimeType={mimeType}
                      uri={uri.split('//')[1]}
                      metadata={nft}
                      frameColor={nft.tokenInfo.frameColor}
                    />
                  }
                  <div className={styles.number}>
                    # {nft.tokenId}
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
