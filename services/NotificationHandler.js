import React, { Component } from 'react';
import { View, Text, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Helper } from 'common';
import NotificationSounds, { playSampleSound } from 'react-native-notification-sounds';
import Api from 'services/api/index.js';
import { fcmService } from 'services/broadcasting/FCMService';
class NotificationHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    const { notificationHandler } = this.props;
    notificationHandler(this);
  }
  componentWillUnmount() {
    const { notificationHandler } = this.props;
    notificationHandler(undefined);
  }

  onRegister = (token) => {
    console.log('a')
  }

  onOpenNotification = (notify) => {
    console.log('a')
    // console.log("[App] onOpenNotification", notify)
  }

  setTopics() {
    const { user } = this.props.state;
    console.log(user);
    if (fcmService && user) {
      fcmService.subscribeTopic('ticket-comment')
      fcmService.subscribeTopic('comment-reply')
      fcmService.subscribeTopic(user.id)
    }
  }

  removeTopics() {
    const { user } = this.props.state;
    if (fcmService && user) {
      fcmService.unsubscribeTopic(user.id)
      fcmService.unsubscribeTopic('ticket-comment')
      fcmService.unsubscribeTopic('comment-reply')
    }
  }

  playSound = () => {
    NotificationSounds.getNotifications('notification').then(soundsList => {
      let audio = null
      for (var i = 0; i < soundsList.length; i++) {
        let item = soundsList[i]
        if (item.title === 'Doorbell') {
          audio = item
          break
        }
      }
      if (soundsList && audio == null) {
        audio = soundsList[1]
      }
      playSampleSound(audio);
    });
  }

  onNotification = (notify) => {
    const { user } = this.props.state;
    let data = null
    if (user == null || !notify.data) {
      return
    }
    let notif = notify.data
    data = JSON.parse(notif.data)
    let topic = data.topic
    console.log('payload', topic)
    switch (topic?.toLowerCase()) {
      case 'message': {
        const { messengerGroup } = this.props.state;
        if (parseInt(data.messenger_group_id) == messengerGroup?.messenger_group_id) {
          const { updateMessagesOnGroup } = this.props;
          updateMessagesOnGroup(data);
          if (parseInt(data.account_id) != user.id) {
            this.playSound()
          }
          return
        }
      }
        break
      case 'notifications': {
        if (parseInt(data.to) == user.id) {
          console.log("[Notifications] data", data)
          const { updateNotifications } = this.props;
          updateNotifications(1, data)
        }
      }
        break
      case 'ticket-comment': {
        const { setComments } = this.props;
        const { comments } = this.props.state;
        if (data.account_id != user.id) {
          if (comments.length > 0) {
            comments.unshift(data)
          } else {
            comments.push(data)
          }
          setComments(comments)
          this.playSound()
        }
      }
        break
      case 'comment-reply': {
        const { setComments } = this.props;
        let comments = this.props.state?.comments;
        comments.length > 0 && comments.map((item, index) => {
          if(item.id == data.comment_id && data.account_id !== user.id) {
            if(item.comment_replies?.length > 0) {
              item.comment_replies.push(data)
            } else {
              item['comment_replies'] = [data];
            }
            return item;
          }
        })
        setComments(comments);
      }
        break
      case 'subscription': {
        console.log(data)
        this.playSound()
      }
        break
      case 'attend-event': {
        console.log(data)
        this.playSound()
      }
        break
      case 'event-donation': {
        console.log(data)
        this.playSound()
      }
        break
      case 'church-donation': {
        console.log(data)
        this.playSound()
      }
        break
      case 'direct-transfer': {
        console.log(data)
        this.playSound()
      }
        break
    }
  }

  render() {
    return (
      <View>
      </View>
    )
  }
}


const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setUnReadMessages: (messages) => dispatch(actions.setUnReadMessages(messages)),
    setUnReadRequests: (requests) => dispatch(actions.setUnReadRequests(requests)),
    updateRequests: (request) => dispatch(actions.updateRequests(request)),
    setRequest: (request) => dispatch(actions.setRequest(request)),
    updateNotifications: (unread, notification) => dispatch(actions.updateNotifications(unread, notification)),
    updateMessagesOnGroup: (message) => dispatch(actions.updateMessagesOnGroup(message)),
    viewChangePass: (changePassword) => dispatch(actions.viewChangePass(changePassword)),
    setComments: (comments) => dispatch(actions.setComments(comments)),
    setAcceptPayment: (acceptPayment) => dispatch(actions.setAcceptPayment(acceptPayment)),
    setPaymentConfirmation: (flag) => dispatch(actions.setPaymentConfirmation(flag)),
    showDeviceNotification: (deviceNotification) => dispatch(actions.showDeviceNotification(deviceNotification))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationHandler);
