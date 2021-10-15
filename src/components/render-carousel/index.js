import React from 'react';
// import { getLanguage, getNews } from '../../constants'
// import Carousel, { Dots, autoplayPlugin } from '@brainhubeu/react-carousel';
import styles from './styles.module.scss'
// import { getItem } from '../../utils/storage'
import lastIcon from './img/lastprize.svg'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/swiper.min.css";
import "swiper/components/effect-cube/effect-cube.min.css"
import "swiper/components/pagination/pagination.min.css"
import SwiperCore, { EffectCube, Pagination } from 'swiper/core';
import './style.css'
SwiperCore.use([EffectCube, Pagination]);

class BundleCarousel extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isThumbnail: this.props.isThumbnail,
            value: 0,
            imgs: this.props.imgs,
            // imgList: this.props.imgList,
            lastPrizeUri: this.props.lastPrize,
            lastPrizeSize: [0, 0],
            slides: [],
            isLoaded: false,
            loaded: 0,
        }
        this.onchange = this.onchange.bind(this);
    }

    scale(event) {
        var nw = event.target.naturalWidth;
        var nh = event.target.naturalHeight;
        if (nh > nw) {
            event.target.style.width = 'auto'
            event.target.style.height = '100%'
        } else {
            event.target.style.width = '100%'
            event.target.style.height = 'auto'
        }
    }
    onchange(value) {
        this.setState({ value });
    }
    componentDidMount() {
        this.updateSlides()
    }
    componentDidUpdate(prevProps) {
        if (this.props.imgs !== prevProps.imgs || this.props.lastPrize !== prevProps.lastPrize) {
            // this.state.imgs = this.props.imgs
            // this.state.lastPrizeUri = this.props.lastPrize
            // this.updateSlides()
            // this.setState({
            //     imgs: this.props.imgs,
            //     lastPrizeUri: this.props.lastPrize,
            //     slides: this.state.slides
            // })
            this.setState({
                imgs: this.props.imgs,
                lastPrizeUri: this.props.lastPrize,
                slides: this.state.slides
            }, () => {
                this.updateSlides(() => {
                    this.setState({
                        imgs: this.props.imgs,
                        lastPrizeUri: this.props.lastPrize,
                        // slides: this.state.slides
                    })
                })
            })
        }
    }

    updateSlides(cb = () => null) {
        var slides = this.state.imgs.map((img) =>
            <div className={styles.slide}>
                <img onLoad={this.scale} src={img.uri} className={styles.image} alt="" style={{ border: `10px inset ${img.frame == null || img.frame === '' ? 'transparent' : img.frame}` }} />
            </div>
        )
        // this.setState({ slides: slides }, () => {
        //     if (this.state.lastPrizeUri !== undefined && this.state.lastPrizeUri !== {}) {
        //         this.state.slides.push(
        //             <div className={styles.slide}>
        //                 <div className={styles.lastImage}>
        //                     <div
        //                         className={styles.last}
        //                     >
        //                         <img src={lastIcon} alt="" />
        //                     </div>
        //                     <img
        //                         onLoad={this.scale}
        //                         src={this.state.lastPrizeUri.uri}
        //                         className={styles.image}
        //                         alt=""
        //                         style={{ border: `10px inset ${this.state.lastPrizeUri.frame == null || this.state.lastPrizeUri.frame === '' ? 'transparent' : this.state.lastPrizeUri.frame}` }
        //                         }
        //                     />
        //                 </div>

        //             </div>
        //         );
        //     }
        //     cb();
        // })
        // this.state.slides = slides
        // this.setState({
        //     slides: slides
        // })

        if (this.state.lastPrizeUri !== undefined && this.state.lastPrizeUri !== {}) {
            slides.push(
                <div className={styles.slide}>
                    <div className={styles.lastImage}>
                        <div
                            className={styles.last}
                        >
                            <img src={lastIcon} alt="" />
                        </div>
                        <img
                            onLoad={this.scale}
                            src={this.state.lastPrizeUri.uri}
                            className={styles.image}
                            alt=""
                            style={{ border: `10px inset ${this.state.lastPrizeUri.frame == null || this.state.lastPrizeUri.frame === '' ? 'transparent' : this.state.lastPrizeUri.frame}` }
                            }
                        />
                    </div>

                </div>
            );
        }
        this.setState({
            slides: slides
        })
        cb();
    }

    render() {

        return (
            <div className={styles.wrapper}>
                <div className={(this.state.isThumbnail ? styles.carouselSmallWrapper : styles.carouselWrapper)}>
                    {this.state.slides.length > 0 &&
                        <Swiper
                            effect={'cube'}
                            grabCursor={true}
                            cubeEffect={{
                                "shadow": false,
                                "slideShadows": false
                            }}
                            pagination={{
                                "clickable": true
                            }}
                            loop={false}
                            className="mySwiper"
                        >
                            {this.state.slides.map((el, i) => <SwiperSlide key={i}>{el}</SwiperSlide>)}
                        </Swiper>
                    }
                </div>
            </div>
        );
    }
};

class GachaCarousel extends BundleCarousel {
    componentDidMount() { }
    render() {
        return (
            <div className={styles.wrapper + " " + styles.GachaCarousel}>
                <div className={(this.state.isThumbnail ? styles.carouselSmallWrapper : styles.carouselWrapper)}>
                    {this.state.slides.length > 0 &&
                        <Swiper effect={'coverflow'} grabCursor={true} centeredSlides={true} slidesPerView={'auto'}
                            coverflowEffect={{
                                "rotate": 50,
                                "stretch": -100,
                                "depth": 200,
                                "modifier": 1,
                                "slideShadows": false
                            }}
                            pagination={{
                                "clickable": true
                            }}
                            loop={true}
                            className="mySwiper"
                            initialSlide={0}
                        >
                            {this.state.slides.map((el, i) => <SwiperSlide key={i}>{el}</SwiperSlide>)}
                        </Swiper>
                    }
                </div>
            </div>
        );
    }
}

export { GachaCarousel, BundleCarousel };