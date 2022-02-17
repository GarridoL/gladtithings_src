import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, Image, Alert } from 'react-native';
import { Color, Routes, BasicStyles } from 'common';
import Config from 'src/config.js';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChurch, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import IncrementButton from 'components/Form/Button';
import { TextInput } from 'react-native-gesture-handler';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Ewallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      data: null,
      profile: null
    }
  }
  componentDidMount() {
    this.retrieveInfo();
    this.retrieveProfile();
  }

  proceed = () => {
    const { data } = this.props.navigation.state.params;
    const { ledger, user } = this.props.state;
    const { amount } = this.state;
    if(ledger) {
      if(parseFloat(amount) === 0) {
        Alert.alert(
          `Invalid amount`,
          `Please specify amount.`,
          [
            { text: "OK", onPress: () => {
              return
            }}
          ]
        );
      } else if(parseFloat(ledger.available_balance) < parseFloat(amount)) {
        Alert.alert(
          "Invalid amount",
          `Your balance is ${ledger.available_balance}`,
          [
            { text: "OK", onPress: () => {
              return
            }}
          ]
        );
      } else {
        let temp_data = {
          payload: 'directTransfer',
          from: {
            code: user.code,
            email: user.email,
          },
          to: {
            code: data.code,
            email: data.email,
            id: data.id
          },
          amount: this.state.amount,
          currency: 'USD',
          notes: null,
          charge: 0
        }
        this.props.navigation.navigate('otpStack', {data: temp_data});
      }
    } else {
      Alert.alert(
        `Invalid amount`,
        `Go back to dashboard and try again.`,
        [
          { text: "OK", onPress: () => {
            return
          }}
        ]
      );
    }
  }

  retrieveInfo = () => {
    const { data } = this.props.navigation.state.params;
    let parameter = {
      condition: [{
        value: data.id,
        clause: '=',
        column: 'account_id'
      }]
    }
    this.setState({ isLoading: true })
    Api.request(Routes.accountInformationRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        let data = response.data[0];
        this.setState({ data: data });
      }
    });
  }

  retrieveProfile = () => {
    const { data } = this.props.navigation.state.params;
    let parameter = {
      condition: [{
        value: data.id,
        clause: '=',
        column: 'account_id'
      }]
    }
    console.log(parameter, Routes.accountProfileRetrieve);
    this.setState({ isLoading: true })
    Api.request(Routes.accountProfileRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({ profile: response.data[0] });
      }
    });
  }

  render() {
    const { theme, ledger } = this.props.state;
    const { data, profile } = this.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            minHeight: height + (height * 0.5)
          }}>
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: height / 3,
              width: width,
              backgroundColor: theme ? theme.primary : Color.primary,
              borderTopRightRadius: 25,
              borderTopLeftRadius: 25,
              padding: 10
            }}>
              <Text style={{
                textAlign: 'center',
                fontSize: 13,
                color: 'white',
                marginBottom: 10,
                fontFamily: 'Poppins-BoldItalic'
              }}>
                Transfer money to
              </Text>
              {
                profile?.url ? (
                  <Image
                    source={{ uri: Config.BACKEND_URL + profile.url }}
                    style={[BasicStyles.profileImageSize, {
                      height: 100,
                      width: 100,
                      borderRadius: 100
                    }]} />
                ) : <FontAwesomeIcon
                  icon={faUserCircle}
                  size={100}
                  style={{
                    color: 'white'
                  }}
                />
              }
              <Text style={{
                textAlign: 'center',
                fontSize: 13,
                color: 'white',
                marginTop: 10,
                fontFamily: 'Poppins-SemiBold'
              }}>
                {data?.first_name ? data?.first_name + ' ' + data?.middle_name + ' ' + data?.last_name : this.props.navigation.state.params?.data?.username}
              </Text>
              <Text style={{
                textAlign: 'center',
                fontSize: 13,
                color: 'white'
              }}>
                {data?.address}
              </Text>
            </View>

            <View style={{
              paddingTop: 20,
              paddingLeft: 20,
              paddingRight: 20,
            }}>
              <View style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <TextInput
                  style={{ fontSize: 30 }}
                  onChangeText={(input) => this.setState({ amount: input })}
                  value={this.state.amount}
                  placeholder={'0.0'}
                  keyboardType={'numeric'}
                />
                <Text style={{
                  color: theme ? theme.primary : Color.primary,
                  fontFamily: 'Poppins-SemiBold'
                }}>USD</Text>
              </View>
            </View>
            <Text style={{
              padding: 20
            }}>Note: The amount you enter will automatically be deducted from your balance.</Text>
          </View>

        </ScrollView>

        <View style={{
          position: 'absolute',
          bottom: 90,
          left: 0,
          paddingLeft: 20,
          paddingRight: 20,
          width: '100%'
        }}>
          <IncrementButton
            style={{
              backgroundColor: Color.secondary,
              width: '100%'
            }}
            textStyle={{
              fontFamily: 'Poppins-SemiBold'
            }}
            onClick={() => {
              this.proceed();
            }}
            title={'Continue'}
          />
        </View>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Ewallet);