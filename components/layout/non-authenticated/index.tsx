import React, { Component } from 'react'
import Layout from 'antd/lib/layout'

import ContentComponent from './content'

class NonAuthenticatedLayout extends Component {
  render() {
    return (
      <Layout>
        <Layout>
          <ContentComponent>{this.props.children}</ContentComponent>
        </Layout>
      </Layout>
    )
  }
}

export default NonAuthenticatedLayout
