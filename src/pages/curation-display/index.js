/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from 'react'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import { Swiper, SwiperSlide } from "swiper/react";
import { useParams } from 'react-router'
import { Button } from '../../components/button'
import { GetCuration } from '../../data/api'
import { ResponsiveMasonry } from '../../components/responsive-masonry'
import { Loading } from '../../components/loading'
import { RenderMedia } from '../../components/render-media'
import { Page, Container, Padding } from '../../components/layout'
import { getCurationList } from '../../constants'
import { PATH } from '../../constants'
import { getItem } from '../../utils/storage'
import styles from './styles.module.scss'
import SwiperCore, { EffectFade, EffectCoverflow, Pagination, Navigation } from 'swiper/core'

// install Swiper modules
SwiperCore.use([EffectFade, EffectCoverflow, Pagination, Navigation]);

export const CurationDisplay = () => {

  const { id } = useParams()
  const [error, setError] = useState(false)
  const [items, setItems] = useState([])
  // const [count, setCount] = useState(0)
  // const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const [langInd, setLangInd] = useState(0)
  const { acc } = useContext(AkaSwapContext)
  const curationId = decodeURIComponent(id)
  const curationList = getCurationList()
  const curationInd = curationList.findIndex((element) => element.name === curationId)
  const curationInfo = curationList[curationInd]
  const address = acc?.address

  const currentLang = getItem('language')
  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {

    if (currentLang === 'en') setLangInd(0)
    else if (currentLang === 'zh-tw') setLangInd(1)

    if (error) {
      console.log('returning on error')
      return
    }
    GetCuration({ name: window.location.pathname.split('/')[2] })
      .then((result) => {
        if (isMounted) {
          // const next = items.concat(result.feed)
          // setItems(next)
          setItems(result.feed)
          setLoading(false)
        }
      })
      .catch((e) => {
        if (isMounted) {
          setError(true)
        }
      })

    return () => { setIsMounted(false) }
  }, [])

  function generateSeries(series, i) {
    if (series.type === "carousel") {
      return (
        <div className={styles.series} key={i}>
          <div className={styles.seriesTitle}>
            {series.title[langInd]}
          </div>
          <div className={styles.seriesDescription}>
            {series.description[langInd]}
          </div>
          <div>
            <Swiper effect={'coverflow'} grabCursor={true} centeredSlides={true} slidesPerView={'auto'}
              coverflowEffect={{
                "rotate": 60,
                "stretch": -400,
                "depth": 1000,
                "modifier": 1,
                "slideShadows": false
              }}
              pagination={{
                "clickable": false
              }}
              loop={true}
              className="mySwiper"
            >
              {
                series.objIndex.map((ind, i) => {
                  const nft = items[ind];
                  if (nft) {
                    const { mimeType, uri } = nft.tokenInfo.formats[0]
                    return (
                      nft &&
                      // <div className={styles.carousel}>
                      <SwiperSlide>
                        <Button
                          key={nft.tokenId}
                          to={`${PATH.AKAOBJ}/${nft.tokenId}`}
                        >
                          {
                            <RenderMedia
                              mimeType={mimeType}
                              uri={uri.split('//')[1]}
                              metadata={nft}
                              frameColor={nft.frameColor}
                            ></RenderMedia>}
                          {/* <div className={styles.number}>#{nft.tokenId}</div> */}
                        </Button>
                      </SwiperSlide>
                      // </div>
                    )
                  } else {
                    return (<SwiperSlide></SwiperSlide>)
                  }
                })
              }
            </Swiper>
          </div>
        </div>
      )
    }
    // else if (series.type === "grid") {
    else {
      return (
        <div className={styles.series} key={i}>
          {series.title && <div className={styles.seriesTitle}>
            <span>{series.title[langInd]}</span>
          </div>
          }
          {series.description && <div className={styles.seriesDescription}>
            {series.description[langInd]}
          </div>
          }
          <ResponsiveMasonry>
            {
              series.objIndex.map((ind) => {
                const nft = items[ind]
                if (nft) {
                  const { mimeType, uri } = nft.tokenInfo.formats[0]
                  return (
                    <Button
                      key={nft.tokenId}
                      to={`${PATH.AKAOBJ}/${nft.tokenId}`}
                    >
                      <div className={styles.gridItem}>
                        {
                          <RenderMedia
                            mimeType={mimeType}
                            uri={uri.split('//')[1]}
                            metadata={nft}
                            frameColor={nft.tokenInfo.frameColor}
                          ></RenderMedia>
                        }
                        {/* <div className={styles.number}>#{nft.tokenId}</div> */}
                      </div>
                    </Button>
                  )
                }
                else return <></>
              })
            }
          </ResponsiveMasonry>
        </div>
      )
    }
  }

  return (
    (curationInfo.isPrivate && curationInfo.vip.indexOf(address) < 0) ?
      <div className={styles.page}>
        <Page title={`${curationInfo.title[langInd]}`}>
          Currently not available
        </Page>
      </div>
      :
      <div className={styles.page}>
        <Page title={`${curationInfo.title[langInd]}`}>
          {loading && (
            <Container>
              <Padding>
                <Loading />
              </Padding>
            </Container>
          )}
          <Container full>
            <div className={styles.banner}>
              <img
                src={`/curation_banners/${curationInfo.image}`}
                alt={curationInfo.title[langInd]}
              />
            </div>
          </Container>
          <Container large>
            <Padding>
              <div className={styles.title}>{curationInfo.title[langInd]}</div>
            </Padding>
          </Container>

          <Container large>
            <Padding>
              <div className={styles.description}>{

                curationInfo.description[langInd].map((paragraph, i) => (
                  paragraph.indexOf('%HREF%') === 0 ?
                    <div className={styles.paragraph} key={i}><a href={paragraph.substring(7)}>{paragraph.substring(7)}</a></div> :
                    <div className={styles.paragraph} key={i}>{paragraph}</div>
                ))
              }</div>
            </Padding>
          </Container>

          <Container large>
            <div className={styles.container}>
              <Container xlarge>
                {
                  items.length < 1 &&
                  <div>
                    Sorry, no result found - "{curationId}"
                  </div>
                }
                {
                  curationInfo.series.map((series, i) => generateSeries(series, i))
                }
              </Container>
            </div>
          </Container>
        </Page>
      </div>
  )
}
