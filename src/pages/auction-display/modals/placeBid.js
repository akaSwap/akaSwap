import React, { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AkaSwapContext } from '../../../context/AkaSwapContext'
import { Container} from '../../../components/layout'
import { Loading } from '../../../components/loading'
import { Input } from '../../../components/input'
import { Button, SwapBtn } from '../../../components/button'
// import { getTotalSales } from '../../../utils/sanitise'
import styles from './styles.module.scss'
import { RenderMedia } from '../../../components/render-media'
import { MIMETYPE, MAX_AUCTION_PURCHASE_PRICE } from '../../../constants'
import { getLanguage } from '../../../constants'

export const PlaceBid = ({ currentBidPrice, akaObjId, originalCurrentBidPrice, startPrice, directPrice, owners, tokenInfo, onDone }) => {
  const language = getLanguage()
  const { id } = useParams()
  const { syncTaquito, acc, bidAll, bidTenPercent } = useContext(AkaSwapContext)

  // const [startPrice, setStartPrice] = useState()
  // const [usePurchasePrice, setUsePurchasePrice] = useState(false)
  // const [raiseRange, setRaiseRange] = useState()
  // const [purchasePrice, setPurchasePrice] = useState()
  // const [duration, setDuration] = useState()

  const [isBidAll, setBidAll] = useState(true)
  const [price, setPrice] = useState(currentBidPrice)
  const [pay, setPay] = useState(currentBidPrice)
  // const [percentage, setPercentage] = useState(0.1)
  // const sales = getTotalSales({ owners, creators: tokenInfo.creators })
  const [progress, setProgress] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = () => {

    if (acc == null) {
      syncTaquito().catch()
      return;
    }
    if (price < startPrice / 1000000 || !price || price === '') {
      alert(language.alert.priceLowerThanLimit)
    }
    // else if (!percentage || percentage === '') {
    //   alert(language.alert.emptyInput)
    // }
    else if (originalCurrentBidPrice !== 0 && (price < currentBidPrice)) {
      alert(language.alert.placeBidLimit)
    }
    else if (price >= directPrice / 1000000) {
      alert(language.alert.placeBidLimit2)
    }
    else {
      setProgress(true)
      setMessage('generating bid')
      // bidAll (auctionId, bidAmount)
      // bidTenPercent (auctionId, bidPrice, bidAmount)
      if (isBidAll) {
        bidAll(id, parseFloat(price) * 1000000, akaObjId).then((e) => {
          // when taquito returns a success/fail message
          setProgress(false)
          setMessage(e.description)
          onDone()
        })
          .catch((e) => {
            setProgress(false)
            setMessage('an error occurred')
          })
      }
      else {
        bidTenPercent(id, parseFloat(price) * 1000000, parseFloat(Math.floor((price * pay) * 1000000) / 1000000) * 1000000, akaObjId).then((e) => {
          // when taquito returns a success/fail message
          setProgress(false)
          setMessage(e.description)
          onDone()
        })
          .catch((e) => {
            setProgress(false)
            setMessage('an error occurred')
          })
      }
    }
  }
  // function selectPay(n) {
  //   setPay(Math.floor((price * n) * 1000000) / 1000000)
  // }


  return (

    <>
      <Container full>
        <div className={styles.placeBidPage}>
          <div className={styles.title}>{language.placeBid.title}</div>
          <div className={styles.thumbnail}>
            {<RenderMedia
              mimeType={MIMETYPE.JPEG}
              uri={tokenInfo.thumbnailUri.split('//')[1]}
              frameColor={tokenInfo.frameColor}
            ></RenderMedia>}
          </div>
          <div className={styles.flex}>
            <div>
              <div className={styles.label}>{language.placeBid.price}</div>
              <div>
                <div className={styles.price}>
                  <Input
                    type="number"
                    placeholder={currentBidPrice}
                    min={currentBidPrice}
                    max={MAX_AUCTION_PURCHASE_PRICE}
                    defaultValue={currentBidPrice}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={progress}
                  /></div>
                <div className={styles.sublabel}>{language.placeBid.price_sub}</div>
              </div>
            </div>
            <div>
              <div className={styles.label}>{language.placeBid.pay}</div>
              <div className={styles.payButton}>

                <div className={styles.pay + " " + (isBidAll ? styles.selected : '')}>
                  <Button onClick={(e) => { setPay(1.00); setBidAll(true); }}>{price} xtz</Button>
                  <div className={styles.sublabel}>{language.placeBid.pay_sub[0]}</div>
                </div>
                <div className={styles.pay + " " + (!isBidAll ? styles.selected : '')}>
                  <Button onClick={(e) => { setPay(0.1); setBidAll(false); }}>{Math.floor((price * 0.1) * 1000000) / 1000000} xtz</Button>
                  <div className={styles.sublabel}>{language.placeBid.pay_sub[1]}</div>
                </div>
              </div>

            </div>
          </div>

          <Button onClick={handleSubmit} disabled={progress}>
            <SwapBtn>{language.placeBid.cta}</SwapBtn>
          </Button>
          <div>
            <p>{message}</p>
            {progress && <Loading />}
          </div>
        </div>
      </Container>


    </>
  )
}
