import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Color, Routes } from 'common';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import CardsWithIcon from '../generic/CardsWithIcon';
import BalanceCard from 'modules/generic/BalanceCard.js';
import IncrementButton from 'components/Form/Button';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Subscription from 'modules/generic/Subscriptions.js';
import { Spinner } from 'components';
import QRCodeModal from 'components/Modal/QRCode';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

const data = [
  {
    id: 0,
    title: 'Churh 1',
    description: "Receives email address every time there's a login of the account.",
    date: 'July 23, 2021 5:00 PM',
    amount: 'USD 10.00'
  },
  {
    id: 1,
    title: 'Churh 2',
    description: "Receives email address every time there's a login of the account.",
    date: 'July 23, 2021 5:00 PM',
    amount: 'USD 10.00'
  },
  {
    id: 2,
    title: 'Churh 1',
    description: "Receives email address every time there's a login of the account.",
    date: 'July 23, 2021 5:00 PM',
    amount: 'USD 10.00'
  },
  {
    id: 3,
    title: 'Churh 2',
    description: "Receives email address every time there's a login of the account.",
    date: 'July 23, 2021 5:00 PM',
    amount: 'USD 10.00'
  },
  {
    id: 4,
    title: 'Churh 1',
    description: "Receives email address every time there's a login of the account.",
    date: 'July 23, 2021 5:00 PM',
    amount: 'USD 10.00'
  },
  {
    id: 5,
    title: 'Churh 2',
    description: "Receives email address every time there's a login of the account.",
    date: 'July 23, 2021 5:00 PM',
    amount: 'USD 10.00'
  }
]

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
      ledger: {
        currency: 'USD',
        available_balance: 0,
        current_balance: 0,
        balance: 0
      },
      isLoading: false
    }
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.retrieveBalance();
    })
  }

  retrieveBalance = () => {
    const { user } = this.props.state;
    let parameter = {
      condition: [
        {
          clause: '=',
          column: 'account_id',
          value: user.id
        }
      ],
      account_id: user.id,
      account_code: user.code
    }
    this.setState({ isLoading: true })
    Api.request(Routes.ledgerDashboard, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data) {
        this.setState({ ledger: response.data.ledger[0] });
        this.props.setLedger(response.data.ledger[0])
      }
    }, error => {
      console.log(error);
      this.setState({ isLoading: false });
    })
  }

  render() {
    const { theme } = this.props.state;
    const { ledger } = this.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView
          style={{
            height: height,
            backgroundColor: Color.containerBackground
          }} showsVerticalScrollIndicator={false}>
          {this.props.state?.isVisible?.isVisible && <QRCodeModal
            user={this.props.state?.user}
            navigation={this.props.navigation}
          />}
          <View style={{
            paddingLeft: 15,
            paddingBottom: 15,
            paddingRight: 15
          }}>
            {
              ledger && (
                <BalanceCard data={ledger} />
              )
            }

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
              marginBottom: 20
            }}>
              <IncrementButton style={{
                backgroundColor: Color.secondary,
                width: '40%'
              }}
                onClick={() => {
                  this.props.navigation.navigate('depositStack', { page: 'Deposit' })
                }}
                title={'Deposit'}
              />

              <IncrementButton style={{
                backgroundColor: Color.secondary,
                width: '40%'
              }}
                onClick={() => {
                  this.props.navigation.navigate('depositStack', { page: 'Withdraw' })
                }}
                title={'Withdraw'}
              />
            </View>

            <Subscription
              navigation={this.props.navigation}
            />

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
              marginBottom: 10
            }}>
              <Text style={{
                fontFamily: 'Poppins-SemiBold',
                color: Color.primary
              }}>Tithings</Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('transactionsStack')
                }}
              >

                <Text style={{
                  fontFamily: 'Poppins-SemiBold',
                }}>{'View more >>>'}</Text>

              </TouchableOpacity>
              {this.state.isLoading ? <Spinner mode="overlay" /> : null}
            </View>

            {
              data.map((item, index) => {
                return (
                  <CardsWithIcon
                    redirect={() => {
                      console.log('donate')
                    }}
                    version={3}
                    title={item.title}
                    description={item.description}
                    date={item.date}
                    amount={item.amount}
                    style={{
                      marginBottom: index == (data.length - 1) ? height * 0.5 : 0
                    }}
                  />
                )
              })
            }

          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setQRCodeModal: (isVisible) => dispatch(actions.setQRCodeModal({isVisible: isVisible})),
    setLedger: (ledger) => dispatch(actions.setLedger(ledger))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);