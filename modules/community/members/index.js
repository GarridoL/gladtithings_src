import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Color, BasicStyles, Routes } from 'common';
import Footer from 'modules/generic/Footer';
import { connect } from 'react-redux';
import IncrementButton from 'components/Form/Button';
import {faUser, faEnvelope, faImage, faMapMarkerAlt, faGlobe, faSitemap} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Api from 'services/api';
import _ from 'lodash';
import { Spinner } from 'components';
import InputFieldWithIcon from 'modules/generic/InputFieldWithIcon';


const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  render() {
    const { theme, language } = this.props.state;
    const { isLoading } = this.state;
    const { params } = this.props.navigation.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            minHeight: height * 1.5,
            width: '100%',
            paddingLeft: 20,
            paddingRight: 20
          }}>
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