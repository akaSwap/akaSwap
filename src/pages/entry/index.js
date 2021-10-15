import React, { Component } from 'react'
import { Page} from '../../components/layout'
// import { HeaderImages } from '../../components/header-images'
import { AkaSwapContext } from '../../context/AkaSwapContext'
import { getLanguage } from '../../constants'
// import styles from './styles.module.scss'

export class Entry extends Component {
    static contextType = AkaSwapContext

    language = getLanguage()

    state = {
        reveal: false,
    }

    reveal = () => {
        this.setState({
            reveal: !this.state.reveal,
        })
    }
    /*
    <img src={background} alt="Background" className={styles.img}/>
    <Container full>
                    <NoPadding>
                        
                    </NoPadding>
                </Container>
    */

    render() {
        return (
            <Page title="Entry" noPadding>
                {/* <HeaderImages></HeaderImages> */}
                {/* <Container full>
                    <Padding>
                    </Padding>
                </Container> */}
            </Page> 
        )
    }
}
