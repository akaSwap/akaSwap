import React, { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { getLanguage } from '../../constants'
import { Input } from '../input'

export const ControlContainer = ({ className, children }) => {
    return (
        <div className={className + ' ' + styles.ControlContainer}
        >
            {children}
        </div>
    )
}
export const ControlComment = ({ children }) => (
    <div className={styles.ControlComment}>
        {children}
    </div>
)
export const ControlButton = (props) => (
    <Button
        className={styles.ControlComment}
        {...props}
    >
        {props.children}
    </Button>
)

export const ControlInput = (props) => (
    <Input
        className={styles.ControlInput}
        {...props}
    >
        {props.children}
    </Input>
)

export const Control = () => {

    return (


        <>
            {/* akaobj
            <div className={styles.priceCol}>
                {}
            </div> 
            */}
            {/* Gacha
            
            */}
            {/* Bundle
            <div className={styles.controll}>
                <div className={styles.button}>
                    {bundle.issuer != context.acc?.address && (
                        <>
                            <button
                                className={styles.price}
                                onClick={handleCollectBundle}
                            >
                                {language.detail.collect.replace(
                                    '%Price%',
                                    (bundle.xtzPerBundle * 1) / 1000000
                                )}
                            </button>
                        </>
                    )}
                </div>
                {bundle.issuer == context.acc?.address && (
                    <div className={styles.button}>
                        <button
                            className={styles.cancelBundle}
                            onClick={handleCancelBundle}
                        >
                            {language.bundle.discontinue}
                        </button>
                    </div>
                )}
            </div>
            */}
            {/* Auction
            <div className={styles.buttons}>
                {getDeltaSecond(auction.dueTime) <= 0 ? (
                    // if remaining time <= 0
                    auction.currentBidPrice === 0 &&
                        address === auction.issuer ? ( // no bid and is issuer
                        <div>
                            <Button onClick={handleDiscontinue}>
                                {language.auction.discontinue}
                            </Button>
                        </div>
                    ) : auction.currentBidPrice >
                        auction.currentStorePrice ? (
                        // have remaining pay
                        address === auction.currentBidder ? ( // is current bidder
                            <div>
                                <div className={styles.price}>
                                    {(auction.currentBidPrice -
                                        auction.currentStorePrice) /
                                        1000000 +
                                        ' xtz'}
                                </div>
                                <Button
                                    onClick={handlePayRemaining}
                                    className={styles.button}
                                >
                                    {language.auction.payIt}
                                </Button>
                            </div>
                        ) : address === auction.issuer ? ( // not current bidder and is auctio issuer
                            getDeltaSecond(auction.dueTime) <= -86400 ? ( // time over 24 hr
                                <div>
                                    <Button onClick={handleFailedClosed}>
                                        {language.auction.failed}
                                    </Button>
                                </div>
                            ) : (
                                // not over 24 hr
                                <div>{language.auction.waiting}</div>
                            )
                        ) :
                            // (
                            //   <div className={styles.buttonPrice}> {language.auction.auctionResults}:
                            //     <div className={styles.price}>
                            //       {auction.currentBidPrice === 0
                            //         ? <span className={styles.digit}>{language.auction.auctionPass}</span>
                            //         :
                            //         <>
                            //           <span className={styles.digit}>{(auction.currentBidPrice / 1000000).toString()}</span>
                            //           xtz
                            //         </>
                            //       }
                            //     </div>
                            //   </div>
                            // )
                            null
                        // not current bidder and not issuer
                    ) : // no remaining pay
                        address === auction.currentBidder ||
                            address === auction.issuer ? (
                            // is bidder or issuer
                            <div>
                                <Button onClick={handleClosed}>
                                    {language.auction.closed}
                                </Button>
                            </div>
                        ) :
                            // (
                            //   <div className={styles.buttonPrice}> {language.auction.auctionResults}:
                            //     <div className={styles.price}>
                            //       {auction.currentBidPrice === 0
                            //         ? <span className={styles.digit}>{language.auction.auctionPass}</span>
                            //         :
                            //         <>
                            //           <span className={styles.digit}>{(auction.currentBidPrice / 1000000).toString()}</span>
                            //           xtz
                            //         </>
                            //       }
                            //     </div>
                            //   </div>
                            // )
                            null
                    // not bidder and not issuer
                ) : (
                    // if remaining time > 0
                    <div>
                        <div className={styles.buttonPrice}>
                            {
                                auction.directPrice / 1000000 !== MAX_AUCTION_PURCHASE_PRICE &&
                                <>
                                    {language.auction.purchasePrice}:
                                    <div className={styles.price}>
                                        <span className={styles.digit}>{(auction.directPrice / 1000000).toString()}</span> xtz
                                    </div>
                                </>
                            }
                        </div>
                        {auction.directPrice / 1000000 !==
                            MAX_AUCTION_PURCHASE_PRICE ? (
                            //can direct purchase
                            <Button
                                className={styles.button}
                                onClick={handleDirectPurchase}
                                disabled={auction.issuer === address}
                            >
                                {language.auction.buy}
                            </Button>
                        ) : (
                            //cannot direct purchase
                            <Button className={styles.button} disabled>
                                {language.auction.noDirectSales}
                            </Button>
                        )}
                        <div className={styles.buttonPrice}>
                            <span className="subTitle">{language.auction.currentBidPrice}:</span>
                            <div className={styles.price}>
                                {auction.currentBidPrice === 0
                                    ? <span className={styles.digit}>{language.auction.noBid}</span>
                                    :
                                    <>
                                        <span className={styles.digit}>{(auction.currentBidPrice / 1000000).toString()}</span> xtz
                                    </>
                                }
                            </div>
                        </div>
                        {auction.issuer === address ? (
                            // is issuer
                            <Button
                                onClick={handleDiscontinue}
                                className={styles.button}
                                disabled={auction.currentBidPrice !== 0}
                            >
                                {language.auction.discontinue}
                            </Button>
                        ) : // not issuer
                            auction.currentBidder === address &&
                                auction.currentBidPrice >
                                auction.currentStorePrice ? (
                                // is bidder and have remaining payment
                                <div className={styles.bidder}>
                                    <Button
                                        onClick={toggleBidModal}
                                        className={styles.button}
                                    >
                                        {language.auction.placeBid}
                                    </Button>
                                    <Button
                                        onClick={handlePayRemaining}
                                        className={styles.button}
                                    >
                                        {language.auction.pay +
                                            (auction.currentBidPrice -
                                                auction.currentStorePrice) /
                                            1000000 +
                                            ' xtz'}
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    onClick={toggleBidModal}
                                    className={styles.button}
                                >
                                    {language.auction.placeBid}
                                </Button>
                            )}
                    </div>
                )}
            </div> 
            */}
        </>
    )
}