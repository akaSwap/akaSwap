/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import { GetAkaObj, GetAkaObjRecords } from '../../data/api'
import { Loading } from '../../components/loading'
import { Page, Container, Padding } from '../../components/layout'
import { RenderMedia } from '../../components/render-media'
import { Info } from './info'
import { Distribution } from './distribution'
import { showWallet, limitLength } from '../../utils/string'
import styles from './styles.module.scss'
import { PATH, getLanguage, getCurationList } from '../../constants'
import { ReactComponent as ToggleIcon } from './img/toggle.svg'
import { RecordListContainer, RecordsList } from '../../components/records'

export const AkaObjDisplay = () => {
  const language = getLanguage()
  const { id } = useParams()
  const context = useContext(AkaSwapContext)
  const [loading, setLoading] = useState(true)
  const [nft, setNFT] = useState()
  const [records, setRecords] = useState([])
  const [recordsLoading, setRecordsLoading] = useState(false)
  const [isShowRecordList, setIsShowRecordList] = useState(false)
  const [isNothing, setIsNothing] = useState(true)

  const curationList = getCurationList()
  const address = context.acc?.address

  let isShowCollect = true
  curationList.forEach((curation) => {
    if (curation.isPrivate && curation.akaOBJs.indexOf(parseInt(id)) >= 0 && curation.vip.indexOf(address) < 0) {
      isShowCollect = false
    }
  })


  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    GetAkaObj({ id }).then(async (data) => {
      await context.setAccount().catch()
      if (isMounted) {
        if (data.token === undefined) {
          setIsNothing(true)
          // history.replace('/latest')
        } else {
          setNFT(data.token)
          setIsNothing(false)
        }
        setLoading(false)
      }
    })
    return () => { setIsMounted(false) }
  }, [])

  const showRecordList = () => {
    if (isMounted) {
      setIsShowRecordList(true)
      setRecordsLoading(true)
      GetAkaObjRecords({ id }).then(async (data) => {
        setRecords(data.records)
        setRecordsLoading(false)
      })
    }
  }

  const getRecords = (records) => {
    return records
      .map((record) => {
        if (record === null || record === undefined) {
          return null
        }
        var date = { text: new Date(record.timestamp * 1000).toLocaleString([], { hour12: false }) }
        var issuer = {
          text: showWallet({ wallet: record.address, alias: record.alias }),
          link: `${PATH.ISSUER}/${record.address}`
        }
        var type = { text: language.detail.records[record.type] }
        var title = (
          record.gachaTitle !== undefined &&
          (record.type === 'collect_gacha' || record.type === 'gacha_lastprize' || record.type === 'make_gacha')
        ) ? {
          text: limitLength(record.gachaTitle),
          link: `${PATH.GACHA}/${record.gachaId}`
        } : (
          record.bundleTitle !== undefined &&
          (record.type === 'collect_bundle' || record.type === 'make_bundle')
        ) ? {
          text: limitLength(record.bundleTitle),
          link: `${PATH.BUNDLE}/${record.bundleId}`
        } : (
          record.auctionTitle !== undefined &&
          (record.type === 'collect_auction' || record.type === 'make_auction')
        ) ? {
          text: limitLength(record.auctionTitle),
          link: `${PATH.AUCTION}/${record.auctionId}`
        } : { text: '' }
        var amount = { text: `${record.amount}x` }
        var price = {
          text: (
            record.type === 'collect' ||
            record.type === 'sell' ||
            record.type === 'swap' ||
            record.type === 'cancel_swap' ||
            record.type === 'collect_gacha' ||
            record.type === 'make_gacha' ||
            record.type === 'cancel_gacha' ||
            record.type === 'collect_bundle' ||
            record.type === 'make_bundle' ||
            record.type === 'cancel_bundle' ||
            record.type === 'collect_auction' ||
            record.type === 'make_auction' ||
            record.type === 'cancel_auction'
          ) ? `${record.price / 1000000} xtz` : ''
        }
        return [date, issuer, type, title, amount, price]
      })
      .filter((record) => record !== null)
  }

  return (
    // <Page title={nft?.tokenInfo.name} coverUri={nft?.tokenInfo.thumbnailUri}>
    <Page title={nft?.tokenInfo.name}>
      {loading && (
        <Container>
          <Loading />
        </Container>
      )}

      {!loading &&
        (isNothing ? (
          <Container large>
            {language.detail.nullakaOBJ}
            <a className={styles.link} href="mailto:service@akaswap.com">service@akaswap.com</a>
          </Container>
        ) : (
          <>
            <Container large>
              <div className={styles.row} >
                <Container full>
                  {nft.tokenId !== undefined &&
                    <RenderMedia
                      mimeType={nft.tokenInfo.formats[0].mimeType}
                      uri={nft.tokenInfo.formats[0].uri.split('//')[1]}
                      interactive={true}
                      metadata={nft}
                      frameColor={nft.tokenInfo.frameColor}
                      isDetailed={true}
                    ></RenderMedia>
                  }
                </Container>
                <Container xlarge>
                  <Info {...nft} />
                </Container>
              </div>
            </Container>

            <Container large>
              <Padding>
                {isShowCollect && <Distribution {...nft} />}
              </Padding>
            </Container>


            {recordsLoading && (
              <Container>
                <Loading />
              </Container>
            )}

            {isShowCollect && !recordsLoading && (
              <>
                {records.length === 0 && !isShowRecordList && (
                  <div className={styles.showRecordListButton}>
                    <button onClick={showRecordList}>
                      Show Records <ToggleIcon />
                    </button>
                  </div>
                )}

                {isShowRecordList && (
                  <Container large>
                    <RecordListContainer>
                      <RecordsList
                        title={language.detail.records.title}
                        records={getRecords(records)}
                        grids={[12, 3, 2, 2, 3, 1, 1]}
                      />
                    </RecordListContainer>
                  </Container>
                )}
              </>
            )}

          </>
        ))}
    </Page>
  )
}
