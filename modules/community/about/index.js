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

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  render() {
    const { theme, comments, language } = this.props.state;
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
            <InputFieldWithIcon
              placeholder={language.community.name_placeholder}
              icon={faUser}
              label={language.community.name}
              onTyping={(title) => {
                this.setState({title})
              }}
            />

            <InputFieldWithIcon
              placeholder={language.community.address_placeholder}
              icon={faMapMarkerAlt}
              label={language.community.address}
              onTyping={(address) => {
                this.setState({address})
              }}
            />

            <InputFieldWithIcon
              placeholder={language.community.category_placeholder}
              icon={faSitemap}
              label={language.community.category}
              onTyping={(category) => {
                this.setState({category})
              }}
            />

            <InputFieldWithIcon
              placeholder={language.community.website_placeholder}
              icon={faGlobe}
              label={language.community.website}
              onTyping={(website) => {
                this.setState({website})
              }}
            />

            <InputFieldWithIcon
              placeholder={language.community.email_placeholder}
              icon={faEnvelope}
              label={language.community.email}
              onTyping={(email) => {
                this.setState({email})
              }}
            />

            <View style={{
              marginTop: 20,
              marginBottom: 20
            }}>
              
              <IncrementButton style={{
                  backgroundColor: Color.secondary,
                  width: '100%',
                  marginTop: 20,
                  marginBottom: 100
                }}
                textStyle={{
                  fontFamily: 'Poppins-SemiBold'
                }}
                onClick={() => {
                  this.submit()
                }}
                title={language.community.update}
              />
            </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);