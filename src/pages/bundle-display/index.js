/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import { GetBundle } from '../../data/api'
import { Loading } from '../../components/loading'
import { Page, Container, Padding } from '../../components/layout'
import { InfoDetailContainer, InfoDetailItem } from '../../components/info-detail'
import { BundleCarousel } from '../../components/render-carousel'
import { PATH } from '../../constants'
import { showWallet } from '../../utils/string'
import styles from './styles.module.scss'
import { getLanguage } from '../../constants'
import { GetIpfsLink } from '../../data/api'
import { ItemList } from '../../components/item-list'
import { RecordListContainer, RecordsList } from '../../components/records'


export const BundleDisplay = () => {

  useEffect(() => {
    GetBundle({ id })
      .then(async (result) => {
        await context.setAccount().catch()
        if (isMounted) {
          if (result === undefined) {
            setIsNothing(true)
            history.replace('/bundle')
          } else {
            setBundle(result)
            setTitle(result.metadata.title)
            setItems(result.bundleItems)

            getThumbnailData(result.bundleItems)
              .then(res => {
                if (isMounted) {
                  setThumbnails(res)
                }
              })
              .catch()
            setIsNothing(false)
          }
          setLoading(false)
        }
      })
      .catch()
    return () => { setIsMounted(false) }
  }, [])

  const [isMounted, setIsMounted] = useState(true)
  const { id } = useParams()
  const context = useContext(AkaSwapContext)
  const history = useHistory()
  // const [amount, setAmount] = useState(1)
  const [loading, setLoading] = useState(true)
  const [bundle, setBundle] = useState([])
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [isNothing, setIsNothing] = useState(true)
  const [thumbnails, setThumbnails] = useState([])
  const language = getLanguage()

  const handleCollectBundle = async (event) => {
    if (context.acc == null) {
      context.syncTaquito().catch()
      return
    }
    event.target.disabled = true
    // context.collectBundle(amount, bundle.bundleId, bundle.xtzPerBundle*amount)
    context
      .collectBundle(1, bundle.bundleId, bundle.xtzPerBundle * 1)
      .then((e) => {
        console.log('collect bundle confirm', e)
        history.push('/sync')
        event.target.disabled = false
      })
      .catch((e) => {
        console.log('collect bundle error', e)
        alert('an error occurred')
      })
  }

  const handleCancelBundle = async (event) => {
    if (context.acc == null) {
      context.syncTaquito().catch()
      return
    }
    event.currentTarget.disabled = true
    context
      .cancelBundle(bundle.bundleId)
      .then((e) => {
        // event.currentTarget.disabled = false
        console.log('bundle canceled confirm', e)
        history.push('/sync')
      })
      .catch((e) => {
        console.log('bundle canceled error', e)
        alert('an error occurred')
      })
  }

  const getThumbnailData = async (items) => {
    let thumbnails = []
    thumbnails = await Promise.all(items.map(async (token) => {
      return ({
        uri: await GetIpfsLink(token.tokenInfo.thumbnailUri.split('//')[1]),
        frame: token.tokenInfo.frameColor
      })
    }))
    return thumbnails
  }

  return (
    <Page title={title}>
      {loading && (
        <Container>
          <Loading />
        </Container>
      )}

      {!loading &&
        (isNothing ? (
          <>nothing</>
        ) : (
          <Container large>
            <Container full>
              <div className={styles.info}>
                <div className={styles.left}>
                  <BundleCarousel imgs={thumbnails} />
                </div>
                <div className={styles.right}>
                  <InfoDetailContainer
                    title={bundle.metadata.title}>
                    <InfoDetailItem
                      description={bundle.metadata.description}
                      inline={false}
                    />
                    <InfoDetailItem
                      subtitle={language.detail.info.issuer}
                      content={showWallet({ wallet: bundle.issuer, full: false, alias: bundle.issuerAlias })}
                      path={`${PATH.ISSUER}/${bundle.issuer}`}
                      inline={false}
                    />
                    <InfoDetailItem
                      subtitle={language.detail.info.remain}
                      content={bundle.bundleAmount}
                      inline={false}
                    />
                  </InfoDetailContainer>

                  <div className={styles.controll}>
                    <div className={styles.button}>
                      {/* <div className={styles.amount}>
                    <Input
                      type="number"
                      min={1}
                      onChange={(e) => {
                        setAmount(e.target.value)
                      }}
                      placeholder=""
                      label=""
                      value={amount}
                    />
                    </div> */}
                      {bundle.issuer !== context.acc?.address && (
                        <>
                          <button
                            className={styles.price}
                            onClick={handleCollectBundle}
                          >
                            {language.detail.collect.replace(
                              '%Price%',
                              (bundle.xtzPerBundle * 1) / 1000000
                            )}
                            {/* {language.detail.collect}{bundle.xtz_per_bundle*1 / 1000000} xtz */}
                          </button>
                        </>
                      )}
                    </div>
                    {bundle.issuer === context.acc?.address && (
                      <div className={styles.button}>
                        <button
                          className={styles.cancelBundle}
                          onClick={handleCancelBundle}
                        >
                          {language.bundle.discontinue}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Container>
            <Container full>
              <Padding></Padding>
            </Container>
            <ItemList
              description=""
              datas={[
                {
                  title: language.bundle.items,
                  items: items,
                  thumbnails: thumbnails,
                  detailType: "amount"
                }
              ]}
            />
            <RecordListContainer>
              <RecordsList
                // reference gacha-display
                records={[
                  [
                    { text: 'date' },
                    {
                      text: 'address',
                      link: '#'
                    },
                    { text: 'item' },
                    { text: '1x' }
                  ],
                  [
                    { text: 'date' },
                    {
                      text: 'address',
                      link: '#'
                    },
                    { text: 'item2' },
                    { text: '1x' }
                  ]
                ]}
                title={language.detail.records.title}
                grids={[7, 2, 2, 2, 1]}//first item is total grid
                rwdGrids={[2, 1, 1, 1, 1]}//first item is total grid
              />
            </RecordListContainer>
            <Container xlarge></Container>
          </Container>
        ))}
    </Page>
  )
}
