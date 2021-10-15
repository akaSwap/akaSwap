import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { AkaSwapContext } from '../context/AkaSwapContext'
import { Page, Container, Padding } from '../components/layout'
import { LoadingContainer } from '../components/loading'
import { Button, Primary } from '../components/button'

export default class Sync extends Component {
  constructor(props) {
    super(props)

    this.state = {
      addr: '',
    }
  }

  static contextType = AkaSwapContext

  componentDidMount = async () => {
    if (this.context.acc == null) {
      await this.context.syncTaquito().catch()
      await this.context.setAccount().catch()
    } else {
      await this.context.setAccount().catch()
    }
    

  }

  render() {
    // console.log(this.context)
    return this.context.acc !== undefined ? (
      this.context.isGacha ? 
        <Redirect to={`/ga/choose/${this.context.acc.address}`} /> :
        <Redirect to={`/tz/${this.context.acc.address}`} /> 
    ) : (
      <Page title="">
        <Container>
          <Padding>
            <p>requesting permissions</p>
            <Button to="/sync">
              <Primary>try again?</Primary>
            </Button>
            <LoadingContainer />
          </Padding>
        </Container>
      </Page>
    )
  }
}
