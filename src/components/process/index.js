import React, { useState } from 'react';
import styles from './styles.module.scss'

/**
 * @param selectable boolean
 * @param onSelect callback(name, index, event)
 * @returns 
 */
export const Process = ({
    stepNames = [],
    currentName = null,
    currentIndex = null,
    selectable = true,
    onSelect = () => null,
    selectPrev = true,
    vertical = false,
    className = null
}) => {

    // parse current and currentIndex
    const [currentStep, setCurrentStep] = useState(() => {
        var index = null;
        if (currentName != null) {
            for (var i = 0; i < stepNames.length; i++) {
                if (stepNames[i] === currentName) {
                    index = i
                    break
                }
            }
        }
        if (index === null) {
            index = currentIndex === null ? currentIndex : 0
        }
        onSelect(stepNames[index], index)
        return index
    })

    function handleOnClick(index, name, event) {
        if (selectable) {
            setCurrentStep(index)
            onSelect(name, index)
        }
    }

    var circles = stepNames.map((name, index) => {
        var el = (
            <div
                className={styles.circle + ' ' + (((selectPrev && (index < currentStep)) || (currentStep === index)) ? styles.selected : '')}
                onClick={(event) => {
                    handleOnClick(index, name, event)
                }}
            >
                {name}
            </div>
        )
        return el
    })

    return (
        <div
            style={{ '--circle-count': stepNames.length }}
            className={styles.process + ' ' + (className != null ? className : '') + ' ' + (vertical ? styles.vert : '')}>
            <div className={styles.progressBar}>
                {selectPrev &&
                    (vertical ?
                        <div
                            className={styles.progress}
                            style={{ height: `${100 * currentStep / (stepNames.length - 1)}%` }}
                        ></div>
                        :
                        <div
                            className={styles.progress}
                            style={{ width: `${100 * currentStep / (stepNames.length - 1)}%` }}
                        ></div>)
                }
            </div>
            <div className={styles.circlesWrapper}>
                {circles}
            </div>

        </div>
    )
}