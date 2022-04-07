import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Dimensions, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAlignLeft, faPlusCircle, faQrcode, faSearch } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { NavigationActions, StackActions } from 'react-navigation';
import { BasicStyles, Color } from 'common';
const width = Math.round(Dimensions.get('window').width)

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: null,
      showSearch: false,
      input: null
    }
  }

  searchHandler = (value) => {
    this.setState({ search: value });
  }

  navigateToScreen = (route, message) => {

    this.props.navigation.toggleDrawer();
    const navigateAction = NavigationActions.navigate({
      routeName: 'drawerStack',
      action: StackActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({
            routeName: route,
            params: {
              initialRouteName: route,
              index: 0,
              message: message
            }
          }),
        ]
      })
    });
    this.props.navigation.dispatch(navigateAction);
  }

  back = () => {
    this.props.navigationProps.pop();
  };
  render() {
    const { routeName } = this.props.navigation.state;
    const { theme, language, user } = this.props.state;
    const { showSearch, input } = this.state;
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          width: width,
          // backgroundColor: this.props.navigation.state.routeName === 'Homepage' ? theme ? theme.primary : Color.primary : Color.containerBackground,
          // backgroundColor: 'red',
          // height: 60
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 10
          }}
          onPress={() => {
            this.props.navigation.toggleDrawer()
          }}
        >
          <FontAwesomeIcon
            icon={faAlignLeft}
            size={BasicStyles.iconSize}
            style={[
              BasicStyles.iconStyle,
              {
                color: routeName === 'Homepage' ? Color.white : Color.gray
              },
            ]}
          />
        </TouchableOpacity>

        {routeName === 'Homepage' && <Text style={{
          color: Color.white,
          fontFamily: 'Poppins-SemiBold'
        }}>{language.welcome} {user?.username?.charAt(0)?.toUpperCase() + user?.username?.substring(1)}!</Text>}

        {routeName === 'Dashboard' &&
          <TouchableOpacity
            onPress={() => {
              // this.navigateToScreen('MessagePage', 'Success Message')
              // this.props.setQRCodeModal(true);
              this.props.navigation.navigate('qrCodeScannerStack');
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: 50,
              width: 50,
              position: 'absolute',
              right: 1,
              elevation: BasicStyles.elevation
            }}
          >
            <FontAwesomeIcon
              icon={faQrcode}
              size={BasicStyles.iconSize}
              style={[
                BasicStyles.iconStyle,
                {
                  color: Color.black,
                },
              ]}
            />
          </TouchableOpacity>
        }
        {routeName === 'Community' && showSearch &&
          <View style={{
            borderWidth: 1,
            height: 35,
            width: width - 100,
            marginLeft: 30,
            marginRight: 25,
            borderRadius: 20,
            borderColor: Color.gray,
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <FontAwesomeIcon
              icon={faSearch}
              size={20}
              style={{
                color: Color.gray,
                marginRight: 10,
                marginLeft: 10
              }}
            />
            <TextInput
              style={{
                height: 35,
                width: '100%',
                marginTop: 4
              }}
              onChangeText={(text) => this.props.setSearchPost(text)}
              placeholder={language.search}
            />
          </View>
        }
        {routeName === 'Community' && !showSearch &&
          <View style={{
            height: 35,
            width: width - 110,
            marginLeft: 25,
            marginRight: 25,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Poppins-SemiBold'
              }}
            >{routeName}</Text>
          </View>
        }
        {routeName === 'Community' && <View style={{
          flexDirection: 'row',
          marginTop: 2,
          right: 10,
          position: 'absolute'
        }}>
          {!showSearch && <TouchableOpacity
            style={{ marginRight: 10 }}
            onPress={() => { this.setState({ showSearch: true }) }}
          >
            <FontAwesomeIcon
              icon={faSearch}
              size={BasicStyles.headerBackIconSize - 5}
            />
          </TouchableOpacity>}
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('createCommunityStack')
            }}
          >
            <FontAwesomeIcon
              icon={faPlusCircle}
              size={BasicStyles.headerBackIconSize - 5}
            />
          </TouchableOpacity>
        </View>
        }
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    logout: () => dispatch(actions.logout()),
    setQRCodeModal: (isVisible) => dispatch(actions.setQRCodeModal({ isVisible: isVisible })),
    setSearchPost: (searchPost) => dispatch(actions.setSearchPost(searchPost))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
