/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import { HeaderControl } from '../header-control'
import { Container, Padding } from '../layout'
import { Button, Primary } from '../button'
import { fadeIn } from '../../utils/motion'
import Modal from "react-modal";
import { Menu } from '../icons'
import { showWallet } from '../../utils/string'
import { VisuallyHidden } from '../visually-hidden'
import styles from './styles.module.scss'
import { getItem, setItem } from '../../utils/storage'
import { getLanguage, getNotifications, getCurationList, ENV } from '../../constants'

// import  ValidatedIcon  from './img/validated.svg'

/* import { BeaconWallet } from '@taquito/beacon-wallet'

const wallet = new BeaconWallet({
  name: 'akaswap.com',
  preferredNetwork: 'mainnet',
}) */

export const Header = () => {

  const language = getLanguage()
  const notification = getNotifications()
  const history = useHistory()
  const context = useContext(AkaSwapContext)
  const curationList = getCurationList().filter(curation => curation.isDisplay)


  const getExpand = () => {
    if (global.innerWidth > 850) {
      return true
    } else {
      return false
    }
  }
  const [expand, setExpand] = useState(getExpand())

  // const [MakeDropDown, setMakeDropDown] = useState(expand ? false : true)
  // const [SyncDropDown, setSyncDropDown] = useState(false)
  const [isNotifyOpen, setIsNotifyOpen] = useState(false)

  function toggleNotifyModal() {
    setIsNotifyOpen(!isNotifyOpen);
  }

  function toggleClassName(el, className) {
    if (el.className.includes(className)) {
      el.className = el.className.replace(` ${className}`, '')
    } else {
      el.className += ` ${className}`
    }
  }

  useEffect(() => {
    context.setAccount()
    context.setTheme(getItem('theme') || setItem('theme', 'dark'))
    const resize = () => {
      setExpand(getExpand())
    }
    global.addEventListener('resize', resize)



    return () => global.removeEventListener('resize', resize)
  }, [])

  // we assume user isn't connected
  let button = language.header.sync

  // but if they are
  if (context.acc?.address) {
    // is menu closed?
    if (context.collapsed) {
      button = showWallet({ wallet: context.acc.address })
    } else {
      // menu is open
      button = language.header.unsync
    }
  }

  //const activeAccount = await wallet.client.getActiveAccount()
  //console.log(activeAccount)
  const handleRoute = (path) => {
    context.setMenu(true)
    // setMakeDropDown(false)
    history.push(path)
  }

  const handleSyncUnsync = () => {
    if (context.acc?.address && (!context.collapsed || !expand)) {
      // disconnect wallet
      context.disconnect()
      // setSyncDropDown(false)
    } else {
      // connect wallet
      context.syncTaquito().catch(e => e)
    }
  }

  const handleUnsync = () => {
    context.disconnect()
  }

  return (
    <header className={styles.container}>

      <div className={styles.content}>
        <div className={styles.left}>
          <Button onClick={() => handleRoute('/')}>
            {(ENV === 'test') &&
              <div className={styles.testLogo}>
              </div>
            }
            {(ENV !== 'test') &&
              <div className={styles.logo}>
              </div>
            }
          </Button>
          {
            notification && notification.zhtw.length > 0 && notification.en.length > 0 &&
            <>
              <Button onClick={toggleNotifyModal}>
                <div className={styles.notification}>
                  {/* <div className={styles.num}>{notification.zhtw.length}</div> */}
                </div>
              </Button>
              <Modal
                isOpen={isNotifyOpen}
                onRequestClose={toggleNotifyModal}
                className={styles.modal}
                overlayClassName={styles.modalOverlay}
                contentLabel="Notification"
                ariaHideApp={false}
              >
                <Button onClick={toggleNotifyModal} >
                  x
                </Button>
                {getItem('language') === 'en' && notification.en.map((n, ind) => (
                  <div className={styles.news}>
                    <div>{n.title}</div><br></br><br></br>
                    {n.content && n.content.map((p) => (
                      <><div>{p}</div><br></br></>
                    ))
                    }
                  </div>
                ))
                }
                {getItem('language') === 'zh-tw' && notification.zhtw.map((n, ind) => (
                  <div className={styles.news}>
                    <div>{n.title}</div><br></br><br></br>
                    {n.content && n.content.map((p) => (
                      <><div>{p}</div><br></br></>
                    ))
                    }
                  </div>
                ))
                }
              </Modal>
            </>
          }
        </div>
        <div className={styles.right}>
          <div className={context.acc?.address ? styles.unSyncBtn : styles.syncBtn} >
            <div className={styles.dropDownBtn} onClick={handleSyncUnsync}>
              <Primary>{button}</Primary>
              {expand && context.acc?.address && (
                <ul className={styles.dropDown}>
                  <li>
                    <Button onClick={handleUnsync} >
                      <Primary>{language.header.unsync}</Primary>
                    </Button>
                  </li>
                </ul>
              )}
            </div>
          </div>

          <Button onClick={context.toogleNavbar} secondary>
            <div className={styles.hambg}>
              <VisuallyHidden>
                {`${context.collapsed ? 'show' : 'hide'} menu`}
              </VisuallyHidden>
              {!expand && (<Menu isOpen={!context.collapsed} />)}
            </div>
          </Button>

          <AnimatePresence>
            {(expand || !context.collapsed) && (
              <motion.div className={styles.menu} {...fadeIn()}>
                <Container full>
                  <Padding>
                    <nav className={styles.content}>
                      <ul className={styles.navBar}>
                        {expand && (curationList.length > 0) && (ENV !== 'test') &&
                          <li>
                            <Button onClick={() => handleRoute('/curation')}>
                              <Primary>{language.header.menu[0].primary}</Primary>
                            </Button>
                          </li>
                        }
                        <li>
                          <div className={styles.dropDownBtn + ' ' + styles.expanded} onClick={expand ? (() => handleRoute((ENV === 'test') ? '/latest' : '/featured')) : ((e) => {
                            toggleClassName(e.currentTarget, styles.expanded)
                          })}>
                            <Primary>{language.header.menu[1].primary}</Primary>
                            {!expand &&
                              <ul className={styles.dropDown}>
                                {(ENV !== 'test') &&
                                  <li>
                                    <Button onClick={() => handleRoute('/featured')}>
                                      <Primary>{language.marketplace.tab[2]}</Primary>
                                    </Button>
                                  </li>
                                }
                                <li>
                                  <Button onClick={() => handleRoute('/latest')}>
                                    <Primary>{language.marketplace.tab[0]}</Primary>
                                  </Button>
                                </li>
                                <li>
                                  <Button onClick={() => handleRoute('/bundle')}>
                                    <Primary>{language.marketplace.tab[3]}</Primary>
                                  </Button>
                                </li>
                                <li>
                                  <Button onClick={() => handleRoute('/auction')}>
                                    <Primary>{language.marketplace.tab[4]}</Primary>
                                  </Button>
                                </li>
                                {curationList.length > 0 &&
                                  <li>
                                    <Button onClick={() => handleRoute('/curation')}>
                                      <Primary>{language.marketplace.tab[5]}</Primary>
                                    </Button>
                                  </li>
                                }
                              </ul>
                            }
                          </div>
                        </li>
                        <li>
                          <Button onClick={() => handleRoute('/gachalist')}>
                            <Primary>{language.header.menu[2].primary}</Primary>
                          </Button>

                        </li>
                        <li>
                          <div className={styles.dropDownBtn} onClick={expand ? null : ((e) => { toggleClassName(e.currentTarget, styles.expanded) })}>
                            <Primary>{language.header.menu[3].primary}</Primary>
                            <ul className={styles.dropDown}>
                              <li>
                                <Button onClick={() => handleRoute('/mint')}>
                                  <Primary>{language.header.menu[3].submenu[0].primary}</Primary>
                                </Button>
                              </li>
                              <li>
                                <Button onClick={() => handleRoute('/makebundle')}>
                                  <Primary>{language.header.menu[3].submenu[1].primary}</Primary>
                                </Button>
                              </li>
                              <li>
                                <Button onClick={() => handleRoute('/makegacha')}>
                                  <Primary>{language.header.menu[3].submenu[2].primary}</Primary>
                                </Button>
                              </li>

                            </ul>
                          </div>
                        </li>
                        <li>
                          <Button onClick={() => handleRoute('/sync')}>
                            <Primary>{language.header.menu[4].primary}</Primary>
                          </Button>
                        </li>
                        <li>
                          <Button onClick={() => handleRoute('/about/')}>
                            <Primary>{language.header.menu[5].primary}</Primary>
                          </Button>
                        </li>
                      </ul>
                    </nav>
                  </Padding>
                </Container>
                <HeaderControl />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header >
  )
}
