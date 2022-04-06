import React, {Component} from 'react';
import {View, TouchableOpacity, Platform} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft, faShare, faCog} from '@fortawesome/free-solid-svg-icons';
import Screen from 'modules/community/page';
import {BasicStyles, Color} from 'common';
import {connect} from 'react-redux';

class HeaderOptions extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    this.props.navigationProps.pop()
  };
  render() {
    const { theme } = this.props.state;
    return (
      <View style={{flexDirection: 'row', zIndex: 999}}>
        <TouchableOpacity onPress={this.back.bind(this)}>
          {/*Donute Button Image */}
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={BasicStyles.headerBackIconSize}
            style={{
              ...BasicStyles.iconStyle,
              color: theme ? theme.primary : Color.primary
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

class HeaderRightOptions extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    this.props.navigationProps.pop()
  };
  render() {
    const { theme } = this.props.state;
    return (
      <View style={{flexDirection: 'row', paddingRight: 20, zIndex: 999}}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigationProps.navigate('pageSettingScreen', {
              data: this.props.navigationProps.state.params.data
            })
          }}>
          {/*Donute Button Image */}
          <FontAwesomeIcon
            icon={faCog}
            size={BasicStyles.headerBackIconSize}
            style={{
              ...BasicStyles.iconStyle,
              color: theme ? theme.primary : Color.primary
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {};
};

let HeaderOptionsConnect  = connect(mapStateToProps, mapDispatchToProps)(HeaderOptions);
let HeaderRightOptionsConnect  = connect(mapStateToProps, mapDispatchToProps)(HeaderRightOptions);

const Stack = createStackNavigator({
  pageScreen: {
    screen: Screen,
    headerMode: Platform.OS === 'ios'? 'float' : 'screen',
    navigationOptions: ({navigation}) => ({
      // title: navigation.state.params && navigation.state.params.data ? navigation.state.params.data.title : 'Page',
      // headerLeft: <HeaderOptionsConnect navigationProps={navigation} />,
      // headerRight: <HeaderRightOptionsConnect navigationProps={navigation} />,
      headerTransparent: true
    }),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Stack);
