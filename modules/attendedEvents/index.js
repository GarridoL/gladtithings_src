import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TextInput, Alert } from 'react-native';
import { Color, Routes, Helper } from 'common';
import { connect } from 'react-redux';
import CardsWithImages from '../generic/CardsWithImages';
import CustomizedHeader from '../generic/CustomizedHeader';
import IncrementButton from 'components/Form/Button';
import Api from 'services/api/index.js';
import { Spinner } from 'components'
import _ from 'lodash';
import Skeleton from 'components/Loading/Skeleton';
import AmountInput from 'modules/generic/AmountInput'

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class AttendedEvents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
      donate: false,
      amount: 0,
      isLoading: false,
      events: [],
      limit: 8,
      offset: 0,
      currency: 'USD'
    }
  }

  componentDidMount() {
    this.retrieveEvents(false)
    this.setState({ currency: this.props.state.ledger?.currency || 'USD' })
  }

  retrieveEvents = (flag) => {
    const { user } = this.props.state;
    const { limit, offset, events } = this.state;
    let parameter = {
      condition: [{
        value: user.id,
        column: 'account_id',
        clause: '='
      }],
      sort: { created_at: 'asc' },
      limit: limit,
      offset: flag == true && offset > 0 ? (offset * this.state.limit) : offset
    }
    this.setState({ isLoading: true })
    console.log(Routes.eventAttendeesRetrieve, parameter);
    Api.request(Routes.eventAttendeesRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        response.data.map((item, index) => {
          item['logo'] = item.event.image?.length > 0 ? item.event.image[0].category : null
          item['address'] = item.event.location
          item['date'] = item.event.start_date
        })
        this.setState({
          events: flag == false ? response.data : _.uniqBy([...events, ...response.data], 'id'),
          offset: flag == false ? 1 : (offset + 1)
        })
      } else {
        this.setState({
          data: flag == false ? [] : events,
          offset: flag == false ? 0 : offset
        })
      }
    }, error => {
      console.log(error)
      this.setState({ isLoading: false })
    })
  }

  removeEvents = (item) => {
    console.log(item);
    Alert.alert('Unattend?', 'Are you sure you want to delete this event from the events you attended?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          this.setState({ isLoading: true })
          Api.request(Routes.eventAttendeesDelete, {
            id: item.id
          }, response => {
            this.setState({ isLoading: false })
            if (response.data) {
              this.retrieveEvents(false);
            }
          }, error => {
            this.setState({ isLoading: false })
            console.log(error)
          })
        }
      },
    ]);
  }

  render() {
    const { theme, user, paypalUrl } = this.props.state;
    const { donate, amount, events, isLoading, loadingEvent } = this.state;
    return (
      <View style={{ backgroundColor: Color.containerBackground }}>
        <ScrollView showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            let scrollingHeight = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y
            let totalHeight = event.nativeEvent.contentSize.height
            if (event.nativeEvent.contentOffset.y <= 0) {
              if (isLoading == false) {
                // this.retrieve(false)
              }
            }
            if (scrollingHeight >= (totalHeight)) {
              if (isLoading == false) {
                this.retrieveEvents(true)
              }
            }
          }}
          style={{
            backgroundColor: Color.containerBackground
          }}>
          <View style={{ marginBottom: height / 2, }}>
            <View style={{ marginTop: 20 }}>
              <CardsWithImages
                button={true}
                version={1}
                data={events}
                buttonColor={theme ? theme.secondary : Color.secondary}
                buttonTitle={'Donate'}
                redirect={(item) => { this.removeEvents(item) }}
                buttonClick={(item) => { this.props.navigation.navigate('otherTransactionStack', { type: 'Send Event Tithings', data: item }) }}
              />
              {!isLoading && events.length == 0 &&
                <View style={{
                  paddingLeft: 20,
                  paddingRight: 20
                }}>
                  <Text>No upcoming events</Text>
                </View>
              }
              {isLoading &&
                <View style={{
                  flexDirection: 'row',
                  width: width
                }}>
                  <View style={{ width: '50%' }}>
                    <Skeleton size={1} template={'block'} height={150} />
                  </View>
                  <View style={{ width: '50%' }}>
                    <Skeleton size={1} template={'block'} height={150} />
                  </View>
                </View>}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setPaypalUrl: paypalUrl => dispatch(actions.setPaypalUrl(paypalUrl)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AttendedEvents);

