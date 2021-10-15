import React, { useContext, useState } from 'react'
// import { useHistory } from 'react-router'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import { Page, Container, Padding } from '../../components/layout'
import { Input } from '../../components/input'
import { Button, Curate } from '../../components/button'
import { ManagerAddr, OracleAddr} from '../../constants'
import styles from './styles.module.scss'

export const Management = () => {
  const { acc, syncTaquito, setMarketPause, setLowestPrice, updateManagementFee, oracleGacha } = useContext(AkaSwapContext)
  const { updateTimestamp } = useContext(AkaSwapContext)
  const [lPrice, setLPrice] = useState()
  const [managementFee, setManagementFee] = useState()
  const [gachaAmount, setGachaAmount] = useState()

  const handleSetMarketPause = async (pause) => {
    if (acc === null) {
      syncTaquito().catch()
      return;
    }
    // console.log(pause)
    setMarketPause(pause)
      .then((e) => {
        console.log('Set Market Pause confirm', e)
      })
      .catch((e) => {
        console.log('Set Market Pause error', e)
        alert('an error occurred')
      })
  }
  const handleSetLowestPrice = async (price) => {
    if (acc === null) {
      syncTaquito().catch()
      return;
    }
    setLowestPrice(price)
      .then((e) => {
        console.log('Set Lowest Price confirm', e)
      })
      .catch((e) => {
        console.log('Set Lowest Price error', e)
        alert('an error occurred')
      })
  }
  const handleUpdateManagementFee = async (fee) => {
    if (acc === null) {
      syncTaquito().catch()
      return;
    }
    updateManagementFee(fee)
      .then((e) => {
        console.log('Update Management fee confirm', e)
      })
      .catch((e) => {
        console.log('Update Management fee error', e)
        alert('an error occurred')
      })
  }
  const handleOracleGacha = async (amount) => {
    if (acc === null) {
      syncTaquito().catch()
      return;
    }
    var numberList = []
    for(var i = 0; i < amount; i++)
      numberList.push(Math.floor(Math.random() * 123456789))
    oracleGacha(numberList)
      .then((e) => {
        console.log('Oracle Gacha confirm', e)
      })
      .catch((e) => {
        console.log('Oracle Gacha error', e)
        alert('an error occurred')
      })
  }
  const handleTest = async () => {
    if (acc === null) {
      syncTaquito().catch()
      return;
    }
    let ts = new Date()

    updateTimestamp(ts.toISOString())
      .then((e) => {
        console.log('Update timestamp confirm', e)
      })
      .catch((e) => {
        console.log('Update timestamp error', e)
        alert('an error occurred')
      })
  }

  return (
    <Page title="Management">
      { ((ManagerAddr.includes(acc?.address)|(acc?.address === OracleAddr))) && (
      <Container full>
        <div className={styles.mintArea}>

          <Container>
            <Padding>
              <div className={styles.row}>
                <Button onClick={() => handleSetMarketPause(false)}>
                  <Curate>Open Market</Curate>
                </Button>
                <Button onClick={() => handleSetMarketPause(true)}>
                  <Curate>Close Market</Curate>
                </Button>
              </div>
              <div className={styles.row}>
                <Input
                  type="number"
                  min="0"
                  onChange={(e) => setLPrice(e.target.value)}
                  placeholder="price(mutez)"
                  label="Lowest Price"
                  value={lPrice}
                />
                <Button onClick={() => handleSetLowestPrice(lPrice)}>
                  <Curate>Set Lowest Price</Curate>
                </Button>
              </div>
              <div className={styles.row}>

                <Input
                  type="number"
                  min="0"
                  onChange={(e) => setManagementFee(e.target.value)}
                  placeholder="fee(decimal = 1)"
                  label="Management Fee"
                  value={managementFee}
                />
                <Button onClick={() => handleUpdateManagementFee(managementFee)}>
                  <Curate>Set Management Fee</Curate>
                </Button>
              </div>
              <div className={styles.row}>

                <Input
                  type="number"
                  min="1"
                  onChange={(e) => setGachaAmount(e.target.value)}
                  placeholder="amount"
                  label="Oracle Gacha Amount"
                  value={gachaAmount}
                />
                <Button onClick={() => handleOracleGacha(gachaAmount)}>
                  <Curate>Send Oracle Gacha</Curate>
                </Button>
              </div>
              <br /><br /><br /><br />
              <Button onClick={() => handleTest()} fit>
                <Curate>Test Button</Curate>
              </Button>
            </Padding>
          </Container>
        </div>
      </Container>
      )}
    </Page>
  )
}
