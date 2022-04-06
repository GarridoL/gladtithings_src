import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Color } from 'common';
import { connect } from 'react-redux';
import IncrementButton from 'components/Form/Button';
import {faUser, faEnvelope, faImage, faMapMarkerAlt, faGlobe, faSitemap} from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import InputFieldWithIcon from 'modules/generic/InputFieldWithIcon';

const height = Math.round(Dimensions.get('window').height)

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  getValue(variable){
    const { params } = this.props.navigation.state;
    if(params && params.data){
      return params.data[variable]
    }else{
      return null
    }
  }

  render() {
    const { theme, comments, language } = this.props.state;
    const { isLoading } = this.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            height: height * 1.5,
            width: '100%',
            paddingLeft: 20,
            paddingRight: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <View style={{
              width: '100%'
            }}>
              <InputFieldWithIcon
                placeholder={language.community.name_placeholder}
                icon={faUser}
                label={language.community.name}
                value={this.getValue('title')}
                onTyping={(title) => {
                  this.setState({title})
                }}
              />

              <InputFieldWithIcon
                placeholder={language.community.address_placeholder}
                icon={faMapMarkerAlt}
                value={this.getValue('address')}
                label={language.community.address}
                onTyping={(address) => {
                  this.setState({address})
                }}
              />

              <InputFieldWithIcon
                placeholder={language.community.category_placeholder}
                icon={faSitemap}
                label={language.community.category}
                value={this.getValue('category')}
                onTyping={(category) => {
                  this.setState({category})
                }}
              />

              <InputFieldWithIcon
                placeholder={language.community.website_placeholder}
                icon={faGlobe}
                label={language.community.website}
                value={this.getValue('website')}
                onTyping={(website) => {
                  this.setState({website})
                }}
              />

              <InputFieldWithIcon
                placeholder={language.community.email_placeholder}
                icon={faEnvelope}
                label={language.community.email}
                value={this.getValue('email')}
                onTyping={(email) => {
                  this.setState({email})
                }}
              />

            </View>
            <View style={{
              width: '100%',
              height: height * .7
            }}> 
              
              <IncrementButton style={{
                  backgroundColor: Color.secondary,
                  width: '100%'
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