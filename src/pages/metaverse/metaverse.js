/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react'
import { useHistory } from 'react-router'
import InfiniteScroll from 'react-infinite-scroll-component'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import { GetLatestFeed, GetFeaturedFeed, GetBundleList, GetAuctionList } from '../../data/api'
import { Page, Container, Padding } from '../../components/layout'
import { Loading } from '../../components/loading'
import { FixedFooter } from '../../components/fixed-footer'
// import { ButtonMarketplace } from '../../components/button-marketplace'
import { MediaGrid } from '../../components/media-grid'
import { MultiItemGrid } from '../../components/multiItem-grid'
import { CurationGrid } from '../../components/curation-grid'
import { AUCTION_EXPIRATION_SECOND, ENV, getLanguage, getCurationList } from '../../constants'
import styles from './styles.module.scss'
import { TagSearch } from '../../components/tag-search'
import { TabBar } from '../../components/tab-bar'

export const Metaverse = ({ tab = 'Metaverse' }) => {
  const [error, setError] = useState(false)
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)

  const history = useHistory()
  const context = useContext(AkaSwapContext)
  const language = getLanguage()
  const curationList = getCurationList().filter(curation => curation.isDisplay)

  // const axios = require('axios')
  // axios.get(process.env.REACT_APP_AKADAO, {
  //       params: {
  //         address: this.state.wallet
  //       },
  //     })
  //     .then(async (res) => {
  //       // this.setState({
  //       //   akaDao: res,
  //       // })
  //     })

  const loadMore = () => {
    setLoading(true)
    getFeed()
  }

  const handleRoute = (path) => {
    context.setMenu(true)
    history.push(path)
  }

  const tabOrder = [
    ((curationList.length > 0) && (ENV !== 'test')) ? 'Curation' : null,
    ENV !== 'test' ? 'Featured' : null,
    'Latest',
    //'Popular',
    'BundleList',
    'AuctionList'
  ]

  const tabInfo = {
    'Curation': {
      'tabNameIndex': 5,
      'route': '/curation'
    },
    'Featured': {
      'tabNameIndex': 2,
      'route': '/featured',
      'feed': () => GetFeaturedFeed({ counter: count })
    },
    'Latest': {
      'tabNameIndex': 0,
      'route': '/latest',
      'feed': () => GetLatestFeed({ counter: count })
    },
    'Popular': {
      'tabNameIndex': 1,
      'route': '/popular',
      //'feed': () => GetPopularFeed({ counter: count }),
    },
    'BundleList': {
      'tabNameIndex': 3,
      'route': '/bundle',
      'feed': () => GetBundleList({ counter: count }),
    },
    'AuctionList': {
      'tabNameIndex': 4,
      'route': '/auction',
      'feed': () => GetAuctionList({ counter: count }),
    },
    'Metaverse': {
      'tabNameIndex': null,
      'feed': () => GetLatestFeed({ counter: count })
    },
  }

  // for displaying tab
  var currentTabIndex = tabOrder.indexOf(tab === 'Metaverse' ? 'Latest' : tab)


  const handleTabSwitch = (i) => {
    currentTabIndex = i
    handleRoute(tabInfo[tabOrder[i]].route)
  }

  const [isMounted, setIsMounted] = useState(true)

  const getFeed = () => {
    if (tab === 'Curation') {  // curation
      setLoading(false)
      return
    }
    tabInfo[tab].feed()
      .then((result) => {
        if (isMounted) {
          let filtered = result.feed

          if (tab === 'AuctionList') { // auction
            filtered = result.feed.filter((item) =>
              item.dueTime + AUCTION_EXPIRATION_SECOND > Math.floor(new Date().getTime() / 1000)
            )
          }

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
    setIsMounted(true)
    if (error) {
      console.log('returning on error')
      return
    }
    if (count === 0) {
      getFeed()
    }
    return () => { setIsMounted(false) }
    //}, [type])
  }, [tab])

  return (
    <Page title={tab}>
      <Container>
        <TagSearch></TagSearch>
      </Container>
      <Container>
        <Padding>
          <TabBar
            className={styles.tabBar + ' ' + (language.marketplace.tab[2] === 'Featured' ? styles.tabEn : styles.tabZh)}
            current={currentTabIndex}
            tabNames={tabOrder.map((t) => t === null ? null : language.marketplace.tab[tabInfo[t].tabNameIndex])}
            onClickCB={handleTabSwitch}
          />
        </Padding>
      </Container>
      {loading && (
        <Container>
          <Padding>
            <Loading
              top='70%' />
          </Padding>
        </Container>
      )}

      <InfiniteScroll
        // dataLength={items.length}
        dataLength={count * ((tab === 'Featured') ? 30 : 5)}
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
        <div style={{ minHeight: "1500px" }}>
          {/* NEW WAY */}
          {
            tab === 'Curation' &&
            <Container medium>
              <CurationGrid />
            </Container>
          }
          {
            (tab === 'Latest' || tab === 'Metaverse' || tab === 'Featured') &&
            <Container xlarge>
              <MediaGrid items={items} auction={false} />
            </Container>
          }
          {
            tab === 'BundleList' &&
            <Container large>
              <MultiItemGrid items={items} type="bundle"></MultiItemGrid>
            </Container>
          }
          {
            tab === 'AuctionList' &&
            <Container xlarge>
              <MediaGrid items={items} auction={true} />
            </Container>
          }
        </div>
      </InfiniteScroll>
    </Page>
  )
}
