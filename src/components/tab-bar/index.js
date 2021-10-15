import React from 'react'
import styles from './styles.module.scss'
/**
 * @param int currentItemIndex
 * @param array display text
 * @param callback callback on click(return index)
 * 
 */
export const TabBar = ({
    className = null,
    current = 0,
    tabNames = [],
    onClickCB = (i) => null
}) => {

    function handleOnclick(i) {
        onClickCB(i)
    }

    return (
        <div className={styles.buttongroupparent}>
            <div className={styles.buttongroup + ' ' + (className === null ? '' : className)}>
                {
                    tabNames.map((tabName, i) =>
                    ((tabName !== null && tabName !== '') ?
                        <p key={i} onClick={() => handleOnclick(i)} className={
                            (current === i ? styles.pagebutton_active : styles.pagebutton)
                        }>
                            {tabName}
                        </p>
                        : '')
                    )
                }
            </div>
        </div>

    )
}
