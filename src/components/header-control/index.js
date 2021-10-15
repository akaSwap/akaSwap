import React from 'react'
import { ButtonLanguage } from '../button-language'
import { ButtonTheme } from '../button-theme'
import styles from './styles.module.scss'

export const HeaderControl = () => {

  return (
    <footer className={styles.container}>
      <div>
        <div className={styles.buttons}>
          <ButtonLanguage/>
          <ButtonTheme />
        </div>
      </div>
    </footer>
  )
}
