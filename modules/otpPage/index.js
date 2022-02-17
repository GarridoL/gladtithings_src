import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, TextInput, KeyboardAvoidingView, AppState } from 'react-native';
import { NavigationActions, StackActions } from 'react-navigation';
import Button from 'components/Form/Button.js';
import { Routes, Color, Helper, BasicStyles } from 'common';
import { Spinner } from 'components';
import { connect } from 'react-redux';
import Api from 'services/api';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import AsyncStorage from '@react-native-community/async-storage';

const height = Math.round(Dimensions.get('window').height);

class OTP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      otp: [{
        code: null
      }, {
        code: null
      }, {
        code: null
      }, {
        code: null
      }, {
        code: null
      }, {
        code: null
      }],
      activeIndex: 0,
      otpTextInput: [],
      errorMessage: null,
      popupShowed: false,
      hasCredential: false
    };
    this.otpTextInput = []
  }

  async componentDidMount() {
    if (await AsyncStorage.getItem('username') !== null && await AsyncStorage.getItem('password') !== null && await AsyncStorage.getItem(`${Helper.APP_NAME}fingerprint`) == "true") {
      await this.setState({ hasCredential: true, popupShowed: true })
    } else {
      await this.setState({ hasCredential: false, popupShowed: false })
      this.generateOTP();
    }
  }


  handleFingerprintDismissed = async () => {
    await this.setState({ popupShowed: false });
    this.props.navigation.pop()
  };

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  detectFingerprintAvailable = () => {
    FingerprintScanner
      .isSensorAvailable()
      .catch(error => this.setState({ errorMessage: error.message, biometric: error.biometric }));
  }

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState && this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      FingerprintScanner.release();
      this.detectFingerprintAvailable();
    }
    this.setState({ appState: nextAppState });
  }

  showUnbaleToProcessModal(show) {
    if (show == true) {
      setTimeout(() => {
        Alert.alert(
          "Try Again",
          "Unable to process request",
          [
            {
              text: "Ok", onPress: () => {
                this.props.navigation.pop()
              }
            }
          ],
          { cancelable: false }
        );
      }, 60000)
    }
  }

  continueTrasaction() {
    const { data } = this.props.navigation.state.params
    if (data) {
      switch (data.payload) {
        case 'createRequest':
          console.log('[FingerPrint] On createRequest', data)
          this.sendCreateRequest(data.data)
          break;
        case 'transferFund':
          console.log('[OTP] On transferFund', data)
          this.sendTransferFund(data.data)
          break;
        case 'directTransfer':
          console.log("[OTP] on Direct Transfer", data)
          this.sendDirectTransfer(data, 'direct_transfer')
          break
        case 'acceptPayment': {
          console.log("[OTP] on Accept Payment", data)
          this.sendDirectTransfer({
            ...data,
            from: JSON.parse(data.to_account),
            to: JSON.parse(data.from_account)
          }, 'scan_payment')
        }
          break
      }
    }
  }

  handleResult = () => {
    const { data } = this.props.navigation.state.params
    console.log('[OTP] Action Handler', this.props.navigation.state.params)
    if (data) {
      switch (data.payload) {
        case 'createRequest':
          console.log('[OTP] On createRequest', data)
          this.sendCreateRequest(data.data)
          break;
        case 'transferFund':
          console.log('[OTP] On transferFund', data)
          this.sendTransferFund(data.data)
          break;
        case 'directTransfer':
          console.log("[OTP] on Direct Transfer", data)
          this.sendDirectTransfer(data, 'direct_transfer')
          break
        case 'acceptPayment': {
          console.log("[OTP] on Accept Payment", data)
          this.sendDirectTransfer({
            ...data,
            from: JSON.parse(data.to_account),
            to: JSON.parse(data.from_account)
          }, 'scan_payment')
        }
          break
      }
    }
  }

  completeOTPField = () => {
    const { otp, errorMessage } = this.state;
    let finalOtp = '';
    for (var i = 0; i < 6; i++) {
      let item = otp[i]
      if (item.code == null || item.code == '') {
        this.setState({
          errorMessage: 'Incomplete Code'
        })
        return
      } else {
        finalOtp += item.code
      }
      if (i === 5 && errorMessage == null) {
        console.log('[OTP] Success Message', finalOtp)
        this.validateOTP(finalOtp)
      }
    }
  }

  inputHandler = (value, i) => {
    const { otp } = this.state;
    this.setState({
      errorMessage: null
    })
    if (!value) {
      let newOtp = otp.map((item, index) => {
        if (i == index) {
          item.code = value
        }
        return item
      })
      this.setState({ otp: newOtp })
      if (i > 0) {
        let newIndex = parseInt(i - 1)
        this.otpTextInput[i - 1].focus();
        this.setState({ activeIndex: newIndex })
      }
      return
    } else {
      let newOtp = otp.map((item, index) => {
        if (i == index) {
          item.code = value
        }
        return item
      })
      this.setState({ otp: newOtp })
      if (i < 5 && (newOtp[i].code != null && newOtp[i].code != '')) {
        let newIndex = parseInt(i + 1)
        this.otpTextInput[i + 1].focus();
        this.setState({ activeIndex: newIndex })
      } else {
      }
      if (i == 5) {
        this.otpTextInput[i].blur()
      }
      return
    }

  };

  sendDirectTransfer = (data, payload) => {
    console.log('OTP Create Request API Call', data)
    let parameter = {
      from: {
        code: data.from.code,
        email: data.from.email
      },
      to: {
        code: data.to.code,
        email: data.to.email
      },
      amount: data.amount,
      currency: data.currency,
      notes: data.notes,
      charge: data.charge,
      payload: payload,
      topic: 'direct-transfer',
      title: 'Direct Transfer',
      message: `${this.props.state.user.username} transferred an amount of ${data.currency} ${data.amount} to your wallet.`
    }
    this.setState({ isLoading: true });
    Api.request(Routes.ledgerDirectTransfer, parameter, response => {
      this.setState({ isLoading: false });
      console.log('[OTP] Create Request response', response)
      if (response.error == null) {
        if (payload == 'direct_transfer') {
          this.props.navigation.navigate('pageMessageStack', {payload: 'success', title: 'Success'});
        } else {
          this.props.navigation.navigate('pageMessageStack', {payload: 'error', title: 'Error'});
        }
      } else {
        Alert.alert(
          "Try Again",
          response.error,
          [
            {
              text: "Ok", onPress: () => {
                this.props.navigation.pop()
              }
            }
          ],
          { cancelable: false }
        );
      }
    },
      (error) => {
        console.log('API ERROR', error);
        this.setState({ isLoading: false });
      },
    );
  };

  sendCreateRequest = (parameter) => {
    console.log('OTP Create Request API Call')
    this.setState({ isLoading: true });
    Api.request(Routes.requestCreate, parameter, response => {
      this.setState({ isLoading: false });
      console.log('[OTP] Create Request response', response)
      if (response.data != null) {
        this.props.navigation.navigate('requestItemStack', {
          data: response.data,
          from: 'create'
        })
      }
    },
      (error) => {
        console.log('API ERROR', error);
        this.setState({ isLoading: false });
      },
    );
  };


  navigateToScreen = (route, routeName, data) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
      action: StackActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({
            routeName: routeName, params: {
              data: data
            }
          }),
        ]
      })
    });
    this.props.navigation.dispatch(navigateAction);
  }

  sendTransferFund = (data) => {
    const { user } = this.props.state;
    if (user == null || data == null) {
      return
    }
    console.log('OTP Transfer fund API Call')
    console.log('OTP Transfer fund API Call', data)
    let parameter = {
      code: data.code,
      account_code: user.code
    }
    console.log('[Fund Transfer] parameter', parameter)
    this.setState({ isLoading: true });
    Api.request(Routes.requestManageByThread, parameter, response => {
      this.setState({ isLoading: false });
      console.log('[OTP] Transfer fund response', response)
      if (response.error != null) {
        Alert.alert(
          "Try Again",
          response.error,
          [
            {
              text: "Ok", onPress: () => {
                this.props.navigation.pop()
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        this.navigateToScreen('transferFundStack', 'transferFundScreen', {
          ...data,
          status: 2
        })
      }
    },
      (error) => {
        console.log('API ERROR', error);
        this.setState({ isLoading: false });
      },
    );
  };

  generateOTP = () => {
    const { user } = this.props.state;
    if (user == null) {
      return
    }
    let parameters = {
      account_id: user.id,
    };
    console.log(Routes.notificationSettingOtp, parameters);
    this.setState({ isLoading: true });
    Api.request(
      Routes.notificationSettingOtp,
      parameters,
      (data) => {
        this.setState({ isLoading: false });
      },
      (error) => {
        if (error) {
          this.setState({ isLoading: false });
        }
      },
    );
  };

  validateOTP = (code) => {
    const { user } = this.props.state;
    const { data } = this.props.navigation.state.params;
    this.setState({
      errorMessage: null
    })
    console.log('[CODE]', code)
    if (user == null || data == null || code == null || (code && code.length < 6)) {
      return
    }
    let parameters = {
      condition: [{
        column: 'code',
        value: code,
        clause: '=',
      }, {
        column: 'account_id',
        value: user.id,
        clause: '=',
      }]
    };
    this.setState({ isLoading: true });
    console.log('[OTP] parameters', JSON.stringify(parameters))
    Api.request(Routes.notificationSettingsRetrieve, parameters, (response) => {
      console.log('[OTP] response', response)
      this.setState({
        isLoading: false,
        errorMessage: null
      })
      if (response.data.length > 0) {
        console.log('[OTP Success]', response.data);
        this.handleResult()
      } else {
        this.setState({
          errorMessage: 'Invalid Code.'
        })
      }
    }
    );
  };

  render() {
    const { user, theme } = this.props.state;
    const { isLoading, popupShowed, hasCredential } = this.state;
    const { otp } = this.state;
    let inputs = []
    for (let i = 0; i < 6; i++) {
      inputs.push(
        <TextInput
          style={{
            borderColor: Color.lightGray,
            borderWidth: 1,
            width: '15%',
            marginLeft: '1%',
            marginBottom: 20,
            fontSize: 16,
            textAlign: 'center',
            borderRadius: 5,
            height: 50,
            borderRadius: 15,
            fontSize: 20
          }}
          onChangeText={(code) => this.inputHandler(code, i)}
          secureTextEntry={true}
          value={otp[i].code}
          maxLength={1}
          placeholder={'•'}
          keyboardType={'numeric'}
          key={i}
          autoFocus={this.state.activeIndex == i}
          ref={ref => this.otpTextInput[i] = ref}
        />
      );
    }
    {
      return hasCredential == false && popupShowed == false ?
        (
          <KeyboardAvoidingView
            style={{
              flex: 1
            }}
            behavior={'height'}
          >
            {this.state.isLoading ? <Spinner mode="overlay" /> : null}
            {(user) && (
              <View style={{
                width: '100%',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: height,
                marginTop: 20
              }}>
                <View style={{
                  marginTop: '10%',
                  marginBottom: '10%',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  height: '100%',
                  width: '90%',
                }}>
                  <View style={{
                    marginBottom: 0,
                    width: '100%',
                  }}>
                    <Text style={[BasicStyles.standardFontSize, { textAlign: 'center' }]}>
                      Please type the one time pass code sent to {user.email}.
                    </Text>
                  </View>
                  <View style={{
                    width: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 50,
                  }}>
                    {
                      this.state.errorMessage != null && (
                        <View style={{
                          alignItems: 'center',
                          paddingBottom: 20
                        }}>
                          <Text style={{
                            color: Color.danger,
                            textAlign: 'center'
                          }}>Opps! {this.state.errorMessage}</Text>
                        </View>
                      )
                    }
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      width: '90%',
                      marginLeft: '5%',
                      marginRight: '5%'
                    }}>
                      {inputs}
                    </View>
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '90%',
                    marginLeft: '5%',
                    marginRight: '5%'
                  }}>
                    <Text>
                      Didn't receive a code?
                    </Text>
                    <TouchableOpacity
                      onPress={this.generateOTP}>
                      <Text style={{
                        fontSize: BasicStyles.standardFontSize,
                        color: theme ? theme.secondary : Color.secondary,
                        marginLeft: 5
                      }}>
                        Click to resend.
                      </Text>
                    </TouchableOpacity>
                  </View>

                </View>
              </View>
            )}
            {
              (user) && (
                <View style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  position: 'absolute',
                  bottom: 10
                }}>
                  <Button
                    style={{
                      backgroundColor: Color.danger,
                      width: '48%',
                      marginRight: '1%',
                      marginLeft: '1%'
                    }}
                    title={'Back'}
                    onClick={() => this.props.navigation.pop()}
                  />
                  <Button
                    style={{
                      backgroundColor: theme ? theme.secondary : Color.secondary,
                      width: '48%',
                      marginRight: '1%',
                      marginLeft: '1%'
                    }}
                    title={'Continue'}
                    onClick={() => {
                      this.completeOTPField()
                      // this.handleResult();
                    }}
                  />
                </View>
              )
            }
          </KeyboardAvoidingView>
        ) : (
          <View>
            {
              this.state.popupShowed == false ?
                <View style={{ marginTop: '50%' }}>
                  <View>
                    <Spinner mode="overlay" />
                    <Text style={{ marginTop: 50, marginRight: 'auto', marginLeft: 'auto' }}>Processing Request</Text>
                  </View>
                </View> :
                <FingerprintPopup
                  title="Complete transaction with FingerPrint"
                  handlePopupDismissed={() => this.handleFingerprintDismissed()}
                  handlePopupDismissedLegacy={() => this.handleFingerprintDismissed()}
                  onAuthenticate={() => this.continueTrasaction()}
                />
            }
          </View>
        )

    };
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setIsValidOtp: (isValidOtp) => {
      dispatch(actions.setIsValidOtp(isValidOtp));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OTP);
