import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Color, Routes } from 'common';
import Style from './Style.js';
import { connect } from 'react-redux';
import CardsWithImages from 'src/modules/generic/CardsWithImages';
import CustomizedHeader from 'src/modules/generic/CustomizedHeader';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Api from 'services/api/index.js';
import Skeleton from 'components/Loading/Skeleton';
import {Spinner} from 'components';
import Geolocation from '@react-native-community/geolocation';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
      churches: [],
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      isLoading: false,
      isLoading1: false,
      isLoading2: false,
      events: [],
      offset: 0,
      limit: 5,
      recentlyVisited: [],
      loadingEvent: false,
      currentSubscription: null,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
        formatted_address: null,
      },
    }
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      const config = {
        enableHighAccuracy: false
      };
      Geolocation.getCurrentPosition(
        info => {
          this.setState({
            region: {
              ...this.state.region,
              // latitude: info.coords.latitude,
              // longitude: info.coords.longitude
              latitude: 10.3241515,
              longitude: 123.9099824
            }
          }, () => {
            this.retrieveChurches()
          })
        },
        error => console.log("ERROR", error),
        config,
      );
      this.retrieveEvents()
      this.retrieveRecentlyVisitedChurches()
      this.retrieveAllSubscriptions()
    })
  }

  
  retrieveAllSubscriptions = () => {
    const { user } = this.props.state;
    let parameter = {
      account_id: user.id
    }
    this.setState({ isLoading: true })
    Api.request(Routes.SubscriptionRetrieveByParams, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        response.data.map(item => {
          item.merchant_details.address = JSON.parse(item.merchant_details?.address)?.name
        })
        this.setState({ currentSubscription: {
          ...response.data[0],
          address: response.data[0].merchant_details.address,
          amount: 20,
          date: response.data[0].next_month,
          logo: response.data[0].merchant_details.logo
        }})
      }
    }, error => {
      console.log(error);
      this.setState({ isLoading: false })
    });
  }

  retrieveRecentlyVisitedChurches = () => {
    const { user } = this.props.state;
    let parameter = {
      condition: [{
        value: user.id,
        column: 'account_id',
        clause: '='
      }],
      limit: 6,
      sort: {created_at: 'desc'}
    }
    this.setState({isLoading: true});
    console.log(parameter, Routes.recentlyVisitedChurchesRetrieve)
    Api.request(Routes.recentlyVisitedChurchesRetrieve, parameter, response => {
      this.setState({isLoading: false});
      let temp = []
      if(response.data?.length > 0) {
        response.data.map((item, index) => {
         temp.push({
          id: item.merchant.id,
          address: JSON.parse(item.merchant?.address)?.name,
          logo: item.merchant.logo,
          name: item.merchant.name,
          account_id: item.merchant.account_id,
          addition_informations: item.merchant.addition_informations
         })
        })
      }
      this.setState({ recentlyVisited: temp })
    }, error => {
      console.log(error)
    })
  }

  retrieveEvents = () => {
    const { user } = this.props.state;
    const { limit, offset } = this.state;
    let parameter = {
      condition: [{
        value: new Date(),
        column: 'start_date',
        clause: '>'
      }],
      sort: { created_at: 'asc' },
      limit: limit,
      offset: offset
    }
    this.setState({isLoading2: true})
    Api.request(Routes.eventsRetrieve, parameter, response => {
      this.setState({isLoading2: false})
      if (response.data.length > 0) {
        response.data.map((item, index) => {
          item['logo'] = item.image?.length > 0 ? item.image[0].category : null
          item['address'] = item.location
          item['date'] = item.start_date
        })
        this.setState({ events: response.data })
      }
    }, error => {
      console.log(error)
    })
  }

  retrieveChurches = () => {
    const { days, region } = this.state;
    let parameter = {
      sort: { created_at: 'asc' },
      masses: {
        latitude: region.latitude,
        longitude: region.longitude
      }
    }
    this.setState({ isLoading1: true })
    console.log(Routes.merchantsRetrieve, parameter)
    Api.request(Routes.merchantsRetrieve, parameter, response => {
      this.setState({ isLoading1: false })
      console.log('[RESPONSE] CHURCH ', response)
      if (response.data.length > 0) {
        let temp = [];
        response.data.map((item, index) => {
          let sched = [];
          if (item.schedule) {
            sched = JSON.parse(item.schedule)
          }
          sched.length > 0 && sched.map((items, inde) => {
            let currentDay = new Date().getDay();
            if (items.title === days[currentDay]) {
              items.schedule.length > 0 && items.schedule.map((i, ind) => {
                console.log(i, '---')
                let a = i.startTime.split(':')
                let b = i.endTime.split(':')
                let aIsAm = parseInt(a[0]) <= 12 ? 'AM' : 'PM'
                let bIsAm = parseInt(b[0]) <= 12 ? 'AM' : 'PM'
                temp.push({
                  id: item.id,
                  address: JSON.parse(item.address)?.name,
                  logo: item.logo,
                  name: i.name,
                  date: `${days[currentDay]} ${i.startTime} ${aIsAm} - ${i.endTime} ${bIsAm}`,
                  account_id: item.account_id,
                  addition_informations: item.addition_informations
                })
              })
            }
          })
          this.setState({
            churches: temp
          })
        })
      }
    }, error => {
      console.log(error)
      this.setState({ isLoading1: false })
    });
  }

  render() {
    const { theme, user, language } = this.props.state;
    const { churches, isLoading, events, recentlyVisited, loadingEvent, currentSubscription, isLoading1, isLoading2 } = this.state;
    return (
      <View style={{
        backgroundColor: Color.containerBackground
      }}>
        {loadingEvent && <Spinner mode="overlay" />}
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View style={{
            marginBottom: height / 2
          }}>
            {currentSubscription ? <CustomizedHeader
              version={2}
              data={{
                merchant_details: {
                  name: currentSubscription.name,
                  logo: currentSubscription.logo,
                  address: currentSubscription.address,
                },
                amount: currentSubscription.amount,
                next_month: currentSubscription.next_month
              }}
              redirect={() => {
                this.props.navigation.navigate('subscriptionStack')
              }}
            /> : 
            <CustomizedHeader
              version={4}
              text={language.homepage.noSubscription}
              redirect={() => {
                this.props.navigation.navigate('subscriptionStack')
              }}
            />
            }
            <View>
              {recentlyVisited.length > 0 && <View style={Style.title}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    width: '50%'
                  }}
                >{language.visitedChurches}</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('churchesStack')
                  }}
                  style={Style.right}
                >
                  <FontAwesomeIcon
                    icon={faSearch}
                    size={15}
                    style={{
                      color: theme ? theme.primary : Color.primary,
                      marginTop: 4
                    }}
                  />
                  <Text style={{
                    fontFamily: 'Poppins-SemiBold',
                    marginRight: 5,
                    color: theme ? theme.primary : Color.primary
                  }}>{language.findChurch}</Text>
                </TouchableOpacity>
              </View>}
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
              <CardsWithImages
                version={1}
                button={true}
                data={recentlyVisited}
                buttonColor={theme ? theme.secondary : Color.secondary}
                buttonTitle={language.subscribe}
                redirect={(index) => { this.props.navigation.navigate('churchProfileStack', { data: index }) }}
                buttonClick={(item) => { this.props.navigation.navigate('otherTransactionStack', { type: 'Subscription Donation', data: item }) }}
              />
              {churches.length > 0 && <View style={Style.title}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    width: '50%'
                  }}
                >{language.nearbyMass}</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('massesStack')
                  }}
                  style={Style.right}
                >
                  <Text style={{
                    fontFamily: 'Poppins-SemiBold',
                    color: theme ? theme.primary : Color.primary
                  }}>{language.findMass + '>>>'}</Text>

                </TouchableOpacity>
              </View>}
              {isLoading1 &&
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
              <CardsWithImages
                version={1}
                data={churches}
                buttonColor={theme ? theme.secondary : Color.secondary}
                buttonTitle={language.subscribe}
                redirect={(data) => { this.props.navigation.navigate('churchProfileStack', { data: data }) }}
                buttonClick={(item) => { this.props.navigation.navigate('otherTransactionStack', { type: 'Subscription Donation', data: item }) }}
              />
              {events.length > 0 && <View style={Style.title}>
                <Text
                  numberOfLines={1}
                  style={{
                    fontFamily: 'Poppins-SemiBold',
                    width: '50%'
                  }}
                >{language.upcomingEvents}</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('eventsStack')
                  }}
                  style={Style.right}
                >
                  <Text style={{
                    fontFamily: 'Poppins-SemiBold',
                    color: theme ? theme.primary : Color.primary
                  }}>{language.viewMore + '>>>'}</Text>

                </TouchableOpacity>
              </View>}
              {isLoading2 &&
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
              <CardsWithImages
                button={true}
                version={1}
                data={events}
                buttonColor={theme ? theme.secondary : Color.secondary}
                buttonTitle={language.donate}
                redirect={(item) => { this.props.navigation.navigate('viewEventStack', {data : item}) }}
                buttonClick={(item) => { this.props.navigation.navigate('otherTransactionStack', { type: 'Send Event Tithings', data: item }) }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(HomePage);
