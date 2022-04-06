import React, {Component} from 'react';
import {View, TouchableOpacity, Platform} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faChevronLeft, faShare, faCog} from '@fortawesome/free-solid-svg-icons';
import Screen from 'modules/community/roles';
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


const mapStateToProps = (state) => ({state: state});

const mapDispatchToProps = (dispatch) => {
  const {actions} = require('@redux');
  return {};
};

let HeaderOptionsConnect  = connect(mapStateToProps, mapDispatchToProps)(HeaderOptions);

const Stack = createStackNavigator({
  pageRolesScreen: {
    screen: Screen,
    headerMode: Platform.OS === 'ios'?'float': 'screen',
    navigationOptions: ({navigation}) => ({
      title: 'Page Roles',
      headerLeft: <HeaderOptionsConnect navigationProps={navigation} />,
      ...BasicStyles.headerDrawerStyle
    }),
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Stack);
