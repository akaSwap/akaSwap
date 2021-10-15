import React, { useState, useEffect } from 'react'
import { Container, Padding } from '../../../components/layout'
import { Loading } from '../../../components/loading'
import { MultiItemGrid } from '../../../components/multiItem-grid'
import { getLanguage } from '../../../constants'
import axios from 'axios'

export const GachaAndBundle = () => {
  const [bundles, setBundles] = useState([])
  const [gachas, setGachas] = useState([])
  const [loading, setLoading] = useState(true)

  const language = getLanguage()
  const wallet = window.location.pathname.split('/')[2]
  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get(`${process.env.REACT_APP_ACCOUNTS}/${wallet}/bundles`),
      axios.get(`${process.env.REACT_APP_ACCOUNTS}/${wallet}/gachas`),
    ])
      .then(async (res) => {
        const bundles = res[0].data.bundles === undefined ? [] : res[0].data.bundles
        const gachas = res[1].data.gachas === undefined ? [] : res[1].data.gachas
        if (isMounted) {
          setBundles(bundles)
          setGachas(gachas)
          setLoading(false)
        }
      })
      .catch()
    return () => { setIsMounted(false) }
  })

  return (
    <>
      {loading && (
        <Container>
          <Padding>
            <Loading top="70%" />
          </Padding>
        </Container>
      )}
      {gachas.length > 0 &&
        <>
          <Container xlarge>
            <Padding>{language.mypage.gachas}</Padding>
          </Container>
          <Container full>
            <Padding>
              <MultiItemGrid
                items={gachas}
                type="gacha"
              ></MultiItemGrid>
            </Padding>
          </Container>
        </>
      }
      {bundles.length > 0 &&
        <>
          <Container xlarge>
            <Padding>{language.mypage.bundles}</Padding>
          </Container>
          <Container full>
            <Padding>
              <MultiItemGrid
                items={bundles}
                type="bundle"
              ></MultiItemGrid>
            </Padding>
          </Container>
        </>
      }
    </>
  )
}
