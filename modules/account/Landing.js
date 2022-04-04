import React, { Component } from 'react';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import { View, Image, Text, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { Color, Helper, BasicStyles } from 'common';
import LinearGradient from 'react-native-linear-gradient'
import { Dimensions } from 'react-native';
import Button from '../generic/Button.js'
import { Spinner } from 'components';
import Api from 'services/api/index.js';
import { Routes } from 'common';

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class Landing extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isLoading: true
    }
  }

  onFocusFunction = async () => {
    const { setLanguage } = this.props;
    if (this.props.state.language === null) {
      setLanguage(Helper.defaultLanguage)
    }
    Linking.getInitialURL().then(url => {
      console.log(`from initial url ${url}, call navigate`)
      this.navigate(url);
    });
    Linking.addEventListener('url', this.handleOpenURL);
  }


  componentDidMount() {
    this.getTheme()
    this.getData()
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.onFocusFunction()
    })
  }

  getData = async () => {
    try {
      const temp = await AsyncStorage.getItem(Helper.APP_NAME + 'social');
      const token = await AsyncStorage.getItem(Helper.APP_NAME + 'token');
      console.log('======= get data', token);
      if (token != null) {
        this.setState({ token: token });
        this.login();
      }else{
        this.setState({
          isLoading: false
        })
      }
    } catch (e) {
      // error reading value
    }
  }

  login = () => {
    console.log('STATE TOKEN', this.state.token);
    const { login } = this.props;
    if (this.state.token != null) {
      this.setState({ isLoading: true });
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
          if (userInfo.data.length > 0) {
            login(userInfo.data[0], this.state.token);
            this.retrieveUserData(userInfo.data[0].id)
          } else {
            login(null, null)
          }
        }, error => {
          console.log(error, 'login-account retrieve');
        })
      }, error => {
        console.log(error, 'login-authenticate');
        this.setState({ isResponseError: true, isLoading: false })
      })
    }
  }

  retrieveUserData = (accountId) => {
    if (Helper.retrieveDataFlag == 1) {
      this.setState({ isLoading: false });
      const { setLayer } = this.props;
      setLayer(0)
      this.redirect('drawerStack')
    }else{
      this.setState({ isLoading: false });
    }
  }
  redirect = (route) => {
    this.props.navigation.navigate(route);
  }

  componentWillUnmount() { // C
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL = (event) => { // D
    this.navigate(event.url);
  }

  navigate = (url) => { // E
    const { navigate } = this.props.navigation;
    if (url !== null) {
      const route = url.replace(/.*?:\/\//g, '');
      const routeName = route.split('/')[0];
      if (routeName === 'wearesynqt' && route.split('/')[1] === 'profile') {
        const { setDeepLinkRoute } = this.props;
        setDeepLinkRoute(url);
      };
    }
  }

  getTheme = async () => {
    try {
      const primary = await AsyncStorage.getItem(Helper.APP_NAME + 'primary');
      const secondary = await AsyncStorage.getItem(Helper.APP_NAME + 'secondary');
      const tertiary = await AsyncStorage.getItem(Helper.APP_NAME + 'tertiary');
      const fourth = await AsyncStorage.getItem(Helper.APP_NAME + 'fourth');
      const gradient = await AsyncStorage.getItem(Helper.APP_NAME + 'gradient');
      if (primary != null && secondary != null && tertiary != null) {
        const { setTheme } = this.props;
        setTheme({
          primary: primary,
          secondary: secondary,
          tertiary: tertiary,
          fourth: fourth,
          gradient: JSON.parse(gradient)
        })
      }
    } catch (e) {
      console.log(e)
    }
  }

  renderEmpty(){

    const { theme, language } = this.props.state;
    return(
      <View style={{
        position: 'absolute',
        bottom: 10,
        alignItems: 'center'
      }}>
        <Button
          style={{
            width: '70%',
            height: 50,
            backgroundColor: theme ? theme.secondary : Color.secondary,
            marginBottom: '15%'
          }}
          content={
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 15 }}>{language?.getStarted}</Text>
            </View>
          }
          redirect={() => this.props.navigation.navigate('registerStack')}
        />
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('loginStack')}>
          <Text style={{
            color: 'white',
            fontSize: BasicStyles.standardFontSize + 2
          }}>{language?.alreadyHaveAnAccount}&nbsp;&nbsp;
          </Text>
        </TouchableOpacity>
        <Button
          style={{
            width: '70%',
            height: 50,
            backgroundColor: theme ? theme.secondary : Color.secondary,
            marginTop: 20
          }}
          content={
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 15 }}>{language?.signIn}</Text>
            </View>
          }
          redirect={() => this.props.navigation.navigate('loginStack')}
        />
      </View>
    )
  }

  render() {
    const { theme, language } = this.props.state;
    const { isLoading } = this.state;
    return (
      <LinearGradient
        colors={theme && theme.gradient !== undefined && theme.gradient !== null ? theme.gradient : Color.gradient}
        // colors={[theme ? theme.primary : Color.primary, theme ? theme.primary : Color.secondary, Color.primary]}
        locations={[0, 0.5, 1]} start={{ x: 2, y: 0 }} end={{ x: 1, y: 1 }}
        style={{ height: '100%' }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}>
          <View style={{
            height: height,
            flex: 1,
            alignItems: 'center',
          }}>
            <View style={{
              height: '40%',
              width: '100%',
              alignItems: 'center'
            }}>
              <Image source={require('assets/logo.png')} style={{
                flex: 1,
                width: '65%',
                height: '100%',
                resizeMode: 'contain',
              }} />
            </View>
            {
              !isLoading && this.renderEmpty()
            }
            {
              isLoading && (
                <View style={{
                  flex: 1,
                  alignItems: 'center',
                  width: '100%'
                }}>
                  <Spinner mode="overlay" />
                </View>
              )
            }
          </View>
        </ScrollView>
      </LinearGradient>
    );
  }
}
const mapStateToProps = state => ({ state: state });
const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    login: (user, token) => dispatch(actions.login(user, token)),
    setTheme: (theme) => dispatch(actions.setTheme(theme)),
    setLayer: (layer) => dispatch(actions.setLayer(layer)),
    setDeepLinkRoute: (deepLinkRoute) => dispatch(actions.setDeepLinkRoute(deepLinkRoute)),
    setLanguage: (language) => dispatch(actions.setLanguage(language))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps)(Landing);