import React, { useState, useEffect } from 'react'
import { Container, Padding } from '../../../components/layout'
import { Button } from '../../../components/button'
import { BannedIcon } from '../../../components/banned'
import { RenderMedia } from '../../../components/render-media'
import { ResponsiveMasonry } from '../../../components/responsive-masonry'
import { Loading } from '../../../components/loading'
import { SanitiseAkaObj } from '../../../utils/sanitise'
import { PATH } from '../../../constants'
import axios from 'axios'
import styles from '../styles.module.scss'


export const Creation = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const wallet = window.location.pathname.split('/')[2]
  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_ACCOUNTS}/${wallet}/creations`)
      .then(async (res) => {
        let creations = res.data.creations === undefined ? [] : res.data.creations
        creations = SanitiseAkaObj(res.data.creations)
        if (isMounted) {
          setItems(creations)
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
                  this.state.creations.length /
                  this.state.creationItemsPerPage
                )
              )
            ).map((a, i) => {
              const itemClasses = classnames({
                [styles.item]: true,
                [styles.selected]: i === this.state.creationPage,
              })
              return (
                <div
                  key={`creation-${i}`}
                  className={itemClasses}
                  onClick={() => this.setState({ creationPage: i })}
                />
              )
            })}
          </div>
        </Padding>
      )} 
      */}
      <ResponsiveMasonry
        className={styles.list}>
        {items.map(
          (nft, i) => {
            // pagination disabled
            // const firstIndex =
            //   this.state.creationPage * this.state.creationItemsPerPage
            // if (
            //   i >= firstIndex &&
            //   i < (firstIndex + 1) * this.state.creationItemsPerPage
            // ) {
            const { mimeType, uri } = nft.tokenInfo.formats[0]

            return (
              <Button
                key={nft.tokenId}
                to={`${PATH.AKAOBJ}/${nft.tokenId}`}
              >
                <div className={styles.container}>
                  {nft.banned !== undefined ?
                    <BannedIcon></BannedIcon> :
                    <RenderMedia
                      mimeType={mimeType}
                      uri={uri.split('//')[1]}
                      metadata={nft}
                      frameColor={nft.tokenInfo.frameColor}
                    />
                  }
                  {nft.banned !== undefined ?
                    <div className={styles.number_banned}>
                      # {nft.tokenId}
                    </div>
                    :
                    <div className={styles.number}>
                      # {nft.tokenId}
                    </div>
                  }
                </div>
              </Button>
            )
          }
          //  else {
          // return null
          // }}
        )}
      </ResponsiveMasonry>
    </Container>
  )
}
