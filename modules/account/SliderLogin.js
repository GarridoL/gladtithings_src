import React, { Component } from 'react';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { View , TextInput , Image, TouchableHighlight, Text, ScrollView, Platform, Alert } from 'react-native';
import {NavigationActions} from 'react-navigation';
import Style from './Style.js';
import { Spinner } from 'components';
import CustomError from 'components/Modal/Error.js';
import Api from 'services/api/index.js';
import CommonRequest from 'services/CommonRequest.js';
import { Routes, Color, Helper, BasicStyles } from 'common';
import PasswordWithIcon from 'components/InputField/Password.js';
import Header from './Header';
import config from 'src/config';
import Pusher from 'services/Pusher.js';
import SystemVersion from 'services/System.js';
import { Player } from '@react-native-community/audio-toolkit';
import OtpModal from 'components/Modal/Otp.js';
import {Notifications} from 'react-native-notifications';
import { store } from '../../../App';
class SliderLogin extends Component {
  //Screen1 Component
  constructor(props){
    super(props);
    this.state = {
      username: null,
      password: null,
      isLoading: false,
      token: null,
      error: 0,
      isResponseError: false,
      isOtpModal: false,
      blockedFlag: false,
      notifications: []
    };
    this.audio = null;
    this.registerNotificationEvents();
  }
  
  async componentDidMount(){
    if(config.versionChecker == 'store'){
      this.setState({isLoading: true})
      SystemVersion.checkVersion(response => {
        this.setState({isLoading: false})
        if(response == true){
          this.getData();
        }
      })
    }else{
      this.getData(); 
    }
    this.audio = new Player('assets/notification.mp3');
    this.requestPermissions()
    const initialNotification = await Notifications.getInitialNotification();
    if (initialNotification) {
      this.setState({notifications: [initialNotification, ...this.state.notifications]});
    }
  }

  componentWillUnmount() {
    console.log('SLIDER LOGIN WILL UNMOUNT WITH DATA', this.props.state )
  }

  retrieveSystemNotification = () => {
    let parameter = {
      condition: [{
        value: '%' + Platform.OS + '%',
        clause: 'like',
        column: 'device'
      }],
      sort: {
        created_at: 'desc'
      }
    }
    Api.request(Routes.systemNotificationRetrieve, parameter, response => {
      const { setSystemNotification } = this.props;
      if(response.data.length > 0){
        setSystemNotification(response.data[0])
      }else{
        setSystemNotification(null)
      }
    }, error => {
      console.log('error', error)
    });
  }

  redirectToDrawer = (payload) => {
    const { user } =  this.props.state;
    if(user !== null){
      let route = ''
      switch(payload){
        case 'request':
          route = 'Requests'
          const { setSearchParameter } = this.props;
          let searchParameter = {
            column: 'id',
            value: notification.payload_value
          }
          setSearchParameter(searchParameter)
          break;
        case 'ledger':
          route = 'Dashboard'
          break
      }
      const navigateAction = NavigationActions.navigate({
        routeName: route
      });
      this.props.navigation.dispatch(navigateAction); 
    }
  }

  registerNotificationEvents() {
    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      this.setState({
        notifications: [...this.state.notifications, notification]
      });

      completion({alert: notification.payload.showAlert, sound: true, badge: false});
    });

    Notifications.events().registerNotificationOpened((notification, completion) => {
      if(notification.extra != ''){
        this.redirectToDrawer(notification.extra)
      }
      completion();
    });
  }

  requestPermissions() {
    Notifications.registerRemoteNotifications();
  }

  sendLocalNotification(title, body, route) {
    Notifications.postLocalNotification({
      title: title,
      body: body,
      extra: route
    });
  }

  test = () => {
    if(config.TEST == true){
      this.props.navigation.navigate('drawerStack');
      return true;
    }
  }

  redirect = (route) => {
    this.props.navigation.navigate(route);
  }

  playAudio = () => {
    if(this.audio){
      this.audio.play();
    }
  }

  managePusherResponse = (response) => {
    const { messagesOnGroup } = store.getState()
    console.log('Received new event')
    console.log('Redux state on SliderLogin', this.props.state)
    console.log('Redux state on Store', store.getState())

    const { user } = this.props.state;
    const data = response.data;
    if(user == null){
      return;
    }
    if(response.type == Helper.pusher.notifications){
      console.log(Helper.pusher.notifications, response);
      if(user.id == parseInt(data.to)){
        const { notifications } = this.props.state;
        const { updateNotifications } = this.props;
        console.log('notif pusher', data)
        this.sendLocalNotification(data.title, data.description, data.payload)
        updateNotifications(1, data);
        this.playAudio()
      }
    }else if(response.type == Helper.pusher.systemNotification){
      this.sendLocalNotification(data.title, data.description, 'requests')
    } else if(response.type == Helper.pusher.rider) {
      const { user } = this.props.state;
      if (response.data.hasOwnProperty('assigned_rider') && response.data.account_id === user.id) {
        Alert.alert(
          `Hello ${user.username}! We found you a rider!`,
          `Order number: ${response.data.order_number}`,
          [
            {
              text: "View", onPress: () => {
                const navigateAction = NavigationActions.navigate({
                  routeName: 'MyOrders',
                  params: response
                });
                this.props.navigation.dispatch(navigateAction); 
              }
            },
            { text: "Cancel" }
          ],
          { cancelable: true }
        );
        this.sendLocalNotification(
          `Hi there ${user.username}!`,
          `We found you a rider! with order number: ${response.data.order_number}`,
          'MyOrders',
        )
        this.playAudio()
      }
    }
  }

  retrieveUserData = (accountId) => {
    if(Helper.retrieveDataFlag == 1){
      console.log('Initializing pusher...')
      Pusher.listen(response => {
        this.managePusherResponse(response)
      });
      this.setState({isLoading: false});
      this.props.navigation.navigate('drawerStack');  
    }else{
      const { setNotifications } = this.props;
      let parameter = {
        account_id: accountId
      }
      this.retrieveSystemNotification();
      Api.request(Routes.notificationsRetrieve, parameter, notifications => {
        setNotifications(notifications.size, notifications.data)
      }, error => {
        this.setState({isResponseError: true})
      })
    }
  }

  login = () => {
    this.test();
    const { login, retrieveCart } = this.props;
    if(this.state.token != null){
      this.setState({isLoading: true});
      Api.getAuthUser(this.state.token, (response) => {
        login(response, this.state.token);
        let parameter = {
          condition: [{
            value: response.id,
            clause: '=',
            column: 'id'
          }]
        }

        Api.request(Routes.accountRetrieve, parameter, userInfo => {
          if(userInfo.data.length > 0){
            login(userInfo.data[0], this.state.token);
            this.retrieveUserData(userInfo.data[0].id)
            const { cart } = userInfo.data[0]
            if (cart) {
              const items = JSON.parse(cart.items)
              retrieveCart(items)
            } else {
              retrieveCart([])
            }
          }else{
            this.setState({isLoading: false});
            login(null, null)
          }
        }, error => {
          this.setState({isResponseError: true})
        })
      }, error => {
        this.setState({isResponseError: true})
      })
    }
  }

  getData = async () => {
    try {
      const token = await AsyncStorage.getItem(Helper.APP_NAME + 'token');
      if(token != null) {
        this.setState({token});
        this.login();
      }
    } catch(e) {
      // error reading value
    }
  }
  
  checkOtp = () => {
    const { user } = this.props.state;
    if(user.notification_settings != null){
      let nSettings = user.notification_settings
      if(parseInt(nSettings.email_otp) == 1 || parseInt(nSettings.sms_otp) == 1){
        this.setState({
          isOtpModal: true,
          blockedFlag: false
        })
        return
      }
    }
    this.props.navigation.navigate('drawerStack');
  }

  onSuccessOtp = () => {
    this.setState({isOtpModal: false})
    this.props.navigation.navigate('drawerStack');
  }

  submit(){
    this.test();
    const { username, password } = this.state;
    const { login, retrieveCart } = this.props;
    if((username != null && username != '') && (password != null && password != '')){
      this.setState({isLoading: true, error: 0});
      // Login
      Api.authenticate(username, password, (response) => {
        if(response.error){
          this.setState({error: 2, isLoading: false});
        }
        if(response.token){
          const token = response.token;
          Api.getAuthUser(response.token, (response) => {
            login(response, token);
            let parameter = {
              condition: [{
                value: response.id,
                clause: '=',
                column: 'id'
              }]
            }
            Api.request(Routes.accountRetrieve, parameter, userInfo => {
              if(userInfo.data.length > 0){
                login(userInfo.data[0], token);
                this.retrieveUserData(userInfo.data[0].id)
                // retrieve cart
                const { cart } = userInfo.data[0]
                if (cart) {
                  const items = JSON.parse(cart.items)
                  retrieveCart(items)
                } else {
                  retrieveCart([])
                }
              }else{
                this.setState({isLoading: false});
                this.setState({error: 2})
              }
            }, error => {
              this.setState({isResponseError: true})
            })
          }, error => {
            this.setState({isResponseError: true})
          })
        }
      }, error => {
        this.setState({isResponseError: true})
      })
      // this.props.navigation.navigate('drawerStack');
    }else{
      this.setState({error: 1});
    }
  }

  render() {
    const { isLoading, error, isResponseError } = this.state;
    const {  blockedFlag, isOtpModal } = this.state;
    const { theme } = this.props.state;
    return (
      <ScrollView style={Style.ScrollView}>
        <View style={Style.MainContainer}>
          <Header params={"Login"}></Header>

          {error > 0 ? <View style={Style.messageContainer}>
            {error == 1 ? (
              <Text style={Style.messageText}>Please fill up the required fields.</Text>
            ) : null}

            {error == 2 ? (
              <Text style={Style.messageText}>Username and password didn't match.</Text>
            ) : null}
          </View> : null}
          
          <View style={Style.TextContainer}>
            <TextInput
              style={BasicStyles.formControl}
              onChangeText={(username) => this.setState({username})}
              value={this.state.username}
              placeholder={'Username or Email'}
            />
            {/*<TextInput
              style={BasicStyles.formControl}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
              placeholder={'********'}
              secureTextEntry={true}
            />*/}
            <PasswordWithIcon onTyping={(input) => this.setState({
              password: input
            })}/>
            <TouchableHighlight
              style={[BasicStyles.btn, {
                backgroundColor: theme ? theme.primary : Color.primary
              }]}
              onPress={() => this.submit()}
              underlayColor={Color.gray}>
              <Text style={BasicStyles.textWhite}>
                Login
              </Text>
            </TouchableHighlight>

            
            <TouchableHighlight
              style={[BasicStyles.btn, BasicStyles.btnWarning]}
              onPress={() => this.redirect('forgotPasswordStack')}
              underlayColor={Color.gray}>
              <Text style={BasicStyles.textWhite}>
                Forgot your Password?
              </Text>
            </TouchableHighlight>
            

            <View style={{
              height: 1,
              backgroundColor: Color.gray
            }}>
            </View>

            <View style={{
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Text style={{
                paddingTop: 10,
                paddingBottom: 10,
                color: Color.gray
              }}>Don't have an account?</Text>
            </View>
            <TouchableHighlight
              style={[BasicStyles.btn, BasicStyles.btnSecondary, {
                backgroundColor: theme ? theme.secondary : Color.secondary
              }]}
              onPress={() => this.redirect('registerStack')}
              underlayColor={Color.gray}>
              <Text style={BasicStyles.textWhite}>
                Register Now!
              </Text>
            </TouchableHighlight>
          </View>
        </View>

        <OtpModal
          visible={isOtpModal}
          title={blockedFlag == false ? 'Authentication via OTP' : 'Blocked Account'}
          actionLabel={{
            yes: 'Authenticate',
            no: 'Cancel'
          }}
          onCancel={() => this.setState({isOtpModal: false})}
          onSuccess={() => this.onSuccessOtp()}
          onResend={() => {
            this.setState({isOtpModal: false})
            this.submit()
          }}
          error={''}
          blockedFlag={blockedFlag}
        ></OtpModal>

        {isLoading ? <Spinner mode="overlay"/> : null }
        {isResponseError ? <CustomError visible={isResponseError} onCLose={() => {
          this.setState({isResponseError: false, isLoading: false})
        }}/> : null}
      </ScrollView>
    );
  }
}
 
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    login: (user, token) => dispatch(actions.login(user, token)),
    logout: () => dispatch(actions.logout()),
    setNotifications: (unread, notifications) => dispatch(actions.setNotifications(unread, notifications)),
    updateNotifications: (unread, notification) => dispatch(actions.updateNotifications(unread, notification)),
    setSearchParameter: (searchParameter) => dispatch(actions.setSearchParameter(searchParameter)),
    setSystemNotification: (systemNotification) => dispatch(actions.setSystemNotification(systemNotification)),
    retrieveCart: (items) => dispatch(actions.retrieveCart(items))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SliderLogin);
