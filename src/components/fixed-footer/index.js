import React from 'react'
import { getLanguage, VERSION } from '../../constants'
import styles from './styles.module.scss'

export const FixedFooter = ({ setContent = null }) => {
  const language = getLanguage()

  const onclickcb = (id) => {
    if (setContent != null) {
      return setContent(id);
    }
  }
  return (
    <footer className={styles.container}>
      <div className={styles.content}>
        {VERSION},
        {language.footer[0]}
        <a className={styles.license} href="/about/#license" onClick={() => onclickcb('license')}> MIT license</a>,
        {language.footer[1]} -
        <a className={styles.link} href="/about/#disclaimer" onClick={() => onclickcb('disclaimer')}>view</a>
      </div>
    </footer>
  )
}
