import React, {  useState } from 'react'
import styles from './styles.module.scss'
import { Input } from '../../components/input'
import { Button } from '../../components/button'
import { getLanguage } from '../../constants'

export const Sharer = ({ id = 1, type, useSwapByRoyalties = false, sharers, maxSharer, handleSetSharer , handleUseSwapByRoyalties = () => null }) => {
    const language = getLanguage()
    const [sharerId, setSharerId] = useState(id)

    // const initSharer = (isUse) => {
    //     if (tokenInfo.creators.length > 1) {
    //       if (isUse) {
    //         setSharerId(tokenInfo.creators.length)
    //         let array = []
    //         let totalShares = tokenInfo.creatorShares.reduce((a, b) => a + b)
    //         for (var i = 0; i < tokenInfo.creators.length; i++) {
    //           array.push({
    //             id: i,
    //             address: i == 0 ? 'Owner' : tokenInfo.creators[i],
    //             share: (tokenInfo.creatorShares[i] / totalShares).toFixed(2) * 100
    //           })
    //         }
    //         var totalPercentage = 0;
    //         for (var i = 1; i < array.length; i++) { totalPercentage += array[i].share }
    //         array[0].share = 100 - totalPercentage;
    //         return array
    //       }
    //       else {
    //         return ([{
    //           id: 0,
    //           address: 'Owner',
    //           share: 100
    //         }])
    //       }
    //     }
    //     else {
    //       return ([{
    //         id: 0,
    //         address: 'Owner',
    //         share: 100
    //       }])
    //     }
    //   }
    //   const useRoyaltiesShare = () => {
    //     setUseSwapShare(true)
    //     let newArray = new Array
    
    //     //increase id(key) to re render the row
    //     royaltiesShare.map((sharer, i) => {
    //       newArray.push({
    //         id: sharerId + i,
    //         address: sharer.address,
    //         share: sharer.share
    //       })
    //     })
    //     setSharerId(sharerId + royaltiesShare.length)
    //     setUseSwapByRoyalties(true)
    //     setSwapSharer(newArray)
    //   }
    //   const useCustomShare = () => {
    //     setUseSwapShare(true)
    //     setUseSwapByRoyalties(false)
    //   }

    const addSharer = () => {
        if (sharers.length < maxSharer + 1) {
          let array = sharers
          setSharerId(sharerId + 1)
          array.push({
            id: sharerId,
            address: null,
            share: null
          })
          handleSetSharer(array)
        }
        return
      }
      const removeSharer = (index) => {
        if (index > 0) {
          let array = sharers.slice(0, sharers.length)
          array.splice(index, 1)
          array = updateOwner(array)
          handleSetSharer(array)
        }
        return
      }
      const setSharerAddress = (index, address) => {
        if (index > 0) {
          let array = sharers.slice(0, sharers.length)
          array[index].address = address
          handleSetSharer(array)
          handleUseSwapByRoyalties(false)
        }
        return
      }
      const setSharerShare = (index, share) => {
        let array = sharers.slice(0, sharers.length)
        array[index].share = share
        if (index > 0) {
          array = updateOwner(array)
          handleUseSwapByRoyalties(false)
        }
        handleSetSharer(array)
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
    
      const sharerRows = sharers.map((sharer, index) => {
        return (
          <div key={sharer.id} className={styles.shareRow}>
            {type === "RoyaltiesShare" &&
                <>
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
                </>
            }
            {type === "SwapShare" &&
                <>
                <Input
                type="text"
                onChange={(e) => setSharerAddress(index, e.target.value)}
                label={language.detail.swap.label.share}
                placeholder={language.mint.placeholder.address}
                value={index === 0 ? language.mint.owner : (sharer.address ? sharer.address : '')}
                disabled={((!useSwapByRoyalties && index > 0) ? false : true)}
                />
                <Input
                type="number"
                onChange={(e) => setSharerShare(index, Number(e.target.value))}
                label={language.mint.label.share}
                placeholder='%'
                value={sharer.share ? sharer.share : 0}
                disabled={((!useSwapByRoyalties && index > 0) ? false : true)}
                />
                </>
            }
            <div className={styles.removeRow}>
              <Button
                onClick={(e) => { removeSharer(index) }}
                disabled={((!useSwapByRoyalties && index > 0)? false : true)}
              >-</Button>
            </div>
          </div>
        )
      }
      )

    return (
    <div>
        
        <div className={styles.shareDescription}>
        {type === "RoyaltiesShare" &&
            <>
            {language.mint.shareDescription[0]}<br></br>
            {language.mint.shareDescription[1]}<br></br>
            <strong>{language.mint.shareDescription[2]}</strong><br></br>
            </>
        }
        {type === "SwapShare" &&
            <>
            {language.mint.shareDescription[0]}<br></br>
            {language.mint.shareDescription[1]}<br></br>
            <strong>{language.mint.shareDescription[2]}</strong><br></br>
            </>
        }
        </div>
        
        {sharerRows}
        
        <div className={styles.addRow}>
            <Button
            onClick={addSharer}
            disabled={useSwapByRoyalties || sharers.length > maxSharer ? true : false}
            >
            +
            </Button>
            {sharers.length > maxSharer &&
            <div className={styles.hoverMessage}>
                {type === "RoyaltiesShare" &&
                    language.mint.maxSharerWarning.replace('%max%', maxSharer)
                }
                {type === "SwapShare" &&
                    language.mint.maxSharerWarning.replace('%max%', maxSharer)
                }
            </div>}
        </div>
    </div>
  )
}
