import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Color } from 'common';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faExclamationTriangle, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';
import IncrementButton from 'components/Form/Button';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const { params } = this.props.navigation.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            paddingLeft: 20,
            paddingRight: 20,
            minHeight: height,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FontAwesomeIcon
              icon={params.payload == 'success' ? faClipboardCheck : faExclamationTriangle}
              size={200}
              color={params.payload == 'success' ? Color.primary : Color.danger}
               />

            <Text style={{
              paddingTop: 40,
              paddingBottom: 40,
              fontFamily: 'Poppins-SemiBold',
              textAlign: 'center'
            }}>{params.message}</Text>

             <IncrementButton style={{
                backgroundColor: Color.secondary,
                width: '50%',
                marginTop: 20,
                marginBottom: 20
              }}
              textStyle={{
                fontFamily: 'Poppins-SemiBold'
              }}
              onClick={() => {
                params.data === 'subscription' ? this.props.navigation.navigate('transactionsStack') : this.props.navigation.navigate('Dashboard')
              }}
              title={params.data === 'subscription' ? 'Go to Subscriptions' :'Go to Dashboard'}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Transactions);