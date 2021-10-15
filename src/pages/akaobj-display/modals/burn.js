import React, { useState, useContext } from 'react'
import { AkaSwapContext } from '../../../context/AkaSwapContext'
import { Container, Padding } from '../../../components/layout'
import { Button, SwapBtn } from '../../../components/button'
import { Loading } from '../../../components/loading'
import styles from './styles.module.scss'
import { getLanguage } from '../../../constants'
import { ModalInputForm, ModalField } from '../../../components/input-form'

export const Burn = (props) => {
  const { syncTaquito, acc, burn } = useContext(AkaSwapContext)
  const [amount, setAmount] = useState(1)
  const [message, setMessage] = useState() // eslint-disable-line
  const [progress, setProgress] = useState() // eslint-disable-line
  const language = getLanguage()

  let totalOwned = 0
  props.owners.forEach((owner) => {
    if (owner.wallet === acc?.address) {
      totalOwned = parseInt(owner.amount)
    }
  })

  const handleSubmit = () => {
    if (acc == null) {
      syncTaquito().catch()
      return;
    }
    if (!amount || amount === '' || amount <= 0 || amount % 1 !== 0) {
      alert(language.alert.mustBe + language.alert.integer + language.alert.rangeOf + "[0- ]")
      return
    }

    if (amount > totalOwned) {
      alert(language.alert.noEnoughItems)
      return
    }

    const r = global.confirm(
      `${language.detail.burn.alert[0]}${amount}${language.detail.burn.alert[2]}`
    )
    if (r) {
      setProgress(true)
      setMessage('burning akaOBJ')
      burn(props.tokenId, amount).then((e) => {
        props.onDone();
      })
        .catch((e) => {
          setProgress(false)
          window.location.reload()
          setMessage('an error occurred')
        })
    }
  }

  // const handleSubmit = () => {
  //   const r = global.confirm(
  //     `Burning will remove all akaOBJ#${props.tokenId} from your possession to a burn address.`
  //   )
  //   if (r) {
  //     setProgress(true)
  //     setMessage('burning akaOBJ')
  //     burn(props.tokenId, props.owners)
  //   }
  // }

  return (
    <>
      <Container xlarge>
        <Padding>
          <div className={styles.swapPage}>

            <div className={styles.title}>{language.detail.burn.title}</div>
            <p>
              {language.detail.burn.desc[0]}{props.tokenId}{language.detail.burn.desc[1]}
            </p>
            <br></br>
            <ModalInputForm>
              <ModalField
                labelRow={language.detail.burn.label.amount}
                type="number"
                placeholder={language.detail.burn.placeholder.amount + totalOwned + ")"}
                min={1}
                max={totalOwned}
                defaultValue={totalOwned}
                onChange={(e) => setAmount(e.target.value)}
                disabled={progress}
              />
            </ModalInputForm>
            {
              //<table className={styles.table}>
              //  <tbody>
              //  <tr>
              //    <td className={styles.label}>{language.detail.burn.label.amount}</td>
              //    <td className={styles.input}>
              //      <Input 
              //        type="number"
              //        placeholder={language.detail.burn.placeholder.amount + totalOwned + ")"}
              //        min={1}
              //        max={totalOwned}
              //        defaultValue={totalOwned}
              //        onChange={(e) => setAmount(e.target.value)}
              //        disabled={progress}
              //      />
              //    </td>
              //  </tr>
              //  </tbody>
              //</table>
            }
            <Button onClick={handleSubmit}>
              <SwapBtn>{language.detail.burn.cta}</SwapBtn>
            </Button>
            <div>
              <p>{message}</p>
              {progress && <Loading />}
            </div>

          </div>
        </Padding>
      </Container>
    </>
  )
}
