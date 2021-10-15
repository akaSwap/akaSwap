import React, { useState } from 'react'
import styles from './styles.module.scss'
import { RenderMedia } from '../render-media'
import { Input } from '../input'

function renderObj(nft) {
    const { mimeType, uri } = nft.tokenInfo.formats[0]
    return (
        <div className={styles.media}>
            <RenderMedia
                mimeType={mimeType}
                uri={uri.split('//')[1]}
                metadata={nft}
                frameColor={nft.tokenInfo.frameColor}
            ></RenderMedia>
        </div>
    )
}

function label(id, amount, prefix, input) {
    return (
        <div className={styles.label}>
            <span className={styles.text}>#{id}</span>
            <div className={styles.amount}>
                {input !== null && input}
                {prefix !== null && prefix}
                {amount}
            </div>
        </div>
    )
}

export const AkaobjAmount = ({
    nft,
    onAmountChange = (e) => null
}) => {
    const [amount, setAmount] = useState(0)
    const input = (
        <Input
            className={styles.input}
            type="number"
            id={`quantity_${nft.tokenId}`}
            value={amount}
            min={0}
            max={nft.amount}
            onChange={(e) => {
                setAmount(e.target.value)
                onAmountChange(e)
            }}
        />
    )
    return (
        <div className={styles.container}>
            {renderObj(nft)}
            {label(nft.tokenId, nft.amount, '/', input)}
        </div>
    )
}
export const AkaobjSelect = ({
    nft,
    onSelect = (e) => null,
    selected = false,
    remain
}) => {
    
    return (
        <div
            className={styles.selectcontainer + ' ' + (selected ? styles.chosen : '')}
            tabIndex="1"
            onClick={(e) => { onSelect(e) }}>
            {renderObj(nft)}
            {label(nft.tokenId, remain, '/')}
        </div>
    )
}
export const AkaobjChosen = ({
    nft, amount
}) => {
    
    return (
        <div className={styles.container}>
            {renderObj(nft)}
            {label(nft.tokenId, amount)}
        </div>
    )
}
export const AkaobjGrid = ({ children }) => {
    return (
        <div className={styles.list}>
            {children}
        </div>
    )
}