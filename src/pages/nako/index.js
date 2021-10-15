import React, { useContext, useState } from 'react'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import { Page, Container, Padding } from '../../components/layout'
import { Input } from '../../components/input'
import { Button, Curate } from '../../components/button'
import styles from './styles.module.scss'

export const Nako = () => {
  const { syncTaquito, acc, DaSaBee, DaSaDao, DaSaObj } = useContext(AkaSwapContext)
  const [addresses, setAddresses] = useState()
  const [amount, setAmount] = useState()
  const [tokenId, setTokenId] = useState()

  const handleSendTezos = async () => {
    if (acc === null) {
      syncTaquito().catch()
      return;
    }
    var AddressMap = new Map()
    var idx = 0
    var addrs = addresses
    while (true) {
      let tzIdx = addrs.search("tz")
      if (tzIdx === -1)
        break;
      if (addrs.length < 36)
        break;
      let addr = addrs.substring(tzIdx, tzIdx + 36)
      AddressMap.set(idx++, addr)
      addrs = addrs.substring(tzIdx + 36)
    }
    
    DaSaBee(AddressMap, amount * 1000000)
      .then((e) => {
        console.log('Send Tezos confirm', e)
      })
      .catch((e) => {
        console.log('Send Tezos error', e)
        alert('an error occurred')
      })
    
  }
  const handleSendakaDAO = async () => {
    if (acc === null) {
      syncTaquito().catch()
      return;
    }
    var AddressMap = new Map()
    var idx = 0
    var addrs = addresses
    while (true) {
      let tzIdx = addrs.search("tz")
      if (tzIdx === -1)
        break;
      if (addrs.length < 36)
        break;
      let addr = addrs.substring(tzIdx, tzIdx + 36)
      AddressMap.set(idx++, addr)
      addrs = addrs.substring(tzIdx + 36)
    }
    DaSaDao(AddressMap, amount * 1000000)
      .then((e) => {
        console.log('Send akaDAO confirm', e)
      })
      .catch((e) => {
        console.log('Send akaDAO error', e)
        alert('an error occurred')
      })
  }
  const handleSendakaOBJ = async () => {
    if (acc === null) {
      syncTaquito().catch()
      return;
    }
    var AddressMap = new Map()
    var idx = 0
    var addrs = addresses
    while (true) {
      let tzIdx = addrs.search("tz")
      if (tzIdx === -1)
        break;
      if (addrs.length < 36)
        break;
      let addr = addrs.substring(tzIdx, tzIdx + 36)
      AddressMap.set(idx++, addr)
      addrs = addrs.substring(tzIdx + 36)
    }
    DaSaObj(AddressMap, amount, tokenId)
      .then((e) => {
        console.log('Send akaOBJ confirm', e)
      })
      .catch((e) => {
        console.log('Send akaOBJ error', e)
        alert('an error occurred')
      })
  }

  return (
    <Page title="Money Money Money">
      <Container >
        <Padding>
          <div className={styles.mintHeader}>
            Tezos akaDAO akaOBJ ! !
          </div>
        </Padding>
      </Container>
      <Container full>
        <div className={styles.mintArea}>

          <Container small>
            <Input
              type="text"
              onChange={(e) => setAddresses(e.target.value)}
              placeholder="Addresses (tz...)"
              label="addresses"
              maxlength="10000000"
              value={addresses}
            />
            <Input
              type="number"
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (tez/akaDAO/akaOBJ) for each address"
              label="amount"
              value={amount}
            />

          </Container>

          <Container>
            <Padding>
              <div className={styles.row}>
                <div>
                  <Button onClick={handleSendTezos} fit>
                    <Curate>Send tezos!</Curate>
                  </Button>
                </div>
                <div>
                  <Button onClick={handleSendakaDAO} fit>
                    <Curate>Send akaDAO!</Curate>
                  </Button>
                </div>
                <div>
                  <Input
                    type="number"
                    onChange={(e) => setTokenId(e.target.value)}
                    placeholder="akaOBJ ID"
                    label="token ID"
                    value={tokenId}
                  />
                  <Button onClick={handleSendakaOBJ} fit>
                    <Curate>Send akaOBJ!</Curate>
                  </Button>
                </div>
              </div>
            </Padding>
          </Container>
        </div>
      </Container>
    </Page>
  )
}
