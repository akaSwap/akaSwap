/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useParams } from 'react-router'
import { Button } from '../../components/button'
import { GetTag } from '../../data/api'
import { ResponsiveMasonry } from '../../components/responsive-masonry'
import { Loading } from '../../components/loading'
import { RenderMedia } from '../../components/render-media'
import { Page, Container, Padding } from '../../components/layout'
import { PATH } from '../../constants'
import styles from './styles.module.scss'

export const Tags = () => {
  const { id } = useParams()
  const [error, setError] = useState(false)
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)

  const searchId = decodeURIComponent(id)

  const loadMore = () => {
    setLoading(true)
    getFeed()
  }

  const getFeed = () => {
    GetTag({ tag: searchId, counter: count })
      .then((result) => {
        const next = items.concat(result.feed)
        setItems(next)
        setHasMore(result.hasMore)
        setLoading(false)
        setCount(count + 1)
      })
      .catch((e) => {
        setError(true)
      })
  }

  useEffect(() => {
    if (error) {
      console.log('returning on error')
      return
    }
    if (count === 0) {
      getFeed()
    }
  }, [searchId])

  return (
    <div className={styles.page}>
      <Page title={`Tag ${searchId}`}>
        {loading && (
          <Container>
            <Padding>
              <Loading />
            </Padding>
          </Container>
        )}
        <InfiniteScroll
          // dataLength={items.length}
          scrollableTarget="infiniteScrollParent"
          dataLength={count * 5}
          children={items}
          next={loadMore}
          hasMore={hasMore}
          endMessage={
            <Container xlarge>
              {/*             <p>
              mint mint mint{' '}
              <span role="img" aria-labelledby={'Sparkles emoji'}>
                ✨
              </span>
            </p> */}
            </Container>
          }
        >
          <div className={styles.container}>
            <Container xlarge>
              <ResponsiveMasonry>
                {
                  !loading && items.length < 1 &&
                  <div>
                    Sorry, no result found - "{searchId}"
                  </div>
                }
                {items.map((nft) => {
                  const { mimeType, uri } = nft.tokenInfo.formats[0]

                  return (
                    <Button
                      key={nft.tokenId}
                      to={`${PATH.AKAOBJ}/${nft.tokenId}`}
                    >
                      <div className={styles.container}>
                        {
                          <RenderMedia
                            mimeType={mimeType}
                            uri={uri.split('//')[1]}
                            metadata={nft}
                            frameColor={nft.tokenInfo.frameColor}
                          ></RenderMedia>}
                        <div className={styles.number}>#{nft.tokenId}</div>
                      </div>
                    </Button>
                  )
                })}
              </ResponsiveMasonry>
            </Container>
          </div>
        </InfiniteScroll>
      </Page>
    </div>
  )
}
