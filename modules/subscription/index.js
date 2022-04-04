import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { Color, Routes } from 'common';
import CardsWithIcon from 'modules/generic/CardsWithIcon';
import { connect } from 'react-redux';
import PaymentMethodCard from 'modules/generic/Cards';
import CustomizedHeader from 'modules/generic/CustomizedHeader';
import Button from 'modules/generic/Button';
import Api from 'services/api/index.js';

import Skeleton from 'components/Loading/Skeleton';
import EmptyMessage from 'modules/generic/Empty.js'

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Subscriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: false,
      payment: true,
      subscription: false,
      isLoading: false,
      dataLimit: [],
      dataNoLimit: [],
      data: [],
      dataPayment: [],
      items: null,
      limit: 4,
    }
  }

  componentDidMount = () => {
    this.retrieveAllSub()
    this.retrieveAllSubscriptions()
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
        this.setState({ data: response.data })
      } else {
        this.setState({ data: [] })
      }
    }, error => {
      console.log(error);
      this.setState({ isLoading: false })
    });
  }

  retrieveLTransaction = (flag) => {
    const { user } = this.props.state;
    let parameter = {
      condition: [{
        column: 'account_id',
        value: user.id,
        clause: '='
      }, {
        column: 'description',
        value: 'subscription',
        clause: '='
      }],
      sort: { created_at: 'desc' },
      limit: this.state.limit,
      offset: flag == true && this.state.offset > 0 ? (this.state.offset * this.state.limit) : this.state.offset
    }
    this.setState({ isLoading: true })
    Api.request(Routes.ledgerRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({
          dataLimit: response.data,
        })
      } else {
        this.setState({
          dataLimit: []
        })
      }
    });
  }

  retrieveAllSub = () => {
    const { user } = this.props.state;
    let parameter = {
      condition: [{
        column: 'account_id',
        value: user.id,
        clause: '='
      }, {
        column: 'description',
        value: 'subscription',
        clause: '='
      }],
      sort: { created_at: 'desc' }
    }
    this.setState({ isLoading: true })
    Api.request(Routes.ledgerRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({
          dataNoLimit: response.data,
        })
      }
    }, error => {
      console.log('[error]', error)
    });
  }

  render() {
    const { language, theme } = this.props.state;
    const { subscription, payment, isLoading, dataLimit, data, dataPayment, dataNoLimit } = this.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        {
          this.state.details === false ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <CustomizedHeader
                version={1}
                text={data === null ? language.subscription.noChurchSelectedMessage : language.subscription.ChurchSelectedMessage}
                redirect={() => {
                  this.props.navigation.navigate('churchesStack')
                }}
              />
              {
                (payment) && (
                  <View style={{ marginBottom: 100 }}>
                    <View style={{
                      paddingTop: 10,
                      paddingRight: 10,
                      paddingLeft: 10,
                      alignItems: 'center'
                    }}>
                      {data.length > 0 && data.map((item, index) => {
                        return (
                          <CustomizedHeader
                            version={3}
                            data={item}
                            redirect={() => {
                              this.setState({ details: true, items: item })
                              this.retrieveLTransaction(false)
                              this.retrieveAllSub(false)
                            }}
                          />
                        )
                      })
                      }
                      {
                        data.length === 0 && !isLoading && <EmptyMessage message={language.subscription.noSubscription} />
                      }
                      {
                        (isLoading && data.length === 0) && (
                          <Skeleton size={1} template={'block'} height={100} />
                        )
                      }
                    </View>
                  </View>
                )
              }
              {
                (subscription) && (
                  <View style={{
                    marginBottom: 100,
                    paddingLeft: 15,
                    paddingRight: 15
                  }}>
                    <Text
                      style={{
                        color: Color.primary,
                        fontSize: 14,
                        paddingTop: 20,
                        fontWeight: 'bold'
                      }}
                      onPress={() => { this.setState({ payment: true, subscription: false }) }}>{language.subscription.viewSubscriptionList}</Text>
                    <View style={{
                      flexDirection: 'row',
                      paddingTop: 15,
                      paddingBottom: 15
                    }}>
                      <View style={{ width: '50%' }}>
                        <Text style={{ fontFamily: 'Poppins-SemiBold' }}>{language.subscription.paymentMethods}</Text>
                      </View>
                      <TouchableOpacity style={{ width: '50%' }}
                        onPress={() => { this.props.navigation.navigate('paymentStack') }}>
                        <Text style={{
                          color: theme ? theme.primary : Color.primary,
                          fontFamily: 'Poppins-SemiBold',
                          textAlign: 'right'
                        }}>{language.add}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              }
            </ScrollView>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              <CustomizedHeader
                version={2}
                data={this.state.items}
                buttonText={language.edit}
                redirect={() => {
                  this.props.navigation.navigate('otherTransactionStack', { type: 'Edit Subscription Donation', data: this.state.items })
                }}
              />
              <View style={{
                marginBottom: 100,
                paddingTop: 10,
                paddingRight: 10,
                paddingLeft: 10,
                alignItems: 'center'
              }}>
                <View style={{
                  paddingLeft: 10,
                  paddingRight: 10,
                  minHeight: height + (height * 0.5)
                }}>
                  <View style={{
                    width: width - 40
                  }}>
                    {
                      dataLimit.length === 0 && !isLoading && <EmptyMessage message={language.subscription.noSubscription} />
                    }
                  </View>
                  <View style={{
                    width: width - 40
                  }}>
                    {
                      (isLoading && dataLimit.length === 0) && (
                        <Skeleton size={1} template={'block'} height={100} />
                      )
                    }
                  </View>
                  {
                    dataLimit.map((item, index) => {
                      return (
                        <CardsWithIcon
                          redirect={() => {
                            console.log('')
                          }}
                          version={3}
                          // tentative
                          description={item.description}
                          title={item.receiver ? item.receiver.email : item.description}
                          date={item.created_at}
                          amount={item.currency + ' ' + item.amount?.toLocaleString()}
                        />
                      )
                    })
                  }
                </View>
              </View>
            </ScrollView>
          )
        }
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Subscriptions);
