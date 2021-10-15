/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import { GetGacha, GetGachaRecords } from '../../data/api'
import { Loading } from '../../components/loading'
import { Page, Container, Padding } from '../../components/layout'
import { getDeltaSecond, getISOString } from '../../datetime'
import { InfoDetailItem, InfoDetailContainer, InfoDetailTimer, InfoDetailCol } from '../../components/info-detail'
import { GachaCarousel } from '../../components/render-carousel'
import { Hint } from '../../components/hint'
import { PATH } from '../../constants'
import { showWallet, limitLength } from '../../utils/string'
import styles from './styles.module.scss'
import { getLanguage } from '../../constants'
import { Input } from '../../components/input'
import { ReactComponent as ToggleIcon } from './img/toggle.svg'
import { GetIpfsLink } from '../../data/api'
import { ItemList } from '../../components/item-list'
import { RecordsList } from '../../components/records'


export const GachaDisplay = () => {
  const { id } = useParams()
  const context = useContext(AkaSwapContext)
  const history = useHistory()
  const language = getLanguage()
  const [amount, setAmount] = useState(1)
  const [loading, setLoading] = useState(true)
  const [gacha, setGacha] = useState([])
  const [prizes, setPrizes] = useState([])
  const [lastPrize, setLastPrize] = useState()
  const [title, setTitle] = useState("")
  const [records, setRecords] = useState([])
  const [recordsLoading, setRecordsLoading] = useState(false)
  const [isShowRecordList, setIsShowRecordList] = useState(false)
  const [thumbnails, setThumbnails] = useState([])
  const [lastThumbnail, setLastThumbnail] = useState({})
  const [isNothing, setIsNothing] = useState(true)

  const [isMounted, setIsMounted] = useState(true);
  useEffect(() => {
    GetGacha({ id }).then(async (data) => {
      await context.setAccount().catch()

      if (isMounted) {
        if (data.gacha === undefined) {
          setIsNothing(true)
          history.replace('/gachalist')
        } else {
          setGacha(data.gacha)
          setTitle(data.gacha.metadata.title)
          data.gacha.gachaItems.sort((a, b) => {
            if (a.total > b.total) return 1
            else if (a.total < b.total) return -1
            else
              return (a.tokenId > b.tokenId) ? 1 : -1
          });
          setPrizes(data.gacha.gachaItems)
          setLastPrize(data.gacha.lastPrize)

          getDiaplayData(data.gacha)
            .then(res => {
              if (isMounted) {
                setThumbnails(res.thumbnails)
                setLastThumbnail(res.lastThumbnail)
              }
            })
            .catch()

          setIsNothing(false)
        }
        setLoading(false)
      }
    })
    return () => { setIsMounted(false) }
  }, [])

  const handleCollectGacha = async (event) => {
    if (amount < 0 || amount > 10 || amount % 1 !== 0) {
      alert(language.alert.gachaDrawLimit)
      return;
    }
    if (amount > gacha.gachaAmount) {
      alert(language.alert.noEnoughGachas)
      return;
    }

    if (context.acc == null) {
      context.syncTaquito().catch()
      return;
    }
    event.target.disabled = true
    context.collectGacha(amount, gacha.gachaId, gacha.xtzPerGacha * amount)
      .then((e) => {
        console.log('make gacha confirm', e)
        history.push("/sync")
        event.target.disabled = false
      })
      .catch((e) => {
        console.log('make gacha error', e)
        alert('an error occurred')
      })
  }

  const handleCancelGacha = async (event) => {
    if (context.acc == null) {
      context.syncTaquito().catch()
      return;
    }
    event.target.disabled = true
    context.cancelGacha(gacha.gachaId)
      .then((e) => {
        console.log('gacha canceled confirm', e)
        history.push("/sync")
        event.target.disabled = false
      }).catch((e) => {
        console.log('gacha canceled error', e)
        alert('an error occurred')
      })
  }

  // const getThumbnailData = async (item) => {
  //   const [thumbnails, lastThumbnail] = await Promise.all([
  //     await Promise.all(item.gachaItems.map(async (token) => {
  //       return ({
  //         uri: await GetIpfsLink(token.tokenInfo.thumbnailUri.split('//')[1]),
  //         frame: token.tokenInfo.frameColor
  //       })
  //     })),
  //     {
  //       uri: await GetIpfsLink(item.lastPrize.tokenInfo.thumbnailUri.split('//')[1]),
  //       frame: item.lastPrize.tokenInfo.frameColor
  //     }
  //   ])
  //   return { thumbnails, lastThumbnail }
  // }

  const getDiaplayData = async (item) => {
    const [displays, lastDisplay] = await Promise.all([
      await Promise.all(item.gachaItems.map(async (token) => {
        return ({
          uri: await GetIpfsLink(token.tokenInfo.displayUri.split('//')[1]),
          frame: token.tokenInfo.frameColor
        })
      })),
      {
        uri: await GetIpfsLink(item.lastPrize.tokenInfo.displayUri.split('//')[1]),
        frame: item.lastPrize.tokenInfo.frameColor
      }
    ])
    return { thumbnails: displays, lastThumbnail: lastDisplay }
  }

  const showRecordList = () => {
    if (isMounted) {
      setIsShowRecordList(true)
      setRecordsLoading(true)
      GetGachaRecords({ id }).then(async (data) => {
        setRecords(data.records)
        setRecordsLoading(false)
      })
    }
  }
  const getRecords = (records) => {
    if (!records.length > 0) {
      return null
    }
    return records.map((record) => {
      var date = { text: new Date(record.timestamp * 1000).toLocaleString([], { hour12: false }) };
      var issuer = {
        text: showWallet({ wallet: record.collector, alias: record.alias }),
        link: `${PATH.ISSUER}/${record.collector}`
      };
      var tokenName = {
        text: limitLength(record.tokenName),
        link: `${PATH.AKAOBJ}/${record.tokenId}`
      }
      var amount = { text: `${record.amount}x` }
      return [date, issuer, tokenName, amount]
    })
  }

  const detail = {
    "issuer": gacha.issuer,
    "issuerAlias": gacha.alias,
    "issueTime": gacha.issueTime,
    "cancelTime": gacha.cancelTime,
    "remaining": gacha.gachaAmount,
    "total": gacha.gachaTotal,
    "xtzPerGacha": gacha.xtzPerGacha
  }

  // const control = () => {
  //   var price
  //   if (getDeltaSecond(gacha.issueTime) > 0) {
  //     price = "Coming Soon"
  //   }
  //   if ((gacha.gachaAmount > 0) && (getDeltaSecond(gacha.cancelTime) > 0) && (getDeltaSecond(gacha.issueTime) <= 0) && (gacha.issuer != context.acc?.address)) {
  //     amount = { input: (e) => { setAmount(e.target.value) } }
  //     price = {
  //       onClick: handleCollectGacha,
  //       text: (language.gacha.drawfor).replace("%Price%", gacha.xtzPerGacha * amount / 1000000)
  //     }
  //   }
  // }

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
                  <GachaCarousel
                    imgs={thumbnails}
                    lastPrize={lastThumbnail}
                  />
                </div>
                <div className={styles.right}>
                  <div className={styles.main}>
                    <InfoDetailContainer
                      title={gacha.metadata.title}
                    >
                      <InfoDetailCol>
                        <InfoDetailTimer
                          time={
                            getDeltaSecond(detail.issueTime) > 0 ?
                              detail.issueTime :
                              (getDeltaSecond(detail.cancelTime) > 0 && (detail.remaining > 0)) ?
                                detail.cancelTime : null
                          }
                          text={
                            getDeltaSecond(detail.issueTime) > 0 ?
                              language.detail.info.scheduled :
                              getDeltaSecond(detail.cancelTime) <= 0 ?
                                language.detail.info.end :
                                detail.remaining > 0 ?
                                  language.detail.info.countdown :
                                  language.detail.info.soldOut
                          }
                        />
                        <InfoDetailItem
                          subtitle={language.detail.info.description}
                          content={gacha.metadata.description}
                          inline={false}
                          opaque
                        />
                        <InfoDetailItem
                          subtitle={language.detail.info.issuer}
                          content={showWallet({ wallet: detail.issuer, full: false, alias: detail.issuerAlias })}
                          path={`${PATH.ISSUER}/${detail.issuer}`}
                          inline={false}
                        />
                        <InfoDetailItem
                          subtitle={language.detail.info.gachaDuration}
                          content={`${getISOString(detail.issueTime, "yyyy-mm-dd hh:mm")}  ~  ${getISOString(detail.cancelTime, "yyyy-mm-dd hh:mm")}`}
                          inline={false}
                        />
                        <InfoDetailItem
                          subtitle={language.detail.info.remain + " / " + language.detail.info.total}
                          content={detail.remaining + " / " + detail.total}
                          inline={false}
                        />
                        <InfoDetailItem
                          subtitle={language.detail.info.gachaPrice}
                          content={`${detail.xtzPerGacha / 1000000} xtz`}
                          inline={false}
                        />
                      </InfoDetailCol>
                      <div className={styles.controll}>
                        {
                          (getDeltaSecond(gacha.issueTime) > 0) &&
                          <>
                            <div className={styles.button}>
                              <button className={styles.price}>
                                {language.detail.comingSoon}
                              </button>
                            </div>
                          </>
                        }
                        {
                          (gacha.gachaAmount > 0) && (getDeltaSecond(gacha.cancelTime) > 0) && (getDeltaSecond(gacha.issueTime) <= 0) && (gacha.issuer !== context.acc?.address) &&
                          <>
                            <div className={styles.button}>
                              <div className={styles.amount}>
                                <Input
                                  type="number"
                                  min={1}
                                  max={gacha.gachaAmount < 10 ? gacha.gachaAmount : 10}
                                  onChange={(e) => {
                                    setAmount(e.target.value)
                                  }}
                                  placeholder=""
                                  label=""
                                  value={amount}
                                />
                              </div>
                              <button className={styles.price} onClick={handleCollectGacha}>
                                {(language.gacha.drawfor).replace("%Price%", gacha.xtzPerGacha * amount / 1000000)}
                              </button>
                            </div>
                          </>
                        }
                        {
                          // enable to cancel within 20 mins after issued
                          (-getDeltaSecond(gacha.issueTime) / 60 <= 20) && (gacha.issuer === context.acc?.address) &&
                          <>
                            <div className={styles.button}>
                              <button className={styles.cancelGacha} onClick={handleCancelGacha}>
                                {language.gacha.discontinue}
                              </button>
                            </div>
                            <span className={styles.comment}>
                              (&nbsp;
                              {(language.gacha.minLeft).replace("%TIME%", getISOString(gacha.issueTime + 60 * 20).substring(0, 16))}
                              <Hint hoverMessage={language.gacha.discontinueHint} />
                              &nbsp;)
                            </span>
                          </>
                        }
                        {
                          // enable to cancel after cancel time
                          (getDeltaSecond(gacha.cancelTime) <= 0) && (gacha.issuer === context.acc?.address) &&
                          <>
                            <div className={styles.button}>
                              <button className={styles.cancelGacha} onClick={handleCancelGacha}>
                                {language.gacha.discontinue}
                              </button>
                            </div>
                          </>
                        }
                      </div>
                    </InfoDetailContainer>
                  </div>

                </div>
              </div>
            </Container>
            <ItemList
              description={(getDeltaSecond(gacha.cancelTime) > 0) ? language.gacha.description : ""}
              datas={[
                {
                  title: language.gacha.prizes,
                  items: prizes,
                  thumbnails: thumbnails,
                  detailType: "totalRemain"
                },
                {
                  title: language.gacha.lastPrizes,
                  items: [lastPrize],
                  thumbnails: [lastThumbnail],
                  detailType: "lastPrize"
                }
              ]}
            />
            <Container xlarge>

            </Container>
            {recordsLoading && (
              <Container>
                <Loading />
              </Container>
            )}
            {!recordsLoading && (
              <>
                {records.length === 0 && !isShowRecordList && (
                  <div className={styles.showRecordListButton}>
                    <button onClick={showRecordList}>
                      Show Records <ToggleIcon />
                    </button>
                  </div>
                )}

                {isShowRecordList && (
                  <Container full>
                    <Padding>

                      <div className={styles.recordList}>
                        <RecordsList
                          records={getRecords(records)}
                          title={language.detail.records.title}
                          grids={[8, 3, 2, 2, 1]}
                          rwdGrids={[6, 4, 2, 2, 1]}
                        />
                      </div>
                    </Padding>

                  </Container>
                )}
              </>
            )}
          </Container>
        ))}
    </Page>
  )
}
