import React, { useState } from 'react';
import styles from './styles.module.scss'

export const CustomSelect = ({
    options = [],
    formClassName = styles.form,
    focusedFormClassName = styles.focused,
    activeOptionClassName = styles.active,
    submitButton = 'Submit',
    submitCB = (value) => null
}) => {
    const [showOptions, setShowOptions] = useState(false)
    const [cursor, setCursor] = useState(-1)
    const [optionFilter, setOptionFilter] = useState(false)
    const setValue = (event) => {
        document.getElementById("selectInput").value = event.target.value
        setShowOptions(false)
    }
    function autoScroll(appear, element, container) {
        var optionPosY = element.offsetTop
        var space = container.offsetHeight - element.clientHeight
        switch (appear) {
            case 'bottom':
                if (optionPosY - container.scrollTop > space) {
                    container.scrollTo(0, optionPosY)
                }
                break;

            default:
                if (optionPosY - container.scrollTop < 0) {
                    container.scrollTo(0, optionPosY - space)
                }
                break;
        }

    }
    function handleSubmit() {
        submitCB(document.getElementById("selectInput").value)

    }
    const navigateOptions = (e) => {
        if (showOptions) {
            var currentCursor = cursor
            if (e.keyCode === 40 && cursor < options.length - 1) {  // down key press
                do { ++currentCursor } while (optionFilter[currentCursor] === false) // skip hidden options
                if (optionFilter === false) {
                    autoScroll('bottom', document.getElementById('OPTIONID_' + currentCursor), document.getElementById("optionsList"))
                }
                setCursor(currentCursor)
            }
            else if (e.keyCode === 38 && cursor > 0) {
                do { --currentCursor } while (optionFilter[currentCursor] === false)
                if (optionFilter === false) {
                    autoScroll('top', document.getElementById('OPTIONID_' + currentCursor), document.getElementById("optionsList"))
                }
                setCursor(currentCursor)
            }
            else if (e.keyCode === 13) {
                e.preventDefault()
                if (currentCursor === -1) {
                    handleSubmit()
                } else {
                    if (currentCursor > -1) {
                        document.getElementById("selectInput").value = options[currentCursor]
                        filterOptions()
                        setCursor(-1)
                    }
                }
            }
        }
    }
    const filterOptions = () => {
        var text = document.getElementById("selectInput").value
        if (text.length > 0) {
            var list = []
            for (let option of options) {
                // ignore case
                if (option.toLowerCase().startsWith(text.toLowerCase())) {
                    list.push(true)
                }
                else {
                    list.push(false)
                }
            }
            setOptionFilter(list)
        } else {
            setOptionFilter(false)
        }
    }


    return (
        <>
            {showOptions && <div
                style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}
                onClick={() => setShowOptions(false)}>
            </div>}
            <form
                onFocus={() => {
                    setShowOptions(true)
                    filterOptions()
                }}
                autoComplete="off"
                onSubmit={() => handleSubmit()}
                className={formClassName + ' ' + (showOptions ? focusedFormClassName : '')}
            >
                <div>
                    <input
                        id="selectInput"
                        type="text"
                        onKeyDown={navigateOptions}
                        onChange={filterOptions}
                    >
                    </input>
                    <datalist id="optionsList" style={showOptions ? { display: 'block' } : {}}>
                        {
                            options && options.map((item, i) =>
                                <option
                                    id={'OPTIONID_' + i}
                                    key={'OPTIONID_' + i}
                                    value={item}
                                    onClick={setValue}
                                    style={(optionFilter && optionFilter[i] === false) ? { display: `none` } : {}}
                                    className={(cursor === i ? activeOptionClassName : null)}
                                >{item}</option>
                            )
                        }
                    </datalist>
                </div>
                <button type="submit" onClick={() => handleSubmit()}>{submitButton}
                </button>
            </form>
            <div>

            </div>
        </>
    )
}