import React from 'react';
import styles from './styles.module.scss'

export const Loading = ({ message, top = '50%' }) => {

  return (

    <div className={styles.wrapper} style={{ top: top }}>
      <svg className={styles.spinner} id="layer1" x="0px" y="0px" viewBox="0 0 200 200" >
        <polygon className={styles.path} points="154.8,146.8 154.5,53.2 153,53.2 136.2,53.2 131,53.2 45.2,146.8 67.2,146.8 136.2,71.4 136.2,146.8 " />
      </svg>
    </div>

  )
}

export const LoadingContainer = ({ loading, children = null }) => {

  if (loading) {
    return (
      <div className={styles.loader}>
        <Loading />
      </div>
    )
  }
  return children
}
