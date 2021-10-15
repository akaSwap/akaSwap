import React from 'react'
import { getLanguage} from '../../constants'
import { Tags } from '../tags'
import { getDeltaSecond} from '../../datetime'
import { Container} from '../layout'
import { Button, Primary} from '../button'
import { Timer } from '../timer'
import styles from './styles.module.scss'
//import { ReactComponent as VoteIcon } from './imgs/vote.svg'
// const _ = require('lodash')

export const InfoDetailItem = ({ description, subtitle, children, content, link, path, inline = true, opaque = false, tags }) => {

  const language = getLanguage()
  return (
    <div className={styles.InfoDetailItem + ' ' + ((!description && inline) ? styles.inline : '')}>
      <Container full>
        {
          tags && tags.length > 0 && tags[0] !== "" &&
          <Tags tags={tags} />
        }
        <div className="subTitle">
          {description && language.detail.info.description}
          {subtitle}
        </div>
        <div className={`text ${opaque ? '' : 'translucent'}`}>
          {(link || path) ?
            <Button to={path} href={link}>
              <Primary>
                <span className="link">
                  {content}
                </span>
              </Primary>
            </Button>
            : description ? description : content}
          {children && children}
        </div>

      </Container>
    </div>
  )
}
export const InfoDetailTimer = ({ text, time }) => {
  return (
    <div className={styles.InfoDetailTimer}>
      -&nbsp;
      {text && text}&nbsp;
      {time && <Timer seconds={getDeltaSecond(time)} type="dhms" end="refresh" />}
      &nbsp;-
    </div>
  )
}
export const InfoDetailContainer = ({
  page = "akaobj",
  title = "",
  description = "",
  inline = true,
  children
}) => (
  <div className={`${styles.InfoDetailContainer} ${page === 'auction' ? styles.auction : ''}`}>
    <div className="title">{title}</div>
    <Container full>
      {children}
    </Container>
  </div>
)
export const InfoDetailCol = ({
  width, children
}) => (
  <div className={styles.InfoDetailCol}>{children}</div>
)