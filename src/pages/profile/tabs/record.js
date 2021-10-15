import React, { useState, useEffect } from 'react'
import { Container, Padding } from '../../../components/layout'
import { PlainText } from '../../../components/button'
import { Loading } from '../../../components/loading'
import { PATH, getLanguage } from '../../../constants'
import { limitLength } from '../../../utils/string'
import axios from 'axios'
import { RecordsList } from '../../../components/records'

export const Record = () => {
  const [akaObjRecords, setAkaObjRecords] = useState([])
  const [auctionRecords, setAuctionRecords] = useState([])
  const [bundleRecords, setBundleRecords] = useState([])
  const [gachaRecords, setGachaRecords] = useState([])
  const [transferRecords, setTransferRecords] = useState([])
  const [loading, setLoading] = useState(true)

  const language = getLanguage()
  const wallet = window.location.pathname.split('/')[2]
  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_ACCOUNTS}/${wallet}/records`)
      .then(async (res) => {
        let records = res.data.records === undefined ? [] : res.data.records
        let group1 = []
        let group2 = []
        let group3 = []
        let group4 = []
        let group5 = []
        records.forEach((r) => {
          if (
            r.type === 'collect' ||
            r.type === 'sell' ||
            r.type === 'swap' ||
            r.type === 'cancel_swap' ||
            r.type === 'mint'
          ) {
            group1.push(r)
          } else if (
            r.type === 'collect_auction' ||
            r.type === 'sell_auction' ||
            r.type === 'make_auction' ||
            r.type === 'cancel_auction'
          ) {
            group2.push(r)
          } else if (
            r.type === 'collect_bundle' ||
            r.type === 'sell_bundle' ||
            r.type === 'make_bundle' ||
            r.type === 'cancel_bundle'
          ) {
            group3.push(r)
          } else if (
            r.type === 'collect_gacha' ||
            r.type === 'sell_gacha' ||
            r.type === 'make_gacha' ||
            r.type === 'cancel_gacha' ||
            r.type === 'gacha_lastprize'
          ) {
            group4.push(r)
          } else {
            group5.push(r)
          }
        })
        if (isMounted) {
          setAkaObjRecords(group1)
          setAuctionRecords(group2)
          setBundleRecords(group3)
          setGachaRecords(group4)
          setTransferRecords(group5)
          setLoading(false)
        }
      })
      .catch(e => console.log(e))
    return () => { setIsMounted(false) }
  })

  const getRecords = (records) => {
    return records
      .map((record, i) => {
        if (record === null || record === undefined) { return null }

        var date = { text: new Date(record.timestamp * 1000).toLocaleString([], { hour12: false }) }
        var tokenName = (record.tokenName !== undefined) ? {
          text: limitLength(record.tokenName),
          link: `${PATH.AKAOBJ}/${record.tokenId}`
        } : { text: '' }
        var title = (
          record.gachaTitle !== undefined && (record.type === 'collect_gacha' || record.type === 'sell_gacha' || record.type === 'gacha_lastprize' || record.type === 'make_gacha')
        ) ? {
          text: limitLength(record.gachaTitle),
          link: `${PATH.GACHA}/${record.gachaId}`
        } : (
          record.bundleTitle !== undefined && (record.type === 'collect_bundle' || record.type === 'sell_bundle' || record.type === 'make_bundle')
        ) ? {
          text: limitLength(record.bundleTitle),
          link: `${PATH.BUNDLE}/${record.bundleId}`
        } : (
          record.auctionTitle !== undefined && (record.type === 'collect_auction' || record.type === 'sell_auction' || record.type === 'make_auction')
        ) ? {
          text: limitLength(record.auctionTitle),
          link: `${PATH.AUCTION}/${record.auctionId}`
        } : { text: '' }
        var type = { text: language.mypage.records[record.type] }
        var amount = { text: `${record.amount}x` }
        var price = {
          text: (
            record.type === 'collect' ||
            record.type === 'sell' ||
            record.type === 'swap' ||
            record.type === 'cancel_swap' ||
            record.type === 'collect_gacha' ||
            record.type === 'sell_gacha' ||
            record.type === 'make_gacha' ||
            record.type === 'cancel_gacha' ||
            record.type === 'collect_bundle' ||
            record.type === 'sell_bundle' ||
            record.type === 'make_bundle' ||
            record.type === 'cancel_bundle' ||
            record.type === 'collect_auction' ||
            record.type === 'sell_auction' ||
            record.type === 'make_auction' ||
            record.type === 'cancel_auction'
          ) ? `${record.price / 1000000} xtz` : ''
        }
        return [date, tokenName, title, type, amount, price]
      })
      .filter((record) => record !== null)
  }

  return (
    <>
      {loading && (
        <Container>
          <Padding>
            <Loading top="70%" />
          </Padding>
        </Container>
      )}
      <PlainText>
        {akaObjRecords.length > 0 &&
          <Container xlarge>
            <RecordsList
              records={getRecords(akaObjRecords)}
              title={language.mypage.records.akaOBJ}
              grids={[15, 3, 5, 1, 3, 1, 2]}
              rwdGrids={[15, 5, 9, 1, 5, 2, 3]}
              rowSpans={[2]}
            />
          </Container>
        }
        {gachaRecords.length > 0 &&
          <Container xlarge>
            <RecordsList
              records={getRecords(gachaRecords)}
              title={language.mypage.records.gacha}
              grids={[15, 3, 3, 3, 3, 1, 2]}
              rwdGrids={[15, 5, 5, 5, 5, 2, 3]}
              rowSpans={[2]}
            />
          </Container>
        }
        {bundleRecords.length > 0 &&
          <Container xlarge>
            <RecordsList
              records={getRecords(bundleRecords)}
              title={language.mypage.records.bundle}
              grids={[15, 3, 3, 3, 3, 1, 2]}
              rwdGrids={[15, 5, 5, 5, 5, 2, 3]}
              rowSpans={[2]}
            />
          </Container>
        }
        {auctionRecords.length > 0 &&
          <Container xlarge>
            <RecordsList
              records={getRecords(auctionRecords)}
              title={language.mypage.records.auction}
              grids={[15, 3, 3, 3, 3, 1, 2]}
              rwdGrids={[15, 5, 5, 5, 5, 2, 3]}
              rowSpans={[2]}
            />
          </Container>
        }
        {transferRecords.length > 0 &&
          <Container xlarge>
            <RecordsList
              records={getRecords(transferRecords)}
              title={language.mypage.records.transfer}
              grids={[15, 3, 3, 3, 3, 1, 2]}
              rwdGrids={[15, 5, 5, 5, 5, 2, 3]}
              rowSpans={[2]}
            />
          </Container>
        }
      </PlainText>
    </>
  )
}
