import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions} from 'react-native';
import { Color, BasicStyles, Routes } from 'common';
import { connect } from 'react-redux';
import Api from 'services/api';
import _ from 'lodash';
import Skeleton from 'components/Loading/Skeleton';
import AccountCard from '../AccountCard';

const height = Math.round(Dimensions.get('window').height)

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: null
    }
  }

  componentDidMount(){
    // this.retrieve()
  }

  retrieve(){
    const { params } = this.props.navigation.state;

    console.log({
      params
    })
    if(params == null || (params && params.data == null)){
      return
    }else{
      this.setState({ isLoading: true })
      Api.request(Routes.pageAccountRetrieve, {
        condition: [{
          value: params.data.id,
          column: 'page_id',
          clause: '='
        }]
      }, response => {
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
    const { isLoading } = this.state;
    const { data } = this.state;
    console.log({
      isLoading
    })
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