import React, { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AkaSwapContext } from '../../../context/AkaSwapContext'
import { Container, Padding } from '../../../components/layout'
import { Loading } from '../../../components/loading'
import { Input } from '../../../components/input'
import { ModalInputForm, ModalField } from '../../../components/input-form'
import { Hint } from '../../../components/hint'
import { Button, SwapBtn } from '../../../components/button'
import { getTotalSales } from '../../../utils/sanitise'
import styles from './styles.module.scss'
import { RenderMedia } from '../../../components/render-media'
// import { MIMETYPE, MIN_SWAP_PRICE, SWAP_SHARER_LIMIT } from '../../../constants'
import { MIMETYPE, MIN_SWAP_PRICE } from '../../../constants'
import { getLanguage } from '../../../constants'
// import { Sharer } from '../../../components/sharer'

export const Swap = ({ totalAmount, owners, tokenInfo, address, onDone }) => {
  const language = getLanguage()
  const { id } = useParams()
  const { syncTaquito, acc, swap } = useContext(AkaSwapContext)
  const [amount, setAmount] = useState(1)
  const [price, setPrice] = useState()
  const sales = getTotalSales({ owners, creators: tokenInfo.creators })
  const [progress, setProgress] = useState(false)
  const [message, setMessage] = useState('')
  const [useSwapShare, setUseSwapShare] = useState(null)
  const [sharerId, setSharerId] = useState(1)
  const [swapShare, setSwapShare] = useState(false)
  const [useSwapByRoyalties, setUseSwapByRoyalties] = useState()
  const [swapSharers, setSwapSharer] = useState([{
    id: 0,
    address: 'Owner',
    share: 100
  }])

  useEffect(() => {
    if ((tokenInfo.creators.length > 1) && (tokenInfo.creators[0] === acc?.address)) {
      if (tokenInfo.creators.length > 1) {
        setSharerId(tokenInfo.creators.length)
        let array = []
        let totalShares = tokenInfo.creatorShares.reduce((a, b) => a + b)
        for (var i = 0; i < tokenInfo.creators.length; i++) {
          array.push({
            id: i,
            address: i === 0 ? 'Owner' : tokenInfo.creators[i],
            share: (tokenInfo.creatorShares[i] / totalShares).toFixed(2) * 100
          })
        }
        var totalPercentage = 0;
        for (var j = 1; j < array.length; j++) { totalPercentage += array[j].share }
        array[0].share = 100 - totalPercentage;
        setSwapShare(array)
      }

    }
  },[tokenInfo.creators, tokenInfo.creatorShares, acc.address]);

  const handleSubmit = () => {

    if (parseInt(amount) > parseInt(totalAmount)) {
      alert(language.alert.noEnoughItems)
      return;
    }
    if (!amount || amount === '' || amount <= 0 || amount % 1 !== 0) {
      alert(language.alert.mustBe + language.alert.integer + language.alert.rangeOf + "[0- ]")
      return;
    }
    if (useSwapShare) {
      var totalShare = 0;
      for (var i = 0; i < swapSharers.length; i++) {
        if (swapSharers[i].share && swapSharers[i].share.length > 3) {
          alert(language.alert.percentageSum)
          return;
        }
        var share = parseInt(swapSharers[i].share)
        if (share <= 0) {
          alert(language.alert.percentageSum)
          return;
        }
        if (!swapSharers[i].address) {
          alert(language.alert.emptyInput)
          return true;
        }
        totalShare += share;
      }
      if (totalShare !== 100) {
        alert(language.alert.percentageSum)
        return true;
      }
    } else {
      setSwapSharer([{
        id: 0,
        address: 'Owner',
        share: 100
      }])
    }
    if (acc === null) {
      syncTaquito().catch()
      return;
    }
    if (!price || price === '' || price < (MIN_SWAP_PRICE / 1000000)) {
      alert(language.alert.priceLowerThanLimit)
    } else {
      setProgress(true)
      setMessage('generating swap')

      var revenueShareMap = new Map()
      var rytRemains = 1000
      // revenue Sharers
      for (var j = 0; j < swapSharers.length; j++) {
        if (swapSharers[j].address === 'Owner')
          continue;
        var ryt = Math.floor(swapSharers[j].share * 10)
        rytRemains -= ryt
        revenueShareMap.set(swapSharers[j].address, ryt)
      }
      revenueShareMap.set(acc?.address, rytRemains)

      // swap is valid call API
      swap(parseFloat(amount), id, parseFloat(price) * 1000000, revenueShareMap)
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


  const maxSharer = 4


  // Below need fixed!!

  // const [sharerId, setSharerId] = useState(1)
  

  // const initSharer = (isUse) => {
  //   if (tokenInfo.creators.length > 1) {
  //     if (isUse) {
  //       setSharerId(tokenInfo.creators.length)
  //       let array = []
  //       let totalShares = tokenInfo.creatorShares.reduce((a, b) => a + b)
  //       for (var i = 0; i < tokenInfo.creators.length; i++) {
  //         array.push({
  //           id: i,
  //           address: i === 0 ? 'Owner' : tokenInfo.creators[i],
  //           share: (tokenInfo.creatorShares[i] / totalShares).toFixed(2) * 100
  //         })
  //       }
  //       var totalPercentage = 0;
  //       for (var i = 1; i < array.length; i++) { totalPercentage += array[i].share }
  //       array[0].share = 100 - totalPercentage;
  //       return array
  //     }
  //     else {
  //       return ([{
  //         id: 0,
  //         address: 'Owner',
  //         share: 100
  //       }])
  //     }
  //   }
  //   else {
  //     return ([{
  //       id: 0,
  //       address: 'Owner',
  //       share: 100
  //     }])
  //   }
  // }
  const useRoyaltiesShare = () => {
    setUseSwapShare(true)
    let newArray = []

    //increase id(key) to re render the row
    swapShare.forEach((sharer, i) => {
      newArray.push({
        id: sharerId + i,
        address: sharer.address,
        share: sharer.share
      })
    })
    setSharerId(sharerId + swapShare.length)
    setUseSwapByRoyalties(true)
    setSwapSharer(newArray)
  }
  const useCustomShare = () => {
    setUseSwapShare(true)
    setUseSwapByRoyalties(false)
  }




  // Below is OK!!

  const addSharer = () => {
    if (swapSharers.length < maxSharer + 1) {
      let array = swapSharers
      setSharerId(sharerId + 1)
      array.push({
        id: sharerId,
        address: null,
        share: null
      })
      setSwapSharer(array)
    }
    return
  }
  const removeSharer = (index) => {
    if (index > 0) {
      let array = swapSharers.slice(0, swapSharers.length)
      array.splice(index, 1)
      array = updateOwner(array)
      setSwapSharer(array)
    }
    return
  }
  const setSharerAddress = (index, address) => {
    if (index > 0) {
      let array = swapSharers.slice(0, swapSharers.length)
      array[index].address = address
      setSwapSharer(array)
      setUseSwapByRoyalties(false)
    }
    return
  }
  const setSharerShare = (index, share) => {
    let array = swapSharers.slice(0, swapSharers.length)
    array[index].share = share
    if (index > 0) {
      array = updateOwner(array)
      setUseSwapByRoyalties(false)
    }
    setSwapSharer(array)
    return
  }
  const updateOwner = (array) => {
    let sum = 0
    for (let i = 1; i < array.length; i++) {
      sum += Number(array[i].share)
    }
    setSharerId(sharerId + 1)
    array[0] = {
      id: sharerId,
      address: 'Owner',
      share: 100 - sum
    }
    return array
  }

  const sharerRows = swapSharers.map((sharer, index) => {
    return (
      <div key={sharer.id} className={styles.shareRow}>
        <Input
          type="text"
          onChange={(e) => setSharerAddress(index, e.target.value)}
          label={language.mint.label.shareWith}
          placeholder={language.mint.placeholder.address}
          value={index === 0 ? language.mint.owner : (sharer.address ? sharer.address : '')}
          disabled={(index > 0 ? false : true)}
        />
        <Input
          type="number"
          onChange={(e) => setSharerShare(index, e.target.value)}
          label={language.mint.label.share}
          placeholder='%'
          value={sharer.share ? sharer.share : 0}
        />
        <div className={styles.removeRow}>
          <Button
            onClick={(e) => { removeSharer(index) }}
            disabled={((!useSwapByRoyalties && index > 0) ? false : true)}
          >-</Button>
        </div>
      </div>
    )
  }
  )



  return (

    <>
      <Container xlarge>
        <div className={styles.swapPage}>
          <div className={styles.title}>{language.detail.swap.title}</div>
          <div className={styles.thumbnail}>

            {<RenderMedia
              mimeType={MIMETYPE.JPEG}
              uri={tokenInfo.thumbnailUri.split('//')[1]}
              frameColor={tokenInfo.frameColor}
            ></RenderMedia>}
          </div>
          <ModalInputForm>
            <ModalField
              labelRow={language.detail.swap.label.amount}
              type="number"
              placeholder={language.detail.swap.placeholder.amount}
              min={1}
              defaultValue={amount}
              max={totalAmount - sales}
              onChange={(e) => setAmount(e.target.value)}
              disabled={progress}
            />
            <ModalField
              labelRow={language.detail.swap.label.price}
              type="number"
              placeholder={language.detail.swap.placeholder.price}
              min={0}
              max={1000000}
              onChange={(e) => setPrice(e.target.value)}
              disabled={progress}
            />
          </ModalInputForm>
          <ModalField
              labelRow={
                <>
                {language.detail.swap.label.swapShare}
                <Hint hoverMessage={language.detail.swap.label.swapShareInfo} />
                </>}
            >
              <Padding><Padding>
              <table className={styles.table}>
                <tbody>            
                  <tr className={styles.row}>
                    <td rowspan="2" className={styles.swapShare}>
                      <button
                        onClick={(e) => setUseSwapShare(false)}
                        className={!useSwapShare ? styles.selected : ''}
                      >{language.detail.swap.label.swapShareOff}</button>
                      {swapShare !== false &&
                        <button
                          onClick={useRoyaltiesShare}
                          className={(useSwapShare && useSwapByRoyalties) ? styles.selected : ''}
                        >{language.detail.swap.label.swapShareRoyalty}</button>}
                      <button
                        onClick={useCustomShare}
                        className={useSwapShare && !useSwapByRoyalties ? styles.selected : ''}
                      >{language.detail.swap.label.swapShareCustom}</button>
                    </td>
                  </tr>
                </tbody>
              </table>
              </Padding></Padding>
            </ModalField>
          {
            <table className={styles.table}>
             <tbody>

               
               {/* <tr>
                 <td className={styles.label}>{language.detail.swap.label.amount}</td>
                 <td className={styles.input}>
                   <Input
                     type="number"
                     placeholder={language.detail.swap.placeholder.amount}
                     min={1}
                     defaultValue={amount}
                     max={totalAmount - sales}
                     onChange={(e) => setAmount(e.target.value)}
                     disabled={progress}
                   />
                 </td>
               </tr>
               <tr>
                 <td className={styles.label}>{language.detail.swap.label.price}</td>
                 <td className={styles.input}>
                   <Input
                     type="number"
                     placeholder={language.detail.swap.placeholder.price}
                     min={0}
                     max={1000000}
                     onChange={(e) => setPrice(e.target.value)}
                     disabled={progress}
                   />
                 </td>
               </tr> */}
            
               {/* Below need fixed  */}
            
               {/* <tr className={styles.row}>
                 <td className={styles.label}>
                   {language.detail.swap.label.swapShare}
                   <Hint hoverMessage={language.detail.swap.label.swapShareInfo} />
                 </td>
                 <td rowspan="2" className={styles.swapShare}>
                   <button
                     onClick={(e) => setUseSwapShare(false)}
                     className={!useSwapShare ? styles.selected : ''}
                   >{language.detail.swap.label.swapShareOff}</button>
                   {swapShare !== false &&
                     <button
                       onClick={useRoyaltiesShare}
                       className={(useSwapShare && useSwapByRoyalties) ? styles.selected : ''}
                     >{language.detail.swap.label.swapShareRoyalty}</button>}
                   <button
                     onClick={useCustomShare}
                     className={useSwapShare && !useSwapByRoyalties ? styles.selected : ''}
                   >{language.detail.swap.label.swapShareCustom}</button>
                 </td>
               </tr> */}
             </tbody>
            </table>
          }
          <br />
          {
            useSwapShare && (

              // Below need fixed

              // <Sharer
              //   type="SwapShare"
              //   useSwapByRoyalties={useSwapByRoyalties}
              //   maxSharer={SWAP_SHARER_LIMIT}
              //   handleSetSharer={setSwapSharer}
              //   handleUseSwapByRoyalties={setUseSwapByRoyalties}
              // />

              // Below need fixed
              <div>
                <div className={styles.shareDescription}>
                  {language.detail.swap.shareDescription[0]}<br></br>
                  {language.detail.swap.shareDescription[1]}<br></br>
                  <strong>{language.detail.swap.shareDescription[2]}</strong><br></br>
                </div>

                {sharerRows}

                <div className={styles.addRow}>
                  <Button
                    onClick={addSharer}
                    disabled={(useSwapByRoyalties || swapSharers.length > maxSharer) ? true : false}
                  >
                    +
                  </Button>
                  {swapSharers.length > maxSharer &&
                    <div className={styles.hoverMessage}>
                      {language.mint.maxSharerWarning.replace('%max%', maxSharer)}
                    </div>}
                </div>
              </div>
            )
          }
          <Container full>
            <p className={styles.detail}>{language.detail.swap.warning}</p>
          </Container>
          <Button onClick={handleSubmit} disabled={progress}>
            <SwapBtn>{language.detail.swap.cta}</SwapBtn>
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
