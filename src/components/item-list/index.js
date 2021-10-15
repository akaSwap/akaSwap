import React from 'react'
import { getLanguage } from '../../constants'
import { PATH } from '../../constants'
import { Button, PlainText } from '../button'
import { showWallet } from '../../utils/string'
import { Container, Padding } from '../layout'
import styles from './styles.module.scss'

export const ItemList = ({
  description = "",
  datas = null
}) => {
  const language = getLanguage()

  return (
    <Container full>
      <Padding>
        <div className={styles.prize}>
          {(description !== "") &&
            <Container full>
              <Padding>
                <div className={styles.text}>* {description}</div>
              </Padding>
            </Container>
          }
          {datas.map((data, ind) => (
            <div key={ind}>
              <Container full>
                <Padding>
                  <div className={styles.subTitle}>{data.title}</div>
                </Padding>
              </Container>
              <div className={styles.list}>
                {data.items.map((item, itemIdx) => (
                  (itemIdx < data.thumbnails.length) &&
                  <Button to={`${PATH.AKAOBJ}/${item.tokenId}`} key={itemIdx}>
                    <PlainText>
                      <div className={styles.row}>
                        <div className={styles.thumbnail}>
                          <img src={data.thumbnails[itemIdx].uri} alt=""
                            style={{ border: `5px inset ${item.tokenInfo.frameColor == null ? 'transparent' : item.tokenInfo.frameColor}` }} />
                        </div>
                        <div className={styles.infoTable}>
                          <div>
                            <div>{language.detail.creator}: {showWallet({ wallet: item.tokenInfo.creators[0], alias: item.tokenInfo.aliases[0] })}</div>
                            <div>#{item.tokenId} {item.tokenInfo.name}</div>
                          </div>
                          <div className={styles.amountRow}>
                            {(data.detailType === "totalRemain") &&
                              <>
                                <div>{language.gacha.total}: {item.total}</div>
                                <div>{language.gacha.remain}: {item.remain}</div>
                              </>
                            }
                            {(data.detailType === "amount") &&
                              <div>{language.bundle.amount}: {item.amount}</div>
                            }
                            {(data.detailType === "lastPrize") &&
                              <div>{language.gacha.lastOne}</div>
                            }
                          </div>
                        </div>
                      </div>
                    </PlainText>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Padding>
    </Container>
  )
}
