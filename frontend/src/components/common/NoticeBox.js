import React from 'react'
import styled from 'styled-components'

import { addCampaignNotice, deleteCampaignNotice } from '../../lib/api'

import ChatControl from '../elements/ChatControl'
import InputArea from '../elements/InputArea'

const Wrapper = styled.div`
  width: 100%;
  padding: 20px;
`

const NoticeContain = styled.div`
  position: relative;
  border: 1px solid ${props => props.theme.shadow};
  border-bottom: none;
  background-color: ${props => props.theme.panels};
  overflow-y: scroll;
  overflow-x: hidden;
  height: 300px;
`

const NoticeText = styled.div`
  position: relative;
  margin: 5px;
  margin-right: 2px;
  padding: 15px;
  padding-bottom: calc(15px + 1rem);
  background-color: ${props => props.theme.background};
  font-style: italic;
  color: ${props => props.theme.text};
`

const NoticeDelete = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  font-size: 0.7rem;
  padding-top: 9px;
  color: red;
  cursor: pointer;
`

const User = styled.div`
  position: absolute;
  right: calc(10px + 3rem);
  bottom: 10px;
  font-size: 0.7rem;
  padding-top: 10px;
  color: ${props => props.theme.text};
`

class NoticeBox extends React.Component {
  
  state = {
    campaignData: null,
    noticeText: '',
    notices: null
  }

  componentDidMount = () => {
    this.loadData()
  }

  componentDidUpdate = () => {
    if (this.props.campaignData.id !== this.state.campaignData.id) {
      this.loadData()
    }
  }

  loadData = () => {
    const campaignData = { ...this.props.campaignData }
    const notices = [...campaignData.campaign_notices]
    this.setState({ campaignData, notices })
  }

  handleChange = event => {
    const noticeText = event.target.value
    this.setState({ noticeText })
  }

  handleSubmit = async event => {
    event.preventDefault()
    try {
      const newNotice = {
        text: this.state.noticeText,
        campaign: this.state.campaignData.id
      }
      const response = await addCampaignNotice(newNotice)
      const notices = [...this.state.notices]
      notices.push(response.data)
      this.setState({ noticeText: '', notices })
      this.noticeboard.scrollTop = this.noticeboard.scrollHeight
    } catch (err) {
      console.log(err.response.data)
    }
  }

  handleDelete = async event => {
    try {
      await deleteCampaignNotice(event.target.id)
      let notices = [...this.state.notices]
      notices = notices.filter(notice => notice.id !== Number(event.target.id))
      this.setState({ notices })
    } catch (err) {
      console.log(err.response.data)
    }
  }

  render () {
    const { campaignData, noticeText, notices } = this.state
    if (!campaignData) return null

    return (
      <Wrapper>
        <NoticeContain ref={ref => this.noticeboard = ref}>
          { notices.map(notice => (
            <NoticeText key={notice.id}>
              {notice.text}<br />
              <User>{notice.owner.username}</User>
              {this.props.admin && <NoticeDelete id={notice.id} onClick={this.handleDelete} >delete</NoticeDelete>}
            </NoticeText>
          )) }
        </NoticeContain>
        {this.props.admin &&
          <>
            <InputArea width='100%' submit={this.handleSubmit} name='textArea' value={noticeText} returnValue={this.handleChange} />
            <ChatControl send={this.handleSubmit} />
          </>}
      </Wrapper>
    )
  }
}

export default NoticeBox