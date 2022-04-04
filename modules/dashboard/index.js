import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Color, Routes } from 'common';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import CardsWithIcon from '../generic/CardsWithIcon';
import BalanceCard from 'modules/generic/BalanceCard.js';
import IncrementButton from 'components/Form/Button';
import Subscription from 'modules/generic/Subscriptions.js';
import { Spinner } from 'components';
import Skeleton from 'components/Loading/Skeleton';
import EmptyMessage from 'modules/generic/Empty.js'

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

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
      isLoading: false,
      transactionLoading: false,
      data: [],
      offset: 0,
      limit: 5
    }
  }

  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.retrieveBalance();
      this.retrieveLedgerHistory()
    })
  }

  retrieveLedgerHistory = () => {
    const { user } = this.props.state;
    let parameter = {
      condition: [{
        column: 'account_id',
        value: user.id,
        clause: '='
      }, {
        column: 'account_id',
        value: user.id,
        clause: '='
      }],
      sort: { created_at: 'desc' },
      limit: 5,
      offset: 0
    }
    this.setState({ transactionLoading: true })
    Api.request(Routes.transactionHistoryRetrieve, parameter, response => {
      this.setState({ transactionLoading: false })
      if (response.data.length > 0) {
        this.setState({
          data: response.data
        })
      }
    }, error => {
      console.log(error)
      this.setState({ transactionLoading: false })
    });
  }


  retrieveBalance = () => {
    const {user} = this.props.state;
    if (user == null) {
      return;
    }
    let parameter = {
      account_id: user.id,
      account_code: user.code
    };
    this.setState({isLoading: true});
    Api.request(Routes.ledgerSummary, parameter, (response) => {
      this.setState({isLoading: false});
      const { setLedger } = this.props;
      if (response.data.length > 0) {
        setLedger(response.data[0])
        this.setState({
          ledger: response.data
        })
      } else {
        setLedger(null);
        this.setState({
          ledger: null
        })
      }
    }, error => {
      this.setState({isLoading: false, history: null});
    });
  }

  render() {
    const { language } = this.props.state;
    const { ledger, data, isLoading, transactionLoading } = this.state;
    return (
      <View style={{
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView
          style={{
            backgroundColor: Color.containerBackground
          }} showsVerticalScrollIndicator={false}
        >
          <View style={{
            paddingLeft: 15,
            paddingBottom: 15,
            paddingRight: 15,
            height: height * 1.5,
          }}>

            {
              (this.state.ledger && this.state.ledger.length > 0) && this.state.ledger.map((item, index) => (
                <BalanceCard data={item} style={{marginTop: 20}}/>
              ))
            }
            
            {
              (isLoading) && (
                <Skeleton size={1} template={'block'} height={125}/>
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
                  this.props.navigation.navigate('directCashInStack', { page: 'Deposit' })
                }}
                title={language.deposit}
              />

              <IncrementButton style={{
                backgroundColor: Color.secondary,
                width: '40%'
              }}
                onClick={() => {
                  this.props.navigation.navigate('directCashInStack', { page: 'Withdraw' })
                }}
                title={language.withdraw}
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
              }}>{language.tithings}</Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('transactionsStack', {title: 'Transactions'})
                }}
              >

                <Text style={{
                  fontFamily: 'Poppins-SemiBold',
                }}>{language.viewMore + ' >>>'}</Text>

              </TouchableOpacity>
            </View>

            {
              data.map((item, index) => {
                return (
                  <CardsWithIcon
                  redirect={() => {
                    this.props.navigation.navigate('transactionDetailsStack', {data: item});
                  }}
                    version={3}
                    description={item.description}
                    title={item.receiver ? item.receiver.email : item.description}
                    date={item.created_at_human}
                    amount={item.currency?.toUpperCase() + ' ' + item.amount}
                  />
                )
              })
            }
            {
              (data && data.length === 0 && transactionLoading == false) && (
                <EmptyMessage message={language.emptyTithings}/>
              )
            }

            {
              (transactionLoading) && (
                <Skeleton size={3} template={'block'} height={60}/>
              )
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
    setQRCodeModal: (isVisible) => dispatch(actions.setQRCodeModal({ isVisible: isVisible })),
    setLedger: (ledger) => dispatch(actions.setLedger(ledger))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);