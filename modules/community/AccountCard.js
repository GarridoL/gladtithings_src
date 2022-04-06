import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Dimensions, Text, TextInput, Alert } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBan, faBell, faUsers, faImage } from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color, Routes } from 'common';
import { connect } from 'react-redux';
import Config from 'src/config.js';
import Api from 'services/api';
import UserImage from 'components/User/Image';


const height = Math.round(Dimensions.get('window').height);
const width = Math.round(Dimensions.get('window').width);

class Card extends Component {
  constructor(props) {
    super(props);
  }

  renderHeader = (data) => {
    return (
      <View style={{
        ...BasicStyles.standardWidth,
        flexDirection: 'row',
        alignItems: 'center'
      }}>
        <View style={{
          paddingLeft: 5,
          flexDirection: 'row',
          width: '90%',
          alignItems: 'center'
        }}>
          <FontAwesomeIcon icon={faImage} />
          <View style={{
            paddingLeft: 10
          }}>
            <Text style={{
              fontSize: BasicStyles.standardTitleFontSize,
              fontFamily: 'Poppins-SemiBold',
              fontWeight: 'bold'
            }}> {data.title}</Text>
          </View>
         
        </View>
      </View>
    )
  }

  render() {
    const { data } = this.props;
    return (
      <TouchableOpacity style={{
        ...BasicStyles.standardWidth,
        borderRadius: BasicStyles.standardBorderRadius,
        borderColor: Color.gray,
        borderWidth: .3,
        marginBottom: 10,
        marginTop: 10,
        paddingBottom: 10,
        paddingTop: 10,
        backgroundColor: 'white'
      }}
      onPress={() => {
        this.props.navigation.navigate('pageScreen', {
          data: {
            ...data,
            sub_title: 'Non Profit - 20k Followers - 10k Joined'
          }
        })
      }}
      >
        {this.renderHeader(data)}
      </TouchableOpacity>
    )
  }

}



const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setComments: (comments) => dispatch(actions.setComments(comments)),
    setTempMembers: (tempMembers) => dispatch(actions.setTempMembers(tempMembers))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Card);
