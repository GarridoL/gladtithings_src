import React, { Component } from 'react';
import { View, Dimensions } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Slider2 from 'modules/slider/index2';
import {BasicStyles } from 'common';
import Homepage from 'modules/homepage';
import Dashboard from 'modules/dashboard';
import Settings from 'modules/settings';
import Donations from 'modules/donations';
import Privacy from 'modules/privacy';
import Community from 'modules/community';
import TermsAndConditions from 'modules/termsAndConditions';
import Header from 'src/modules/generic/Header';
import MessagePage from 'src/modules/messagePage/index.js';

import Style from './Style.js';
import { connect } from 'react-redux'

// const width = Math.round(Dimensions.get('window').width);
const width = Math.round(Dimensions.get('window').width);
class MenuDrawerStructure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginState: true,
    };
  }
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };

  render() {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}></View>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setQRCodeModal: (isVisible) => {
      dispatch(actions.setQRCodeModal({ isVisible: isVisible }))
    },
  };
};

const _StackNavigator = createStackNavigator({
  Homepage: {
    screen: Homepage,
    navigationOptions: ({navigation}) => ({
      title: null,
      headerLeft: <Header navigation={navigation} />,
      ...BasicStyles.drawerHeader1
    }),
  },
  Dashboard: {
    screen: Dashboard,
    navigationOptions: ({navigation}) => ({
      title: null,
      headerLeft: <Header navigation={navigation} />,
      ...BasicStyles.drawerHeader1
    }),
  },
  Settings: {
    screen: Settings,
    navigationOptions: ({navigation}) => ({
      title: null,
      headerLeft: <Header navigation={navigation} />,
      ...BasicStyles.drawerHeader
    }),
  },
  Donations: {
    screen: Donations,
    navigationOptions: ({navigation}) => ({
      title: null,
      headerLeft: <Header navigation={navigation} />,
      ...BasicStyles.drawerHeader
    }),
  },
  Community: {
    screen: Community,
    navigationOptions: ({navigation}) => ({
      title: null,
      headerLeft: <Header navigation={navigation} />,
      ...BasicStyles.drawerHeader,
      headerMode: 'none'
    }),
  },
  TermsAndConditions: {
    screen: TermsAndConditions,
    navigationOptions: ({navigation}) => ({
      title: null,
      headerLeft: <Header navigation={navigation} />,
      ...BasicStyles.drawerHeader
    }),
  },
  Privacy: {
    screen: Privacy,
    navigationOptions: ({navigation}) => ({
      title: null,
      headerLeft: <Header navigation={navigation} />,
      ...BasicStyles.drawerHeader
    }),
  },
  MessagePage: {
    screen: MessagePage,
    navigationOptions: ({navigation}) => ({
      title: null,
      headerLeft: <Header navigation={navigation} />,
      ...BasicStyles.drawerHeader
    }),
  }
});

const Drawer = createDrawerNavigator(
  {
    Homepage: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: '',
      },
    },
    Dashboard: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: '',
      },
    },
    Profile: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: '',
      },
    },
    Notification: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: '',
      },
    },
    Settings: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: '',
      },
    },
    Donations: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: '',
      },
    },
    Community: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: '',
      },
    },
    TermsAndConditions: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: '',
      },
    },
    Privacy: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: '',
      },
    },
    MessagePage: {
      screen: _StackNavigator,
      navigationOptions: {
        drawerLabel: '',
      },
    }
  },
  {
    contentComponent: Slider2,
    drawerWidth: width,
    initialRouteName: 'Homepage'
  },
);

export default Drawer;
