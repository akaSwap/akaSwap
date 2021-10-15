/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { GetGachaList } from '../../data/api'
import { Page, Container, Padding } from '../../components/layout'
import { Loading } from '../../components/loading'
import { FixedFooter } from '../../components/fixed-footer'
import { MultiItemGrid } from '../../components/multiItem-grid'
import styles from './styles.module.scss'
import { GACHA_EXPIRATION_SECOND, getLanguage } from '../../constants'

export const Gachas = ({ type = 0 }) => {
  const [error, setError] = useState(false)
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)
  const language = getLanguage()

  const loadMore = () => {
    setLoading(true)
    getFeed()
  }

  const [isMounted, setIsMounted] = useState(true)

  const getFeed = () => {
    GetGachaList({ address: '', counter: count })
      .then((result) => {
        if (isMounted) {

          // filtered isn't guaranteed to always be 30. if we're filtering they might be less.
          const filtered = result.feed.filter((item) =>
            item.cancelTime + GACHA_EXPIRATION_SECOND > Math.floor(new Date().getTime() / 1000)
          )
          filtered.forEach((item) => {
            item.gachaItems.sort((a, b) => {
              if (a.total > b.total) return 1
              else if (a.total < b.total) return -1
              else
                return (a.tokenId > b.tokenId) ? 1 : -1
            });
          })
          const next = items.concat(filtered)
          setItems(next)
          setHasMore(result.hasMore)
          setLoading(false)
          setCount(count + 1)
        }
      })
      .catch((e) => {
        if (isMounted) {
          setError(true)
        }
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
    return () => { setIsMounted(false) }
  }, [type])

  return (
    <Page title="GachaList">
      {loading && (
        <Container>
          <Padding>
            <Loading />
          </Padding>
        </Container>
      )}
      <InfiniteScroll
        // dataLength={items.length}
        dataLength={count * 5}
        children={items}
        next={loadMore}
        hasMore={hasMore}
        scrollableTarget="infiniteScrollParent"
        endMessage={
          <Container>
            <Padding>
              <FixedFooter />
            </Padding>
          </Container>
        }
      >
        <div>
          {/* NEW WAY */}
          {
            type === 0 &&
            <Container large>
              <Padding>
                <div className={styles.title}>{language.gacha.title}</div>
              </Padding>
              <div className={styles.gachalist}>
                <MultiItemGrid items={items} type="gacha"></MultiItemGrid>
              </div>
            </Container>
          }
        </div>
      </InfiniteScroll>
    </Page>
  )
}
