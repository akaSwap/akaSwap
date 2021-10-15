import React, { useContext } from 'react'
import { Container, Padding } from '../../components/layout'
import { AkaSwapContext } from '../../context/AkaSwapContext'
// import { OwnerList } from '../../components/owner-list'
// import { OwnerSwaps } from '../../components/owner-swaps'
// import { OwnerViews } from '../../components/owner-views'
import { OwnerList, OwnerSwaps, OwnerViews } from '../../components/owner'
import styles from './styles.module.scss'
import { getLanguage } from '../../constants'

export const Distribution = ({ aliases, owners, sales, tokenInfo, tokenId }) => {
  const language = getLanguage()
  
  const { syncTaquito, collect, acc, cancelSwap } = useContext(
    AkaSwapContext
  )
  

  const filtered =
    (owners &&
      Object.keys(owners)
        .filter((s) => s.startsWith('tz'))
        .filter((s) => parseFloat(owners[s]) > 0) // removes negative owners
        .filter((e) => e !== 'tz1burnburnburnburnburnburnburjAYjjX') // remove burn wallet
        .map((s) => ({ amount: owners[s], wallet: s }))) ||
    []

  const handleCollect = (swap_id, xtz_per_akaObj, event) => {
    if (acc == null) {
      syncTaquito().catch()
    } else {
      event.currentTarget.disabled = true
      collect(1, swap_id, xtz_per_akaObj, tokenId)
        .then((e)=>{
          window.location.reload()
        })
        .catch()
    }
  }
  return (
    <>
    {(sales.swaps.length + sales.auctions.length + sales.gachas.length + sales.bundles.length + filtered.length)> 0 && <div className={styles.collectorList}>
      {sales.swaps.length > 0 && (
        <>
          <Container full>
            <Padding>{language.detail.swapped}</Padding>
          </Container>
          <Container full>
            <Padding>
              <OwnerSwaps
                swaps={sales.swaps}
                handleCollect={handleCollect}
                acc={acc}
                cancelSwap={cancelSwap}
              />
            </Padding>
          </Container>
        </>
      )}

      {sales.auctions.length > 0 && (
        <>
          <Container full>
            <Padding>{language.detail.auctioned}</Padding>
          </Container>
          <Container full>
            <Padding>
              <OwnerViews
                datas={sales.auctions}
                contractType="auction"
              />
            </Padding>
          </Container>
        </>
      )}

      {sales.gachas.length > 0 && (
        <>
          <Container full>
            <Padding>{language.detail.gachaed}</Padding>
          </Container>
          <Container full>
            <Padding>
              <OwnerViews
                datas={sales.gachas}
                contractType="gacha"
              />
            </Padding>
          </Container>
        </>
      )}

      {sales.bundles.length > 0 && (
        <>
          <Container full>
            <Padding>{language.detail.bundled}</Padding>
          </Container>
          <Container full>
            <Padding>
              <OwnerViews
                datas={sales.bundles}
                contractType="bundle"
              />
            </Padding>
          </Container>
        </>
      )}

      {filtered.length === 0 ? undefined : (
        <>
          <Container full>
            <Padding>{language.detail.unswapped}</Padding>
          </Container>
          <Container full>
            <Padding>
              <OwnerList 
                swaps={sales.swaps}
                owners={filtered}
                aliases={aliases}
                tokenInfo={tokenInfo}
              />
            </Padding>
          </Container>
        </>
      )}

    </div>
    }
    </>
  )
}
