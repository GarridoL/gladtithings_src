import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Color, BasicStyles, Routes } from 'common';
import { connect } from 'react-redux';
import {faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Api from 'services/api';
import _ from 'lodash';
import InputFieldWithIcon from 'modules/generic/InputFieldWithIcon';
import AccountCard from '../AccountCard';
import Skeleton from 'components/Loading/Skeleton';


const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: null
    }
  }

  componentDidMount(){
    this.retrieve()
  }

  retrieve(){
    const { params } = this.props.navigation.state;
    if(params == null || (params && params.data == null)){
      return
    }else{
      this.setState({ isLoading: true })
      Api.request(Routes.pageRoleRetrieve, {}, response => {
        this.setState({ isLoading: false })
        if (response.data && response.data.length > 0) {
          this.setState({
            data: response.data
          })
        } else {
          this.setState({
            data: []
          })
        }
      }, error => {
        this.setState({ isLoading: false })
      });
    }
  }

  render() {
    const { language } = this.props.state;
    const { isLoading, data } = this.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            minHeight: height * 1.5,
            width: '100%'
          }}>

            <View style={{
              paddingRight: 20,
              paddingLeft: 20
            }}>
              <InputFieldWithIcon
                placeholder={language.pageRoles.placeholder}
                icon={faUser}
                label={language.pageRoles.user}
                onTyping={(title) => {
                  this.setState({title})
                }}
              />

              <Text style={{
                fontWeight: 'bold',
                paddingTop: 20,
                paddingBottom: 20
              }}>
                {language.pageRoles.accountLabel}
              </Text>
            </View>
            {
              !isLoading && data && data.map((item) => (
                <AccountCard data={item} />
              ))
            }
            {
              isLoading && (
              <Skeleton template={'block'} size={5}/>
              )
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Index);