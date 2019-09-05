import React from 'react'
import gql from 'graphql-tag'
import { withApollo, useSubscription } from 'react-apollo'
import { PageHeader, Tabs, Icon } from 'antd'
import Router from 'next/router'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import truncate from 'lodash/truncate'

import Loader from '../../../common/loader'
import PerformanceChart from './performance-chart'
import AccessibilityChart from './accessibility-chart'
import BestPracticesChart from './best-practices-chart'
import SEOChart from './seo-chart'
import NetworkRequestsTable from './network-requests-table'
import DetailsSummary from './details-summary'

dayjs.extend(advancedFormat)
dayjs.extend(relativeTime)

const fetchPagesSubscription = gql`
  subscription($id: uuid!) {
    page_by_pk(id: $id) {
      id
      link
      audits(limit: 1, order_by: { fetch_time: desc }) {
        id
        fetch_time
      }
    }
  }
`

const PageDetails = (props: any) => {
  const { data, loading, error } = useSubscription(fetchPagesSubscription, {
    variables: { id: props.id },
    fetchPolicy: 'network-only',
  })

  if (loading) return <Loader />

  if (error) return <p>Error: {error.message}</p>

  const { page_by_pk } = data
  const { TabPane } = Tabs

  return (
    <>
      <div className="border border-solid border-gray-300 border-t-0 border-l-0 border-r-0 bg-white">
        <PageHeader
          onBack={() =>
            Router.push(
              `/sites/show?id=${props.siteId}`,
              `/sites/${props.siteId}`
            )
          }
          title={`Audits for ${truncate(page_by_pk.link, {
            length: 40,
            separator: '...',
          })}`}
        >
          <p className="text-xs text-gray-500 font-hairline mb-0">
            {!!page_by_pk.audits.length
              ? `Last audit was ${dayjs(
                  page_by_pk.audits[0].fetch_time
                ).fromNow()}`
              : 'Page will be audited soon'}
          </p>
        </PageHeader>
      </div>
      <div className="m-8">
        <DetailsSummary id={props.id} />
      </div>
      <div className="m-8 bg-white rounded border border-b-0 border-solid border-gray-300 shadow-lg">
        <Tabs
          defaultActiveKey="performance"
          size="large"
          tabBarStyle={{
            backgroundColor: '#fafafa',
            borderBottom: '1px solid #e8e8e8',
          }}
        >
          <TabPane
            tab={
              <span className="text-xs uppercase text-gray-700 font-bold px-8">
                <Icon type="thunderbolt" className="text-base" /> Performance
              </span>
            }
            key="performance"
          >
            <div className="pr-2" style={{ minHeight: '400px' }}>
              <PerformanceChart id={props.id} />
            </div>
          </TabPane>
          <TabPane
            tab={
              <span className="text-xs uppercase text-gray-700 font-bold px-8">
                <Icon type="file-search" className="text-base" /> SEO
              </span>
            }
            key="seo"
          >
            <div className="pr-2" style={{ minHeight: '400px' }}>
              <SEOChart id={props.id} />
            </div>
          </TabPane>
          <TabPane
            tab={
              <span className="text-xs uppercase text-gray-700 font-bold px-8">
                <Icon type="issues-close" className="text-base" /> Best
                Practices
              </span>
            }
            key="best-practices"
          >
            <div className="pr-2" style={{ minHeight: '400px' }}>
              <BestPracticesChart id={props.id} />
            </div>
          </TabPane>
          <TabPane
            tab={
              <span className="text-xs uppercase text-gray-700 font-bold px-8">
                <Icon type="property-safety" className="text-base" />{' '}
                Accessibility
              </span>
            }
            key="accessibility"
          >
            <div className="pr-2" style={{ minHeight: '400px' }}>
              <AccessibilityChart id={props.id} />
            </div>
          </TabPane>
        </Tabs>
      </div>
      <div className="m-8 bg-white rounded border border-b-0 border-solid border-gray-300 shadow-lg">
        <NetworkRequestsTable id={props.id} />
      </div>
    </>
  )
}

export default withApollo(PageDetails)
