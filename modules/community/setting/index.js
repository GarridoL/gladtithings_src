import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Color } from 'common';
import { connect } from 'react-redux';
import _ from 'lodash';
import CardsWithIcon from 'modules/generic/CardsWithIcon';


const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Setting extends Component {
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
            {
              language.pageMenuSetting.map((item) => (
                <CardsWithIcon
                  redirect={() => {
                    this.props.navigation.navigate(item.route, {
                      data: params.data
                    })
                  }}
                  version={2}
                  title={item.title}
                  description={item.description}
                />
              ))
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

export default connect(mapStateToProps, mapDispatchToProps)(Setting);