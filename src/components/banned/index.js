import React from 'react';
import styles from './styles.module.scss'

import icon from './bannedIcon.png';

export const BannedIcon = () => {

  return (
    <div className={styles.wrapper}>
      <img src={icon} alt="Banned"></img>
    </div>
  )
}
