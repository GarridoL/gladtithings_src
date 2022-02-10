import React, {Component} from 'react';
import {View, TouchableOpacity, Text, Dimensions} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import Screen from './index';
import {connect} from 'react-redux';
import { BasicStyles, Color } from 'common';
const width = Math.round(Dimensions.get('window').width);
class HeaderOptions extends Component {
  constructor(props) {
    super(props);
  }
  back = () => {
    this.props.navigationProps.pop();
  };
  render() {
    const { theme, language } = this.props.state;
    const { params } = this.props.navigationProps.state;
    console.log(params, '----------')
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: width}}
      >
        <TouchableOpacity
          onPress={this.back.bind(this)}
          style={{
            position: 'absolute',
            left: 0
          }}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={BasicStyles.headerBackIconSize}
            style={{ color: theme ? theme.primary : Color.primary }}
          />
        </TouchableOpacity>
        <Text style={{
          fontFamily: 'Poppins-SemiBold',
          fontSize: 20
        }}>{params.data.account_information?.first_name !== null ? params.data.account_information?.first_name + ' ' + params.data.account_information?.last_name :  params.data.username}</Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {
    logout: () => dispatch(actions.logout()),
  };
};

let HeaderOptionsConnect  = connect(mapStateToProps, mapDispatchToProps)(HeaderOptions);

const Stack = createStackNavigator({
  displayScreen: {
    screen: Screen,
    navigationOptions: ({navigation}) => ({
      title: '',
      drawerLabel: 'Account Posts',
      headerLeft: <HeaderOptionsConnect navigationProps={navigation} />,
      ...BasicStyles.headerDrawerStyle
    }),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Stack);
