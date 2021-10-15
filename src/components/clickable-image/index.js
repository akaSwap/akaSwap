import React from 'react'
import styles from './styles.module.scss'


export const ClickableImage = ({ src = "" }) => {


  function _uuid() {
    var d = Date.now();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & (0x3 | 0x8))).toString(16);
    });
  }

  const id = _uuid()

  return (
    <div className={styles.container}>
      <input type="checkbox" className={styles.check} id={id} />
      <label htmlFor={id}>
        <div className={styles.overlay}></div>
        <img src={src} alt=""/>
      </label>
    </div>
  )
}
