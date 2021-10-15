import React, { useContext } from 'react'
import { useHistory } from 'react-router'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import styles from './styles.module.scss'
import { getCurationList } from '../../constants'

export const CurationItem = ({ curation, i }) => {

  const history = useHistory()
  const imgBaseUrl = "/curation_banners/";
  const viponly = "banner_viponly.svg";
  const context = useContext(AkaSwapContext)
  const address = context.acc?.address

  const handleRoute = (name, curation) => {
    if (!curation.isPrivate || curation.vip.indexOf(address) >= 0) {
      history.push('/curation/' + name)
    }
  }

  return (
    <div className={styles.curation} key={i}>
      <img
        className={
          curation.isPrivate && curation.vip.indexOf(address) < 0 ?
            styles.private : styles.public
        }
        onClick={() => handleRoute(curation.name, curation)}
        src={`${imgBaseUrl}${curation.image}`}
        alt={curation.name}
      />
      {curation.isPrivate && curation.vip.indexOf(address) < 0 &&
        <>
        <div className={styles.state}>
          Exclusive Lounge<br></br>
          ( 8/25 0:00 - 8/27 23:59 UTC+8 )
        </div>
        </>
      }
      {curation.isPrivate &&
      <div className={styles.vipBadge}>
        <img src={`${imgBaseUrl}${viponly}`} alt="badge"/>
      </div>
      }
    </div>
  )
}

export const CurationGrid = () => {

  const curationList = getCurationList().filter(curation => curation.isDisplay)

  return (
    
    <div className={styles.container}>
      {curationList && curationList.map((curation, i) => {
        return (
          <CurationItem 
            curation={curation}
            key={i}
          />
        )
      })
      }
    </div>
  )
}
