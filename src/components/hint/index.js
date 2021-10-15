import React from 'react';
import styles from './styles.module.scss'

export const Hint = ({ buttontext = "?", hoverMessage = "" }) => {


  return (
    <div className={styles.infoButton}>
        {buttontext}
        <div className={styles.hoverMessage}>
        {hoverMessage}
        </div>
    </div>
  )
}







