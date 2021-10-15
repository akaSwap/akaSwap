import React, { useEffect, useState } from 'react'
import { getLanguage } from '../../constants'
import styles from './styles.module.scss'

export const Timer = ({ seconds, type, end}) => {
  // initialize timeLeft with the seconds prop
  const [timeLeft, setTimeLeft] = useState(seconds);
  const language = getLanguage()

  function refreshPage() {
    window.location.reload(false);
  }

  useEffect(() => {
    // exit early when we reach 0
    if (!timeLeft) return;

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft]);

  if (timeLeft < 0){
    if(end === "refresh") return (
      <>
      <span className={styles.time}>00</span><span>&nbsp;s</span>
      <span onClick={refreshPage} className={styles.refresh}>{language.detail.info.refresh}</span>
      </>
    )
    else
      return (<>{language.detail.auction.end}</>)
  }
  else if (type === "dhms") {
    let tl = timeLeft
    let d = Math.floor(tl / (60 * 60 * 24))
    tl %= 60 * 60 * 24
    let hh = Math.floor(tl / (60 * 60))
    tl %= 60 * 24
    let mm = Math.floor(tl / 60)
    let ss = Math.floor(tl % 60)

    return (
      <>
        {(d > 0) && (
          <>
            <span className={styles.time}>{d}</span>
            <span> d </span>
            <span className={styles.time}>{(hh).toString().padStart(2,'0')}</span>
            <span> h </span>
            <span className={styles.time}>{(mm).toString().padStart(2,'0')}</span>
            <span> m </span>
            <span className={styles.time}>{(ss).toString().padStart(2,'0')}</span>
            <span> s </span>
          </>
        )}
        {(d === 0) && (hh > 0) && (
          <>
            <span className={styles.time}>{(hh).toString().padStart(2,'0')}</span>
            <span> h </span>
            <span className={styles.time}>{(mm).toString().padStart(2,'0')}</span>
            <span> m </span>
            <span className={styles.time}>{(ss).toString().padStart(2,'0')}</span>
            <span> s </span>
          </>
        )}
        {(d === 0) && (hh === 0) && (mm > 0) && (
          <>
            <span className={styles.time}>{(mm).toString().padStart(2,'0')}</span>
            <span> m </span>
            <span className={styles.time}>{(ss).toString().padStart(2,'0')}</span>
            <span> s </span>
          </>
        )}
        {(d === 0) && (hh === 0) && (mm === 0) && (
          <>
            <span className={styles.time}>{(ss).toString().padStart(2,'0')}</span>
            <span> s </span>
          </>
        )}
      </>
    );
  }
  else if (type === "ISO") {
    return (
      <>
        {new Date(new Date().getTime() + timeLeft * 1000).toISOString()}
      </>
    );
  }
  else if (type === "mm") {
    return (
      <>
        {new Date(timeLeft * 1000).toISOString().substr(14, 5)}
      </>
    );
  }
  else {
    return (
      <>
        {parseInt(timeLeft)}
      </>
    );
  }


};