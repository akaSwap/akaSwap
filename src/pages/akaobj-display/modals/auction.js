import React, { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AkaSwapContext } from '../../../context/AkaSwapContext'
import { Container } from '../../../components/layout'
import { Loading } from '../../../components/loading'
import { Button, SwapBtn } from '../../../components/button'
// import { getTotalSales } from '../../../utils/sanitise'
import styles from './styles.module.scss'
import { RenderMedia } from '../../../components/render-media'
import { AUCTION_RAISE_RANGE, MIMETYPE, MIN_SWAP_PRICE } from '../../../constants'
import { getLanguage, MAX_AUCTION_PURCHASE_PRICE } from '../../../constants'
import { prepareAuction } from '../../../data/ipfs'
import { ModalInputForm, ModalField } from '../../../components/input-form'

export const Auction = ({ totalAmount, owners, tokenInfo, address, onDone }) => {
  const language = getLanguage()
  const { id } = useParams()
  const { syncTaquito, makeAuction, acc } = useContext(AkaSwapContext)

  const [startPrice, setStartPrice] = useState(0)
  const [usePurchasePrice, setUsePurchasePrice] = useState(false)
  const [raiseRange, setRaiseRange] = useState(5)
  const [purchasePrice, setPurchasePrice] = useState(0)
  const [duration, setDuration] = useState(0)

  // const sales = getTotalSales({ owners, creators: tokenInfo.creators })
  const [progress, setProgress] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {

    if (acc === null) {
      await syncTaquito().catch()
      return;
    }
    if (!duration || duration === '' || duration < 1 || duration > 14 || duration % 1 !== 0) {
      alert(language.alert.duration + language.alert.mustBe + language.alert.integer + language.alert.rangeOf + "[1-14]")
      return;
    }
    if (startPrice < MIN_SWAP_PRICE / 1000000) {
      alert(language.alert.priceLowerThanLimit)
      return;
    }
    if (!raiseRange || raiseRange === '' || !startPrice || startPrice === '') {
      alert(language.alert.emptyInput)
      return
    }
    if ((usePurchasePrice && (!purchasePrice || purchasePrice === '' || purchasePrice < startPrice * 2))) {
      // simple validation for now
      alert(language.alert.purchasePriceLimit)
    } else {
      setProgress(true)
      setMessage('generating auction')
      // makeAuction is valid call API
      // (akaObjId, duration, directPrice, metadata, raisePercentage, startPrice)
      let directPrice = usePurchasePrice ? purchasePrice : MAX_AUCTION_PURCHASE_PRICE;
      let ipfsHash = await prepareAuction({
        title: tokenInfo.name,
        description: tokenInfo.description,
        address: acc.address
      })

      await makeAuction(id, duration, parseFloat(directPrice) * 1000000, ipfsHash.path, raiseRange, parseFloat(startPrice) * 1000000)
        .then((e) => {
          // when taquito returns a success/fail message
          setProgress(false)
          setMessage(e.description)
          onDone()
          //history.push(`${PATH.ISSUER}/${address}`)
        })
        .catch((e) => {
          setProgress(false)
          window.location.reload()
          setMessage('an error occurred')
        })
    }



  }

  return (

    <>
      <Container full>
        <div className={styles.auctionPage}>
          <div className={styles.title}>{language.detail.auction.title}</div>
          <div className={styles.thumbnail}>
            {<RenderMedia
              mimeType={MIMETYPE.JPEG}
              uri={tokenInfo.thumbnailUri.split('//')[1]}
              frameColor={tokenInfo.frameColor}
            ></RenderMedia>}
          </div>
          <ModalInputForm>
            <ModalField
              labelRow={language.detail.auction.label.startPrice}
              hint={language.detail.auction.subLabel.startPrice}
              type="number"
              placeholder={language.detail.auction.placeholder.startPrice}
              min={0}
              defaultValue={0}
              onChange={(e) => setStartPrice(e.target.value)}
              disabled={progress}
            />
            <ModalField
              labelRow={language.detail.auction.label.setPurchasePrice}
              hint={language.detail.auction.subLabel.setPurchasePrice}
              type="checkbox"
              onChange={(e) => {
                setUsePurchasePrice(e.target.checked)
                // setFrameColor(e.target.checked? "#202125":null)
              }}
              value={usePurchasePrice}
              checked={usePurchasePrice}
            />
            {usePurchasePrice &&
              <ModalField
                labelRow={language.detail.auction.label.purchasePrice}
                hint={language.detail.auction.subLabel.purchasePrice}
                type="number"
                placeholder={language.detail.auction.placeholder.purchasePrice}
                min={0}
                onChange={(e) => setPurchasePrice(e.target.value)}
                disabled={progress}
              />
            }
            <ModalField
              labelRow={language.detail.auction.label.raise}
              hint={language.detail.auction.subLabel.raise}
            >
              <button
                onClick={(e) => { console.log(raiseRange); setRaiseRange(e.target.value) }}
                value={AUCTION_RAISE_RANGE[0]}
                className={styles.raiseBtn + ' ' + (raiseRange === AUCTION_RAISE_RANGE[0] ? styles.selected : '')}
              >{AUCTION_RAISE_RANGE[0]}%</button>
              <button
                onClick={(e) => setRaiseRange(e.target.value)}
                value={AUCTION_RAISE_RANGE[1]}
                className={styles.raiseBtn + ' ' + (raiseRange === AUCTION_RAISE_RANGE[1] ? styles.selected : '')}
              >{AUCTION_RAISE_RANGE[1]}%</button>
              <button
                onClick={(e) => setRaiseRange(e.target.value)}
                value={AUCTION_RAISE_RANGE[2]}
                className={styles.raiseBtn + ' ' + (raiseRange === AUCTION_RAISE_RANGE[2] ? styles.selected : '')}
              >{AUCTION_RAISE_RANGE[2]}%</button>

            </ModalField>
            <ModalField
              labelRow={language.detail.auction.label.duration}
              hint={language.detail.auction.subLabel.duration}
              type="number"
              placeholder={language.detail.auction.placeholder.duration}
              min={0}
              max={14}
              onChange={(e) => setDuration(e.target.value)}
              disabled={progress}
            />
          </ModalInputForm>
          {//deprecated
            //<table className={styles.table}>
            //  <tbody>
            //    <tr className={styles.row}>
            //      <td className={styles.label}>{language.detail.auction.label.startPrice}</td>
            //      <td rowspan="2" className={styles.input}>
            //        <Input
            //          type="number"
            //          placeholder={language.detail.auction.placeholder.startPrice}
            //          min={0}
            //          defaultValue={0}
            //          onChange={(e) => setStartPrice(e.target.value)}
            //          disabled={progress}
            //        />
            //      </td>
            //    </tr>
            //    <tr className={styles.subrow}>
            //      <td>
            //        {language.detail.auction.subLabel.startPrice}
            //      </td >
            //    </tr>
            //    <tr className={styles.row}>
            //      <td className={styles.label}>{language.detail.auction.label.setPurchasePrice}</td>
            //      <td rowspan="2">
            //        <CheckBox
            //          type="checkbox"
            //          onChange={(e) => {
            //            setUsePurchasePrice(e.target.checked)
            //            // setFrameColor(e.target.checked? "#202125":null)
            //          }}
            //          value={usePurchasePrice}
            //          checked={usePurchasePrice}
            //        />
            //      </td>
            //    </tr>
            //    <tr className={styles.subrow}>
            //      <td>
            //        {language.detail.auction.subLabel.setPurchasePrice}
            //      </td>
            //    </tr>
            //    {usePurchasePrice && (
            //      <>
            //        <tr className={styles.row}>
            //          <td className={styles.label}>{language.detail.auction.label.purchasePrice}</td>
            //          <td rowspan="2" className={styles.input}>
            //            <Input
            //              type="number"
            //              placeholder={language.detail.auction.placeholder.purchasePrice}
            //              min={0}
            //              onChange={(e) => setPurchasePrice(e.target.value)}
            //              disabled={progress}
            //            />
            //          </td>
            //        </tr>
            //        <tr className={styles.subrow}>
            //          <td>
            //            {language.detail.auction.subLabel.purchasePrice}
            //          </td>
            //        </tr>
            //      </>
            //    )}
            //    <tr className={styles.row}>
            //      <td className={styles.label}>{language.detail.auction.label.raise}</td>
            //      <td rowspan="2" className={styles.raise}>
            //        <button
            //          onClick={(e) => { setRaiseRange(e.target.value) }}
            //          value={AUCTION_RAISE_RANGE[0]}
            //          className={styles.raiseBtn + ' ' + raiseRange === AUCTION_RAISE_RANGE[0] ? styles.selected : ''}
            //        >{AUCTION_RAISE_RANGE[0]}%</button>
            //        <button
            //          onClick={(e) => setRaiseRange(e.target.value)}
            //          value={AUCTION_RAISE_RANGE[1]}
            //          className={styles.raiseBtn + ' ' + raiseRange === AUCTION_RAISE_RANGE[1] ? styles.selected : ''}
            //        >{AUCTION_RAISE_RANGE[1]}%</button>
            //        <button
            //          onClick={(e) => setRaiseRange(e.target.value)}
            //          value={AUCTION_RAISE_RANGE[2]}
            //          className={styles.raiseBtn + ' ' + raiseRange === AUCTION_RAISE_RANGE[2] ? styles.selected : ''}
            //        >{AUCTION_RAISE_RANGE[2]}%</button>
            //        {//<Slider
            //          // type="range"
            //          // min={1}
            //          // max={3}
            //          // label={["5%","10%","20%"]}
            //          // step={1}
            //          // value={raiseRange}
            //          // onChange={(e) => {
            //          //   setRaiseRange(e.target.value)
            //          // }}
            //          // />
            //        }
            //      </td>
            //    </tr>
            //    <tr className={styles.subrow}>
            //      <td>
            //        {language.detail.auction.subLabel.raise}
            //      </td>
            //    </tr>
            //
            //    <tr className={styles.row}>
            //      <td className={styles.label}>{language.detail.auction.label.duration}</td>
            //      <td rowspan="2" className={styles.input}>
            //        <Input
            //          type="number"
            //          placeholder={language.detail.auction.placeholder.duration}
            //          min={0}
            //          max={14}
            //          onChange={(e) => setDuration(e.target.value)}
            //          disabled={progress}
            //        />
            //      </td>
            //    </tr>
            //    <tr className={styles.subrow}>
            //      <td>
            //        {language.detail.auction.subLabel.duration}
            //      </td>
            //    </tr>
            //  </tbody>
            //</table>
          }
          <Container full>
            <p className={styles.detail}>{language.detail.auction.warning}
              {" - "}
              <a className={styles.link} href="/about/#auctionrules">here</a>
            </p>
          </Container>
          <Button onClick={handleSubmit} disabled={progress}>
            <SwapBtn>{language.detail.auction.cta}</SwapBtn>
          </Button>
          <div>
            <p>{message}</p>
            {progress && <Loading />}
          </div>
        </div>
      </Container >


    </>
  )
}
