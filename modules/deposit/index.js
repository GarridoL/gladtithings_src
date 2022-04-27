import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, Alert, TouchableOpacity, TextInput } from 'react-native';
import { Color, Routes, Helper, BasicStyles } from 'common';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChurch } from '@fortawesome/free-solid-svg-icons';
import IncrementButton from 'components/Form/Button';
import CustomizedHeader from '../generic/CustomizedHeader';
import { Spinner } from 'components';
import Api from 'services/api/index.js';
import AmountInput from 'modules/generic/AmountInput'
import ModalSelector from 'react-native-modal-selector'

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);

class Deposit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      card: null,
      isLoading: false,
      subscribeId: null,
      currency: 'USD',
      ledger: null,
      cycle: null
    };
  }

  componentDidMount() {
    this.setState({ currency: this.props.state.ledger?.currency || 'USD' });
  }

  unsubscribe = () => {
    Alert.alert('Confirmation', 'Are you sure you want to cancel your subscription ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => this.proceed(),
      },
    ]);
  }

  onChange(input) {
    this.setState({ cycle: input })
  }

  cycle = () => {
    const { data } = this.props.navigation?.state?.params;
    const { theme } = this.props.state;
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 15
        }}>

        <ModalSelector
          data={Helper.cycles}
          initValue="Click here to select"
          selectTextStyle={{color: Color.white}}
          style={{width: '50%'}}
          selectStyle={{backgroundColor: theme ? theme.primary : Color.primary, borderRadius: 25}}
          selectedKey={data.cycle === 'Weekly' ? 1 : data.cycle === 'Twice a week' ? 2 : data.cycle === 'End of the month' ? 3 : data.cycle === 'Monthly' ? 4 : data.cycle === 'Quarterly' ? 5 : data.cycle === 'Semi-annually' ? 6 : data.cycle === 'Annually' ? 7 : ''}
          onChange={(option) => { this.setState({
            cycle: option.label
          }) }} />

      </View>
    );
  }


  proceed = () => {
    const { params } = this.props.navigation.state;
    let parameter = {
      id: params.data.id,
    };
    this.setState({ isLoading: true })
    Api.request(Routes.SubscriptionDelete, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data != null) {
        this.props.navigation.navigate('pageMessageStack', { payload: 'success', title: 'Success' });
      } else {
        this.props.navigation.navigate('pageMessageStack', { payload: 'error', title: 'Error' });
      }
    });
  }

  retrieveLedger = (currency) => {
    const { user } = this.props.state;
    const { amount } = this.state;
    let parameter = {
      condition: [
        {
          clause: '=',
          column: 'account_id',
          value: user.id
        }
      ],
      account_code: user.code,
      account_id: user.id
    }
    console.log(Routes.ledgerSummary, parameter);
    this.setState({ isLoading: true })
    Api.request(Routes.ledgerSummary, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        let ledger = response.data.filter(item => item.currency == currency);
        console.log(ledger, currency)
        if (ledger.length > 0) {
          this.setState({ ledger: ledger[0] })
          if (parseFloat(ledger[0].available_balance) >= parseFloat(amount)) {
            if (this.props.navigation?.state?.params?.type !== 'Subscription Donation') {
              this.createLedger();
            } else {
              this.subscribe();
            }
          } else {
            Alert.alert('Payment Error', 'Cash in more to donate this kind of amount.');
          }
        } else {
          Alert.alert('Payment Error', 'You have no balance for this currency.');
        }
      }
    }, error => {
      console.log(error);
      this.setState({ isLoading: false })
    });
  }

  createPayment = () => {
    let cur = this.props.state.ledger?.currency || this.state.currency;
    const { params } = this.props.navigation.state;
    if (this.state.amount === null || this.state.amount === 0) {
      Alert.alert('Payment Error', 'You are missing your amount.');
    } else if (this.state.cycle === null && params?.type === 'Subscription Donation') {
      Alert.alert('Payment Error', 'You are missing your plan.');
    } else {
      this.retrieveLedger(cur)
    }
  };

  createLedger = () => {
    const { params } = this.props.navigation.state;
    const { user } = this.props.state;
    let tempDetails = null;
    let tempDesc = null;
    if (this.state.subscribeId !== null) {
      tempDetails = JSON.stringify({ name: 'subscription', from: user.id, to: params.data.account_id }) //this.state.subscribeId
      tempDesc = 'Subscription'
      this.sendDirectTransfer(params.data, tempDetails, tempDesc)
    } else {
      if (params?.type === 'Send Tithings') {
        tempDetails = 'church_donation'
        tempDesc = 'Church Donation'
        this.sendDirectTransfer(params.data, tempDetails, tempDesc)
      } else if (params?.type === 'Send Event Tithings') {
        tempDetails = 'event_donation'
        tempDesc = 'Event Donation'
        this.sendEvent(tempDesc, params?.data)
      }
    }
  };

  sendEvent(tempDesc, data) {
    const { user } = this.props.state;
    const { currency } = this.state;
    let parameter = {
      account_id: user.id,
      account_code: user.code,
      amount: this.state.amount * -1,
      currency: currency,
      details: data.id,
      description: tempDesc,
      to: data.account_id,
      topic: 'event-donation',
      title: 'New Event Donation',
      message: `${user.username} donated an amount of ${currency} ${this.state.amount} to your event: ${data.name}.`
    };
    Api.request(Routes.ledgerCreate, parameter, response => {
      this.setState({ isLoading: true })
      if (response.data) {
        this.props.navigation.navigate('pageMessageStack', { payload: 'success', title: 'Success' });
      } else {
        this.props.navigation.navigate('pageMessageStack', { payload: 'error', title: 'Error' });
      }
    });
  }

  sendDirectTransfer = (data, tempDetails, tempDesc) => {
    const { currency } = this.state;
    const { user } = this.props.state;
    console.log('OTP Create Request API Call', data)
    let parameter = {
      from: {
        code: user.code,
        id: user.id
      },
      to: {
        id: data.account_id
      },
      amount: this.state.amount,
      details: tempDetails,
      currency: currency,
      description: tempDesc
    }
    if (tempDetails === 'church_donation') {
      parameter = {
        topic: 'church-donation',
        title: 'New Church Donation',
        message: `${user.username} donated an amount of ${currency} ${this.state.amount} to your church.`,
        ...parameter,
      }
    }
    if (tempDesc === 'Subscription') {
      parameter = {
        topic: 'subscription',
        title: 'New Subscription',
        message: `You have a new subscriber to your church`,
        ...parameter,
      }
    }
    this.setState({ isLoading: true });
    console.log(Routes.sendDirectCreate, parameter, '-------------------------')
    Api.request(Routes.sendDirectCreate, parameter, response => {
      this.setState({ isLoading: false });
      if (response.data) {
        this.props.navigation.navigate('pageMessageStack', { payload: 'success', title: 'Success', data: tempDetails });
      } else {
        this.props.navigation.navigate('pageMessageStack', { payload: 'error', title: 'Error', data: tempDetails });
      }
    },
      (error) => {
        console.log('API ERROR', error);
        this.setState({ isLoading: false });
      },
    );
  };

  subscribe = () => {
    const { user } = this.props.state;
    const { currency, cycle } = this.state;
    const { params } = this.props.navigation.state;
    let parameters = {
      condition: [{
        value: params.data?.id,
        clause: '=',
        column: 'id'
      }]
    };
    this.setState({ isLoading: true })
    Api.request(Routes.merchantsRetrieve, parameters, responses => {
      this.setState({ isLoading: false })
      if (responses.data.length > 0) {
        if (responses.data[0].addition_informations !== 'subscription-enabled') {
          Alert.alert('Error subscription', 'The church disabled its subscription.')
          return
        }
        let parameter = {
          account_id: user.id,
          merchant: params.data.id,
          amount: this.state.amount,
          currency: currency,
          cycle: cycle,
          to: params.data.account_id
        };
        Api.request(Routes.SubscriptionCreate, parameter, response => {
          this.setState({ isLoading: true })
          if (response.data != null) {
            this.setState({ subscribeId: response.data })
            this.createLedger()
          }
        }, error => {
          Alert.alert('Error', error);
        });
      } else {
        Alert.alert('Error subscription' + verified, 'The church disabled its subscription.')
        return
      }
    }, error => {
      this.setState({ isLoading: false })
      console.log(error)
    });
  }

  updatePayment = () => {
    const { user } = this.props.state;
    const { currency, cycle } = this.state;
    const { params } = this.props.navigation.state;
    let parameter = {
      id: params.data.id,
      code: params.data.code,
      account_id: user.id,
      merchant: params.data.merchant,
      amount: this.state.amount === 0 ? params.data.amount : this.state.amount,
      currency: currency,
      cycle: cycle === null ? params.cycle : cycle
    };
    this.setState({ isLoading: true })
    Api.request(Routes.SubscriptionUpdate, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data == true) {
        this.props.navigation.navigate('pageMessageStack', { payload: 'success', title: 'Success' });
      } else {
        this.props.navigation.navigate('pageMessageStack', { payload: 'error', title: 'Error' });
      }
      if (respose.error !== null) {
        this.props.navigation.navigate('pageMessageStack', { payload: 'error', title: 'Error' });
      }
    });
  }

  render() {
    const { theme, language, user } = this.props.state;
    const { amount, isLoading } = this.state;
    const { data } = this.props.navigation?.state?.params;
    const { params } = this.props.navigation?.state
    return (
      <View
        style={{
          height: height,
          backgroundColor: Color.containerBackground,
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              minHeight: height + height * 0.5,
            }}>
            {(params?.type ===
              'Subscription Donation' ||
              params?.type ===
              'Edit Subscription Donation' ||
              params?.type ===
              'Send Tithings') && (
                <View
                  style={{
                    height: height / 4,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: width,
                    backgroundColor: theme ? theme.primary : Color.primary,
                    borderBottomRightRadius: 30,
                    borderBottomLeftRadius: 30,
                  }}>
                  <FontAwesomeIcon
                    icon={faChurch}
                    size={height / 6}
                    style={{
                      color: 'white',
                    }}
                  />
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: 'Poppins-SemiBold',
                    }}>
                    {data?.merchant_details != null ? data?.merchant_details?.name : data?.name}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: 'Poppins-SemiBold',
                    }}>
                    {data?.merchant_details != null ? data?.merchant_details?.address : data?.address}
                  </Text>
                </View>
              )}

            {params?.type ===
              'Send Event Tithings' && (
                <CustomizedHeader
                  data={{
                    merchant_details: {
                      name: data.name,
                      address: data.address,
                      logo: data.logo
                    },
                    amount: parseFloat(0)
                  }}
                  version={2}
                  redirect={() => {
                    this.props.navigation.navigate('subscriptionStack')
                  }}
                />
              )}

            <View
              style={{
                paddingTop: 20,
                paddingLeft: 20,
                paddingRight: 20,
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                {
                  (params?.type === 'Edit Subscription Donation') ?
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{
                        fontFamily: 'Poppins-SemiBold'
                      }}>Current Amount: {data?.currency} {data?.amount}</Text>
                      <Text style={{
                        fontFamily: 'Poppins-SemiBold'
                      }}>Current Schedule: {data?.cycle.toUpperCase()}</Text>
                      <AmountInput
                        onChange={(amount, currency) => this.setState({
                          amount: amount
                        })
                        }
                        maximum={(user && Helper.checkStatus(user) >= Helper.accountVerified) ? Helper.MAX_VERIFIED : Helper.MAX_NOT_VERIFIED}
                        type={{
                          type: 'Cash In'
                        }}
                        disableRedirect={false}
                        navigation={this.props.navigation}
                      />
                    </View> :
                    <AmountInput
                      onChange={(amount, currency) => this.setState({
                        amount: amount
                      })
                      }
                      maximum={(user && Helper.checkStatus(user) >= Helper.accountVerified) ? Helper.MAX_VERIFIED : Helper.MAX_NOT_VERIFIED}
                      type={{
                        type: 'Cash In'
                      }}
                      disableRedirect={false}
                      navigation={this.props.navigation}
                    />}
              </View>
            </View>
            {(params?.type === 'Subscription Donation' || params?.type === 'Edit Subscription Donation') &&
              <View style={{ width: '100%', alignItems: 'center' }}>
                <Text style={{ fontWeight: '500', alignItems: 'center', alignContent: 'center', marginTop: 5 }}>{language.subscription.choosePlan}</Text>
                {this.cycle()}
              </View>}
          </View>
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            bottom: 90,
            left: 0,
            paddingLeft: 20,
            paddingRight: 20,
            width: '100%',
          }}>
          {
            (this.props.navigation?.state?.params?.type !==
              'Edit Subscription Donation') ? (
              <IncrementButton
                style={{
                  backgroundColor: Color.secondary,
                  width: '100%',
                }}
                textStyle={{
                  fontFamily: 'Poppins-SemiBold',
                }}
                onClick={() => {
                  this.createPayment()
                  // this.props.navigation.navigate('otpStack');
                }}
                title={language.subscription.proceed}
              />
            ) : (
              <View style={{
                width: '100%',
                flex: 1,
                flexDirection: 'row'
              }}>
                <IncrementButton
                  style={{
                    backgroundColor: Color.danger,
                    width: '50%',
                    marginRight: 5
                  }}
                  textStyle={{
                    fontFamily: 'Poppins-SemiBold',
                  }}
                  onClick={() => {
                    this.unsubscribe()
                  }}
                  title={language.subscription.cancelSubscription}
                />
                <IncrementButton
                  style={{
                    backgroundColor: Color.secondary,
                    width: '50%',
                    marginLeft: 5
                  }}
                  textStyle={{
                    fontFamily: 'Poppins-SemiBold',
                  }}
                  onClick={() => {
                    this.updatePayment()
                  }}
                  title={language.subscription.saveChanges}
                />
              </View>
            )
          }
        </View>
        {isLoading ? <Spinner mode="overlay" /> : null}
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

export default connect(mapStateToProps, mapDispatchToProps)(Deposit);
