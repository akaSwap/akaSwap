/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AkaSwapContext } from '../../context/AkaSwapContext'
// import { InfoDetailContainer, InfoDetailItem, InfoDetailTimer } from '../../components/info-detail'
import { InfoDetailContainer, InfoDetailItem } from '../../components/info-detail'
import { GetAuction } from '../../data/api'
import { Loading } from '../../components/loading'
import { useHistory } from 'react-router'
import { Page, Container } from '../../components/layout'
import { RenderMedia } from '../../components/render-media'
import { Button } from '../../components/button'
import { PlaceBid } from './modals'
import { PATH } from '../../constants'
import { getDeltaSecond, getISOString } from '../../datetime'
import { showWallet } from '../../utils/string'
import styles from './styles.module.scss'
import { getLanguage, MAX_AUCTION_PURCHASE_PRICE } from '../../constants'
import { Timer } from '../../components/timer'
import Modal from 'react-modal'
import { RecordListContainer, RecordsList } from '../../components/records'


export const AuctionDisplay = () => {
  const language = getLanguage()
  const { id } = useParams()
  const context = useContext(AkaSwapContext)
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  const [auction, setAuction] = useState()
  const [bidRecords, setBidRecords] = useState([])
  const [isBidModalOpen, setBidModalOpen] = useState(false)
  const [isNothing, setIsNothing] = useState(true)
  const address = context.acc?.address
  function toggleBidModal() {
    if (context.acc === null) {
      context.syncTaquito().catch()
      return
    }
    setBidModalOpen(!isBidModalOpen)
  }
  function toggleBidModalandRefresh() {
    setBidModalOpen(!isBidModalOpen)
    window.location.reload()
  }
  function handleDiscontinue(event) {
    if (context.acc === null) {
      context.syncTaquito().catch()
      return
    }
    event.target.disabled = true
    context
      .cancelAuction(parseInt(auction.auctionId))
      .then((e) => {
        console.log('Discontinue confirm', e)
        history.push('/sync')
        event.target.disabled = false
      })
      .catch((e) => {
        console.log('Discontinue error', e)
        alert('an error occurred')
      })
  }
  function handlePayRemaining(event) {
    if (context.acc === null) {
      context.syncTaquito().catch()
      return
    }
    event.target.disabled = true
    context
      .fillBid(
        parseInt(auction.auctionId),
        parseFloat(auction.currentBidPrice - auction.currentStorePrice)
      )
      .then((e) => {
        console.log('Pay remaining confirm', e)
        window.location.reload()
      })
      .catch((e) => {
        console.log('Pay remaining error', e)
        alert('an error occurred')
        event.target.disabled = false
      })
  }
  function handleDirectPurchase(event) {
    if (context.acc === null) {
      context.syncTaquito().catch()
      return
    }
    event.target.disabled = true
    context
      .directPurchase(
        parseInt(auction.auctionId),
        parseFloat(auction.directPrice),
        parseInt(auction.tokenId)
      )
      .then((e) => {
        console.log('direct purchase confirm', e)
        history.push('/sync')
        event.target.disabled = false
      })
      .catch((e) => {
        console.log('direct purchase error', e)
        alert('an error occurred')
        event.target.disabled = false
      })
  }
  function handleClosed(event) {
    if (context.acc === null) {
      context.syncTaquito().catch()
      return
    }
    event.target.disabled = true
    context
      .closeAuction(parseInt(auction.auctionId))
      .then((e) => {
        console.log('Auction close confirm', e)
        event.target.disabled = false
        history.push('/sync')
      })
      .catch((e) => {
        console.log('Auction close error', e)
        alert('an error occurred')
        event.target.disabled = false
      })
  }
  function handleFailedClosed(event) {
    if (context.acc === null) {
      context.syncTaquito().catch()
      return
    }
    event.target.disabled = true
    context
      .failCloseAuction(parseInt(auction.auctionId))
      .then((e) => {
        console.log('Auction fail close confirm', e)
        event.target.disabled = false
        history.push('/sync')
      })
      .catch((e) => {
        console.log('Auction fail close error', e)
        alert('an error occurred')
        event.target.disabled = false
      })
  }
  const calculatePrice = () => {
    return (
      Math.ceil(
        auction.currentBidPrice === 0
          ? auction.startPrice
          : auction.currentBidPrice * (1 + auction.raisePercentage * 0.01)
      ) / 1000000
    )
  }
  const getRecord = (bidRecords) => {
    if (bidRecords.length < 0) { return null }
    return bidRecords.map((record, i) => {
      var issuer = {
        text: showWallet({ wallet: record.bidder, alias: record.alias }),
        link: `${PATH.ISSUER}/${record.bidder}`
      }
      var price = { text: `${record.bidPrice / 1000000} xtz` }
      var date = {
        text: new Date(record.timestamp * 1000).toLocaleString([], { hour12: false, })
      }
      return [date, issuer, price]
    })
  }
  useEffect(() => {
    GetAuction({ id }).then(async (result) => {
      await context.setAccount().catch()

      if (result === undefined) {
        setIsNothing(true)
        history.replace('/auction')
      } else {
        setBidRecords(result.priceHistory)
        setAuction(result)
        setIsNothing(false)
      }
      setLoading(false)
    })
  }, [])

  return (
    <Page title={auction?.tokenInfo.name}>
      {loading && (
        <Container>
          <Loading />
        </Container>
      )}

      {!loading &&
        (isNothing ? (
          <>Please refresh the page</>
        ) : (
          <>
            <Container large>
              <div className={styles.page}>
                <div className={styles.row}>
                  <Container full>
                    {auction.tokenId !== undefined &&
                      <RenderMedia
                        mimeType={auction.tokenInfo.formats[0].mimeType}
                        uri={auction.tokenInfo.formats[0].uri.split('//')[1]}
                        interactive={true}
                        metadata={auction}
                        frameColor={auction.tokenInfo.frameColor}
                        isDetailed={true}
                      />}
                  </Container>
                  <Container xlarge>
                    <div className={styles.info}>
                      <div className={styles.title}>
                        {getDeltaSecond(auction.dueTime) > 0 && (
                          <>
                            {language.auction.countdown}&nbsp;
                            {
                              <div className={styles.titleTime}>
                                <Timer
                                  seconds={getDeltaSecond(auction.dueTime)}
                                  type="dhms"
                                ></Timer>
                              </div>
                            }
                          </>
                        )}
                        {getDeltaSecond(auction.dueTime) <= 0 && (
                          <>{language.auction.end}</>
                        )}
                      </div>
                      <InfoDetailContainer
                        title={auction.tokenInfo.name}>
                        {/* <InfoDetailTimer
                          text={
                            getDeltaSecond(auction.dueTime) > 0
                              ? language.auction.countdown
                              : ''
                          }
                          time={
                            getDeltaSecond(auction.dueTime) > 0 ?
                              auction.dueTime : null
                          }
                        /> */}
                        <InfoDetailItem
                          description={auction.tokenInfo.description}
                        />
                        <InfoDetailItem
                          subtitle={language.detail.akaObj}
                          content={" #" + auction.tokenId}
                        />
                        <Container full>
                          <div className="divider"></div>
                        </Container>
                        <InfoDetailItem
                          subtitle={language.auction.auctionId}
                          content={" #" + auction.auctionId}
                        />
                        <InfoDetailItem
                          subtitle={language.detail.info.auctionDueTime + ":"}
                          content={getISOString(auction.dueTime, "yyyy-mm-dd hh:mm")}
                        />
                        <InfoDetailItem
                          subtitle={language.auction.startPrice + ":"}
                          content={auction.startPrice / 1000000 + " xtz"}
                        />
                        <InfoDetailItem
                          subtitle={language.auction.raisePercentage + ":"}
                          content={auction.raisePercentage + "%"}
                        />
                        <InfoDetailItem
                          subtitle={language.detail.info.issuer + ":"}
                          path={`${PATH.ISSUER}/${auction.issuer}`}
                          content={showWallet({ wallet: auction.issuer, full: false, alias: auction.aliases })}
                        />
                        <div className={styles.buttons}>
                          {getDeltaSecond(auction.dueTime) <= 0 ? (
                            // if remaining time <= 0
                            auction.currentBidPrice === 0 &&
                              address === auction.issuer ? ( // no bid and is issuer
                              <div>
                                <Button onClick={handleDiscontinue}>
                                  {language.auction.discontinue}
                                </Button>
                              </div>
                            ) : auction.currentBidPrice >
                              auction.currentStorePrice ? (
                              // have remaining pay
                              address === auction.currentBidder ? ( // is current bidder
                                <div>
                                  <div className={styles.price}>
                                    {(auction.currentBidPrice -
                                      auction.currentStorePrice) /
                                      1000000 +
                                      ' xtz'}
                                  </div>
                                  <Button
                                    onClick={handlePayRemaining}
                                    className={styles.button}
                                  >
                                    {language.auction.payIt}
                                  </Button>
                                </div>
                              ) : address === auction.issuer ? ( // not current bidder and is auctio issuer
                                getDeltaSecond(auction.dueTime) <= -86400 ? ( // time over 24 hr
                                  <div>
                                    <Button onClick={handleFailedClosed}>
                                      {language.auction.failed}
                                    </Button>
                                  </div>
                                ) : (
                                  // not over 24 hr
                                  <div>{language.auction.waiting}</div>
                                )
                              ) :
                                // (
                                //   <div className={styles.buttonPrice}> {language.auction.auctionResults}:
                                //     <div className={styles.price}>
                                //       {auction.currentBidPrice === 0
                                //         ? <span className={styles.digit}>{language.auction.auctionPass}</span>
                                //         :
                                //         <>
                                //           <span className={styles.digit}>{(auction.currentBidPrice / 1000000).toString()}</span>
                                //           xtz
                                //         </>
                                //       }
                                //     </div>
                                //   </div>
                                // )
                                null
                              // not current bidder and not issuer
                            ) : // no remaining pay
                              address === auction.currentBidder ||
                                address === auction.issuer ? (
                                // is bidder or issuer
                                <div>
                                  <Button onClick={handleClosed}>
                                    {language.auction.closed}
                                  </Button>
                                </div>
                              ) :
                                // (
                                //   <div className={styles.buttonPrice}> {language.auction.auctionResults}:
                                //     <div className={styles.price}>
                                //       {auction.currentBidPrice === 0
                                //         ? <span className={styles.digit}>{language.auction.auctionPass}</span>
                                //         :
                                //         <>
                                //           <span className={styles.digit}>{(auction.currentBidPrice / 1000000).toString()}</span>
                                //           xtz
                                //         </>
                                //       }
                                //     </div>
                                //   </div>
                                // )
                                null
                            // not bidder and not issuer
                          ) : (
                            // if remaining time > 0
                            <div>
                              <div className={styles.buttonPrice}>
                                {
                                  auction.directPrice / 1000000 !== MAX_AUCTION_PURCHASE_PRICE &&
                                  <>
                                    {language.auction.purchasePrice}:
                                    <div className={styles.price}>
                                      <span className={styles.digit}>{(auction.directPrice / 1000000).toString()}</span> xtz
                                    </div>
                                  </>
                                }
                              </div>
                              {/* <div className={styles.price}>
                          {auction.directPrice / 1000000 !==
                            MAX_AUCTION_PURCHASE_PRICE
                            ? (auction.directPrice / 1000000).toString() + 'xtz'
                            : ''}
                        </div> */}
                              {auction.directPrice / 1000000 !==
                                MAX_AUCTION_PURCHASE_PRICE ? (
                                //can direct purchase
                                <Button
                                  className={styles.button}
                                  onClick={handleDirectPurchase}
                                  disabled={auction.issuer === address}
                                >
                                  {language.auction.buy}
                                </Button>
                              ) : (
                                //cannot direct purchase
                                <Button className={styles.button} disabled>
                                  {language.auction.noDirectSales}
                                </Button>
                              )}
                              <div className={styles.buttonPrice}>
                                <span className="subTitle">{language.auction.currentBidPrice}:</span>
                                <div className={styles.price}>
                                  {auction.currentBidPrice === 0
                                    ? <span className={styles.digit}>{language.auction.noBid}</span>
                                    :
                                    <>
                                      <span className={styles.digit}>{(auction.currentBidPrice / 1000000).toString()}</span> xtz
                                    </>
                                  }
                                </div>
                              </div>
                              {auction.issuer === address ? (
                                // is issuer
                                <Button
                                  onClick={handleDiscontinue}
                                  className={styles.button}
                                  disabled={auction.currentBidPrice !== 0}
                                >
                                  {language.auction.discontinue}
                                </Button>
                              ) : // not issuer
                                auction.currentBidder === address &&
                                  auction.currentBidPrice >
                                  auction.currentStorePrice ? (
                                  // is bidder and have remaining payment
                                  <div className={styles.bidder}>
                                    <Button
                                      onClick={toggleBidModal}
                                      className={styles.button}
                                    >
                                      {language.auction.placeBid}
                                    </Button>
                                    <Button
                                      onClick={handlePayRemaining}
                                      className={styles.button}
                                    >
                                      {language.auction.pay +
                                        (auction.currentBidPrice -
                                          auction.currentStorePrice) /
                                        1000000 +
                                        ' xtz'}
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    onClick={toggleBidModal}
                                    className={styles.button}
                                  >
                                    {language.auction.placeBid}
                                  </Button>
                                )}
                            </div>
                          )}
                        </div>
                      </InfoDetailContainer>

                    </div>

                  </Container>
                </div>
              </div>
            </Container>

            {
              <Container large>
                <RecordListContainer>
                  <RecordsList
                    title={language.auction.bidRecords}
                    records={getRecord(bidRecords)}
                    grids={[7, 3, 2, 2]}
                    rwdGrids={[8, 4, 2, 2]}
                  />
                </RecordListContainer>
              </Container>
            }
            <Modal
              isOpen={isBidModalOpen}
              onRequestClose={toggleBidModal}
              contentLabel="Bid Modal"
              className={styles.bidModal}
              overlayClassName={styles.modalOverlay}
              ariaHideApp={false}

            >
              <Button onClick={toggleBidModal}>x</Button>
              {
                <PlaceBid
                  currentBidPrice={calculatePrice()}
                  akaObjId={auction.tokenId}
                  originalCurrentBidPrice={auction.currentBidPrice}
                  startPrice={auction.startPrice}
                  directPrice={auction.directPrice}
                  tokenInfo={auction.tokenInfo}
                  onDone={toggleBidModalandRefresh}
                ></PlaceBid>
              }
            </Modal>
          </>
        ))}
    </Page>
  )
}
