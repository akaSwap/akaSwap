import React, { useState } from 'react';
import styles from './styles.module.scss'
import { ReactComponent as ToggleIcon } from './img/toggle.svg'

export const Accordion = ({
    headerText = null,
    children,
    id = null,
    className = null,
    isOpened = false,
    onOpened = () => null
}) => {

    const [opened, setOpened] = useState(isOpened);


    function toggleOpened(event) {
        onOpened()
        setOpened(!opened)
        event.currentTarget.classList.toggle(styles.opened)
    }


    return (
        <div className={styles.accordion + ' ' + (className == null ? '' : className)} id={id == null ? '' : id}>
            <div className={styles.toggle} onClick={toggleOpened}>
                <div className={styles.header}>
                    {headerText}
                </div>
                <ToggleIcon className={styles.icon} alt="toggle_icon" />
            </div>

            {opened && (
                <div className={styles.content}>
                    {children}
                </div>
            )}
        </div>
    )
}