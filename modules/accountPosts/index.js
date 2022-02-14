import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, Alert, TouchableOpacity, Image } from 'react-native';
import { Color, Routes, BasicStyles } from 'common';
import { connect } from 'react-redux';
import { Spinner } from 'components';
import InputFieldWithIcon from 'modules/generic/InputFieldWithIcon';
import { faUser, faEnvelope, faUserCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import IncrementButton from 'components/Form/Button';
import Api from 'services/api/index.js';
import Style from './Style';
import Config from 'src/config';
import Comments from 'src/components/Comments/index';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class AccountPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: [],
      shouldRetrieve: false
    }
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    console.log(params)
  }


  render() {
    const { language, user, theme } = this.props.state;
    const { data } = this.props.navigation.state.params;
    const { shouldRetrieve } = this.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <View style={[Style.TopView, { backgroundColor: theme ? theme.primary : Color.primary }]}>
          <View
            style={{
              height: 120,
              width: 120,
              borderRadius: 100,
              borderColor: Color.primary,
              borderWidth: 2,
              marginTop: 25
            }}>
            {
              user.account_profile && user.account_profile.url ? (
                <Image
                  source={data?.account_profile?.url ? { uri: Config.BACKEND_URL + data?.account_profile?.url } : require('assets/logo.png')}
                  style={[BasicStyles.profileImageSize, {
                    height: '100%',
                    width: '100%',
                    borderRadius: 100
                  }]} />
              ) : <FontAwesomeIcon
                icon={faUserCircle}
                size={130}
                style={{
                  color: 'white'
                }}
              />
            }
          </View>
          <Text style={{
            textAlign: 'center',
            fontFamily: 'Poppins-SemiBold',
            marginTop: 10
          }}>{data.username}</Text>
          <Text style={{
            textAlign: 'center',
            marginBottom: 2,
            color: Color.white
          }}>@{data.email}</Text>
          <View style={Style.BottomView}>
            {data.status === 'VERIFIED' &&<FontAwesomeIcon style={{ marginRight: 5 }} icon={faCheckCircle} size={20} color={'#0066FF'} />}
            <Text style={{
              textAlign: 'center',
              fontFamily: 'Poppins-SemiBold',
              fontStyle: 'italic'
            }}>{data.status === 'VERIFIED' ? language.verified : 'NOT VERIFIED'}</Text>
          </View>
        </View>
        <ScrollView>
          <View style={{
            marginBottom: height / 2
          }}>
            <Comments withImages={true} shouldRetrieve={shouldRetrieve} navigation={this.props.navigation} account={data.id} />
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(AccountPosts);