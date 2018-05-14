import React from 'react'
import {Link} from 'react-router-dom'

import Title from '../../components/Title'

class Home extends React.Component {
  state = {
    title: 'this is Home Page!!'
  }

  render() {
    return (
      <div>
        <Title>{this.state.title}</Title>
        <div>Home </div>
      </div>
    )
  }
}

export default Home
