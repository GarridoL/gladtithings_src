import React, { Component } from 'react';
import { View, ScrollView, Dimensions, Alert, Image, Text } from 'react-native';
import { Color, Routes } from 'common';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import _ from 'lodash';
import IncrementButton from 'components/Form/Button';
import Config from 'src/config.js'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarAlt, faMapMarkerAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import Style from './Style';
import Skeleton from 'components/Loading/Skeleton';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class ViewEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
      donate: false,
      amount: 0,
      isLoading: false,
      event: [],
      limit: 8,
      offset: 0,
      currency: 'PHP',
      loadingEvent: false
    }
  }

  componentDidMount() {
    this.retrieveEvents()
    this.setState({ currency: this.props.state.ledger?.currency || 'PHP' })
  }

  attendEvent = (item) => {
    Alert.alert('Attend Event?', `Are you sure you want to attend this event`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Attend',
        onPress: () => this.addToEventAttendees(item),
      },
    ]);
  }

  addToEventAttendees = (event) => {
    this.setState({ loadingEvent: true })
    console.log(Routes.eventAttendeesCreate, {
      event_id: event.id,
      account_id: this.props.state.user.id,
      event_name: event.name,
      username: this.props.state.user.username
    });
    Api.request(Routes.eventAttendeesCreate, {
      event_id: event.id,
      account_id: this.props.state.user.id,
      event_name: event.name,
      username: this.props.state.user.username
    }, response => {
      this.setState({ loadingEvent: false })
      if (response.data > 0) {
        Alert.alert('Success', `You successfully attended to "${event.name}" event.`);
      } else {
        Alert.alert('Error', response.error);
      }
    }, error => {
      this.setState({ loadingEvent: false })
      console.log(error)
    })
  }

  retrieveEvents = () => {
    const { params } = this.props.navigation.state;
    console.log(params, '---');
    let parameter = {
      condition: [{
        value: params.data.id,
        column: 'id',
        clause: '='
      }],
      sort: { created_at: 'asc' },
      limit: 1,
      offset: 0
    }
    this.setState({ isLoading: true })
    Api.request(Routes.eventsRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        response.data.map((item, index) => {
          item['logo'] = item.image?.length > 0 ? item.image[0].category : null
          item['address'] = item.location
          item['date'] = item.start_date
        })
        this.setState({
          event: response.data[0]
        })
      }
    }, error => {
      console.log(error)
      this.setState({ isLoading: false })
    })
  }

  createPayment = async () => {
    if (this.state.amount !== null && this.state.amount > 0) {
      this.createLedger();
    } else {
      Alert.alert('Donation Error', 'You are missing your amount.');
    }
  };

  createLedger = () => {
    const { user } = this.props.state;
    const { event } = this.state;
    let params = {
      account_id: user.id,
      account_code: user.code,
      amount: -(this.state.amount),
      currency: this.state.currency,
      details: event[0]?.id,
      description: 'Event Donation',
    };
    Api.request(Routes.ledgerCreate, params, response => {
      console.log('[CHARGE RESPONSE]', response);
      this.setState({ isLoading: true })
      if (response.data != null) {
        this.props.navigation.navigate('pageMessageStack', { payload: 'success', title: 'Success' });
      }
      if (respose.error !== null) {
        this.props.navigation.navigate('pageMessageStack', { payload: 'error', title: 'Error' });
      }
    });
  };

  versionTwo = (data) => {
    const { theme } = this.props.state;
    const { isLoading } = this.state;
    return (
      <View style={{
        justifyContent: 'center',
        // alignItems: 'center',
        width: width,
        flexDirection: 'row',
        backgroundColor: theme ? theme.primary : Color.primary,
        padding: isLoading ? 0 : 20,
        paddingBottom: 30,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15
      }}>
        {
          (isLoading) && (
            <Skeleton size={1} template={'block'} height={(height / 4) - 40} />
          )
        }
        {!isLoading && <View style={{
          width: '50%',
          height: (height / 4) - 40,
          backgroundColor: 'white',
          borderRadius: 10
        }}>
          <Image
            source={{ uri: Config.BACKEND_URL + data?.logo }}
            style={{
              height: '100%',
              width: '100%',
              borderRadius: 10
            }}
          />
        </View>}
        {!isLoading && <View style={{
          width: '50%',
          paddingLeft: 15,
          paddingRight: 15
        }}>
          <Text style={{
            color: Color.white,
            fontFamily: 'Poppins-SemiBold'
          }}>{data?.name}</Text>
          <Text numberOfLines={7}>{data?.description}</Text>
        </View>}
      </View>
    )
  }

  details = (icon, text) => {
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 5,
        marginBottom: 5
      }}>
        <FontAwesomeIcon
          icon={icon}
          size={20}
          style={{ marginRight: 10, marginTop: -2 }}
        />
        <Text>{text}</Text>
      </View>
    )
  }
  render() {
    const { donate, event, isLoading } = this.state;
    const { language } = this.props.state;
    return (
      <View style={{ backgroundColor: Color.containerBackground }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            {this.versionTwo(event)}
          </View>
          <View style={{
            marginBottom: height / 2,
            height: height,
            backgroundColor: Color.containerBackground,
            alignItems: 'center',
            marginTop: 10,
            width: width
          }}>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 20,
              marginBottom: 20
            }}>
              <IncrementButton style={{
                backgroundColor: Color.primary,
                width: '40%',
                marginRight: 20
              }}
                onClick={() => {
                  this.attendEvent(event)
                }}
                title={language.events.attend}
              />

              <IncrementButton style={{
                backgroundColor: Color.secondary,
                width: '40%'
              }}
                onClick={() => {
                  this.props.navigation.navigate('otherTransactionStack', { type: 'Send Tithings', data: event })
                }}
                title={language.Donation}
              />
            </View>

            {!isLoading && <View style={Style.card}>
              <Text>Attendees for this event is limited to {event?.limit} only.</Text>
            </View>}
            {
              (isLoading) && (
                <Skeleton size={1} template={'block'} height={75} />
              )
            }
            {
              (isLoading) && (
                <Skeleton size={1} template={'block'} height={120} />
              )
            }
            {!isLoading && <View style={[Style.card, {
              marginTop: 20
            }]}>
              {this.details(faMapMarkerAlt, event?.address)}
              {this.details(faCalendarAlt, `Event will start on ${event?.start_date}`)}
              {this.details(faCalendarAlt, `Event will end on ${event?.end_date}`)}
            </View>}
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

export default connect(mapStateToProps, mapDispatchToProps)(ViewEvent);
