import React, { useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { PATH } from '../../constants'
import { useHistory } from 'react-router'
import { Button, Collector, Purchase } from '../button'
import { showWallet } from '../../utils/string'
import styles from './styles.module.scss'
import Modal from "react-modal";
import { Swap, Burn, Auction } from '../../pages/akaobj-display/modals'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import { getLanguage } from '../../constants'

export const OwnerList = ({ swaps, owners, aliases, tokenInfo }) => {
  const language = getLanguage()

  const { acc } = useContext(AkaSwapContext)
  const { id } = useParams()
  const history = useHistory()

  const [isAuctionOpen, setIsAuctionOpen] = useState(false);
  const [isSwapOpen, setIsSwapOpen] = useState(false);
  const [isBurnOpen, setIsBurnOpen] = useState(false);

  function toggleAuctionModal() {
    setIsAuctionOpen(!isAuctionOpen);
  }
  function toggleSwapModal() {
    setIsSwapOpen(!isSwapOpen);
  }
  function toggleBurnModal() {
    setIsBurnOpen(!isBurnOpen);
  }

  function toggleAuctionModalandRefresh() {
    setIsAuctionOpen(!isAuctionOpen);
    // window.location.reload()
    history.push('/auction')
  }
  function toggleSwapModalandRefresh() {
    setIsSwapOpen(!isSwapOpen);
    window.location.reload()
  }
  function toggleBurnModalandRefresh() {
    setIsBurnOpen(!isBurnOpen);
    window.location.reload()
  }


  return (
    <div className={styles.container}>
      {owners.map(({ amount, wallet }, index) => (
        <div key={`${wallet}-${index}`} className={styles.owner}>
          <span className={styles.address}>

            {amount} x

            <Button to={`${PATH.ISSUER}/${wallet}`}>
              <Collector>{showWallet({ wallet: wallet, alias: aliases[wallet] })}</Collector>
            </Button>

          </span>
          {acc !== undefined && acc.address === wallet &&
            (<div className={styles.buttons}>
              <Button onClick={toggleAuctionModal}>
                <Purchase>
                  {language.detail.menuAuction}
                </Purchase>
              </Button>
              <Button onClick={toggleSwapModal}>
                <Purchase>
                  {language.detail.menuSwap}
                </Purchase>
              </Button>
              <Button onClick={toggleBurnModal}>
                <Purchase>
                  {language.detail.menuBurn}
                </Purchase>
              </Button>
              <Modal
                isOpen={isAuctionOpen}
                onRequestClose={toggleAuctionModal}
                contentLabel="Auction Modal"
                className={styles.auctionModal}
                overlayClassName={styles.modalOverlay}
                ariaHideApp={false}
              >
                <Button onClick={toggleAuctionModal} >
                  x
                </Button>
                <Auction
                  swaps={swaps}
                  tokenInfo={tokenInfo}
                  totalAmount={amount}
                  onDone={toggleAuctionModalandRefresh}
                ></Auction>
              </Modal>
              <Modal
                isOpen={isSwapOpen}
                onRequestClose={toggleSwapModal}
                contentLabel="Swap Modal"
                className={styles.modal}
                overlayClassName={styles.modalOverlay}
                ariaHideApp={false}
              >
                <Button onClick={toggleSwapModal} >
                  x
                </Button>
                <Swap
                  swaps={swaps}
                  tokenInfo={tokenInfo}
                  totalAmount={amount}
                  onDone={toggleSwapModalandRefresh}
                ></Swap>
              </Modal>
              <Modal
                isOpen={isBurnOpen}
                onRequestClose={toggleBurnModal}
                className={styles.modal}
                overlayClassName={styles.modalOverlay}
                contentLabel="Burn Modal"
                ariaHideApp={false}
              >
                <Button onClick={toggleBurnModal} >
                  x
                </Button>
                <Burn
                  tokenId={id}
                  owners={owners}
                  onDone={toggleBurnModalandRefresh}
                ></Burn>
              </Modal>
            </div>)
          }
        </div>
      ))}
    </div>
  )
}
export const OwnerSwaps = ({ swaps, handleCollect, acc, cancelSwap }) => {
  const language = getLanguage()

  return (<div className={styles.container}>
    {swaps.map((swap, index) => {
      return (
        <div key={`${swap.swapId}-${index}`} className={styles.swap}>
          <span className={styles.amount}>
            {swap.akaObjAmount} x
          </span>
          <Button to={`/tz/${swap.issuer}`}>
            <Collector>{showWallet({ wallet: swap.issuer, alias: swap.alias })}</Collector>
          </Button>



          <div className={styles.price}>
            for {parseFloat(swap.xtzPerAkaObj / 1000000)} xtz
          </div>
          <div className={styles.buttons}>
            {swap.issuer === (acc !== undefined ? acc.address : '')
              ? (
                <>
                  <Button disabled onClick={(event) => handleCollect(swap.swapId, swap.xtzPerAkaObj, event)} >
                    <Purchase>{language.detail.menuBuy}</Purchase>
                  </Button>
                  <Button onClick={() => cancelSwap(swap.swapId)}>
                    <Purchase>{language.detail.menuCancel}</Purchase>
                  </Button>
                </>
              )
              : (
                <Button onClick={(event) => handleCollect(swap.swapId, swap.xtzPerAkaObj, event)} >
                  <Purchase>{language.detail.menuBuy}</Purchase>
                </Button>
              )
            }
          </div>
        </div>
      )
    })}
  </div>
  )
}
export const OwnerViews = ({ datas, contractType }) => {
  const language = getLanguage()
  const history = useHistory()

  return (<div className={styles.container}>
    {datas.map((data, index) => {
      const id = data[contractType + "Id"]

      let objAmount = data.akaObjAmount
      let price = 0
      let remark = ""
      let isDone = false
      if (contractType === "gacha") {
        objAmount = data.akaObjRemain
        // if(objAmount === 0)
        //   return null
        price = data.xtzPerGacha
        if (Date.now() / 1000 < data.issueTime)
          remark = "  (" + language.detail.comingSoon + ")"
        else if (Date.now() / 1000 > data.cancelTime) {
          remark = "  (" + language.detail.isDone + ")"
          isDone = true
        }
      }
      else if (contractType === "bundle") {
        objAmount *= data.bundleAmount
        price = data.xtzPerBundle
      }
      else {
        price = data.currentBidPrice
        if (Date.now() / 1000 > data.dueTime) {
          remark = "  (" + language.detail.isDone + ")"
          isDone = true
        }
      }
      return (
        <div key={`${id}-${index}`} className={styles.view}>
          <span className={styles.amount}>
            {objAmount} x
          </span>
          <Button to={`/tz/${data.issuer}`}>
            <Collector>{showWallet({wallet:data.issuer, alias:data.alias})}</Collector>
          </Button>

          <span className={isDone ? styles.terminated : ""}>
            {((contractType === "gacha") || (contractType === "bundle")) &&
              <>
                {data[contractType + "Title"]}
              </>
            }
            {remark}
          </span>

          <div className={isDone ? styles.donePrice : styles.price}>
            {(contractType === "auction") &&
              <>
                {language.detail.xtzCurrentPrice.replace("%PRIZE%", parseFloat(price / 1000000) + " xtz")}
              </>
            }
            {(contractType === "gacha") &&
              <>
                {language.detail.xtzPerGacha.replace("%PRIZE%", parseFloat(price / 1000000) + " xtz")}
              </>
            }
            {(contractType === "bundle") &&
              <>
                {language.detail.xtzPerBundle.replace("%PRIZE%", parseFloat(price / 1000000) + " xtz")}
              </>
            }
          </div>
          <div className={styles.buttons}>
            <Button onClick={() => {
              history.push()
              history.replace('/' + contractType + '/' + id)
            }} >
              <Purchase>{language.detail.menuView}</Purchase>
            </Button>
          </div>
        </div>
      )
    })}
  </div>
  )
}
