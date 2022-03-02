import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, TouchableHighlight } from 'react-native';
import styles from './BalanceCardStyle';
import Currency from 'services/Currency';
import {connect} from 'react-redux';
import { Color, BasicStyles, Helper } from 'common';

class AmountInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      errorMessage: null
    }
  }

  inputHandler(amount, maximum, type){
    const { ledger} = this.props.state;
    let convertedMaximum = Helper.convertMaximum(maximum, ledger && ledger.currency ? ledger.currency : 'USD')
    if(convertedMaximum < amount){
      this.setState({
        errorMessage: 'Maximum allowed is ' + convertedMaximum
      })
      this.props.onChange(convertedMaximum, ledger && ledger.currency ? ledger.currency : 'USD')
    }else if(ledger && ledger.available_balance < amount && type !== 'Cash In'){
      this.setState({
        errorMessage: 'Insufficient Balance!'
      })
      this.props.onChange(amount, ledger && ledger.currency ? ledger.currency : 'USD')
    }else{
      this.setState({
        amount: amount,
        errorMessage: null
      })
      this.props.onChange(amount, ledger && ledger.currency ? ledger.currency : 'USD')
    }
  }

  render() {
    const { ledger, currencyBal} = this.props.state;
    const { errorMessage } = this.state;
    return (
      <View
        style={{
          width: '100%',
          paddingTop: 20,
          paddingBottom: 20
        }}>
          {
            errorMessage && (
              <Text style={{
                color: Color.danger,
                fontSize: BasicStyles.standardFontSize,
                width: '100%',
                textAlign: 'center'
              }}>{
                errorMessage
              }</Text>
            )
          }
          <TextInput
            value={this.state.amount}
            keyboardType={Platform.OS == 'ios' ? 'numeric' : 'number-pad'}
            onChangeText={(input) => {
              if(this.props.type?.type == 'Cash In'){
                this.inputHandler(input, this.props.maximum, 'Cash In')
              }else if(this.props.type?.type == 'Send Cash'){
                this.inputHandler(input, this.props.maximum, null)
              }else if(this.props.type?.type == 'Withdrawal'){
                this.inputHandler(input, this.props.maximum, null)
              }else{
                this.setState({
                  amount: input
                })
                this.props.onChange(input, ledger && ledger.currency ? ledger.currency : 'USD')
              }
            }}
            style={{
              textAlign: 'center',
              fontSize: 52,
              width: '100%',
            }}
            placeholder={'0.00'}
            placeholderTextColor={Color.darkGray}
          />

          {
            (ledger == null && this.props.disableRedirect == false) && (
              <TouchableOpacity style={{
                width: '100%',
                alignItems: 'center',
                marginTop: 25
              }}
              onPress={() => {
                this.props.navigation.navigate('currencyStack')
              }}
              >
                <Text>Select Currency >></Text>
                </TouchableOpacity>
            )
          }
          

          {
            (ledger && this.props.disableRedirect == false) && (
              <TouchableOpacity style={{
                width: '100%',
                paddingBottom: 20,
                marginTop: 25
              }}
              onPress={() => {
                if(this.props.disableRedirect){
                  //
                }else{
                  this.props.navigation.navigate('currencyStack')  
                }
              }
            }
              >
                <View style={{
                  width: '100%',
                  alignItems: 'center'
                }}>
                  <Text style={{
                    fontSize: BasicStyles.standardFontSize,
                    paddingTop: 5,
                    paddingBottom: 5
                  }}>{Currency.display(ledger && ledger.available_balance ? ledger.available_balance.toFixed() : 0, currencyBal != null ? currencyBal : ledger.currency) +  '  >'}</Text>
                  <Text style={{
                    fontSize: BasicStyles.standardFontSize,
                    color: Color.gray
                  }}>Available Balance</Text>
                </View>
              </TouchableOpacity>
            )
          }

      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AmountInput);
