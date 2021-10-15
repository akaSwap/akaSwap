import React, { useContext } from 'react'
import { useHistory } from 'react-router'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import styles from './styles.module.scss'

export const HeaderImages = ({ children = null }) => {


    const history = useHistory()
    const context = useContext(AkaSwapContext)

    const handleRoute = (path) => {
        context.setMenu(true)
        history.push(path)
    }

    const handleSubmit = () => {
        let inputTag = document.getElementById("inputTag").value;
        handleRoute('/tags/' + encodeURIComponent(inputTag));
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.link}>
                <form onSubmit={() => handleSubmit()} className={styles.tagArea}>
                    <button type="submit" onClick={() => handleSubmit()} className={styles.icon}>
                    </button>
                    <input type="text" className={styles.tag} id="inputTag"></input>
                </form>

                <div className={styles.square}>
                    <div>
                        <div className={styles.surf} onClick={() => handleRoute('/featured')}>
                            NFT Surfing
                        </div>
                        <hr />
                        <div className={styles.mint} onClick={() => handleRoute('/mint')}>
                            NFT Mint
                        </div>
                    </div>
                </div>

            </div>

            {/*
            <img src={second} alt="second" className={styles.second}/>
            <img src={third} alt="third" className={styles.third}/>
            <img src={fourth} alt="fourth" className={styles.fourth}/>
            */}

        </div>

    )

}