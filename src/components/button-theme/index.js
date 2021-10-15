import React, { useContext } from 'react'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import styles from './styles.module.scss'

export const ButtonTheme = () => {
  const context = useContext(AkaSwapContext)
  return (
    <div
      className={styles.container}
      onClick={() =>
        context.setTheme(context.theme === 'light' ? 'dark' : 'light')
      }
    />
  )
}
