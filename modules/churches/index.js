import React, { Component } from 'react';
import { View, ScrollView} from 'react-native';
import { Color, Routes } from 'common';
import CardsWithImages from '../generic/CardsWithImages';
import Api from 'services/api/index.js';
import { connect } from 'react-redux';
import { Spinner } from 'components';
import EmptyMessage from 'modules/generic/Empty.js'
import Geolocation from '@react-native-community/geolocation';

class Churches extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: null,
      isLoading: false,
      data: [],
      originalData: [],
      limit: 5,
      offset: 0,
      searchLimit: 5,
      searchOffset: 0,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
        formatted_address: null,
      }
    }
  }

  componentDidMount() {
    this.props.setSearchChurch(null)
    const config = {
      enableHighAccuracy: false
    };
    Geolocation.getCurrentPosition(
      info => {
        this.setState({
          region: {
            ...this.state.region,
            latitude: info.coords.latitude,
            longitude: info.coords.longitude
          }
        }, () => {
          this.retrieve(false)
        })
      },
      error => console.log("ERROR", error),
      config,
    );
  }

  retrieve = (flag) => {
    const { user } = this.props.state;
    const { region } = this.state;
    let parameter = {
      sort: { created_at: 'asc' },
      condition: [{
        value: user.id,
        column: 'account_id',
        clause: '!='
      }],
      masses: {
        latitude: region.latitude,
        longitude: region.longitude
      }
    }
    console.log(parameter, Routes.merchantsRetrieve);
    this.setState({ isLoading: true })
    Api.request(Routes.merchantsRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        response.data.map(item => {
          item.address = JSON.parse(item.address)?.name
        })
        this.setState({
          data: flag == false ? response.data : _.uniqBy([...this.state.data, ...response.data], 'id'),
          offset: flag == false ? 1 : (this.state.offset + 1),
          originalData: flag == false ? response.data : _.uniqBy([...this.state.data, ...response.data], 'id')
        })
      } else {
        this.setState({
          data: flag == false ? [] : this.state.data,
          offset: flag == false ? 0 : this.state.offset
        })
      }
    },  error => {
      console.log(error);
      this.setState({ isLoading: false });
    });
  }

  componentDidUpdate(){
    const { searchChurch } = this.props.state;
    if(searchChurch !== null && searchChurch !== '') {
      this.search(false)
    }
  }

  search = (flag) => {
    const { searchChurch, user } = this.props.state;
    const { searchLimit, searchOffset } = this.state;
    let parameter = {
      condition: [
        {
          value: '%' + searchChurch + '%',
          column: 'name',
          clause: 'like'
        },
        {
          value: user.id,
          column: 'account_id',
          clause: '!='
        }
      ],
      sort: { created_at: 'asc' },
      limit: searchLimit,
      offset: flag == true && searchOffset > 0 ? (searchOffset * searchLimit) : searchOffset
    }
    Api.request(Routes.merchantsRetrieve, parameter, response => {
      if (response.data.length > 0) {
        response.data.map(item => {
          item.address = JSON.parse(item.address)?.name
        })
        this.setState({
          data: flag == false ? response.data : _.uniqBy([...this.state.data, ...response.data], 'id'),
          searchOffset: flag == false ? 1 : (searchOffset + 1)
        })
      } else {
        this.setState({
          data: flag == false ? [] : this.state.data,
          searchOffset: flag == false ? 0 : searchOffset
        })
      }
    }, error => {
      console.log(error);
      this.setState({ isLoading: false });
    });
  }

  render() {
    const { theme, language, searchChurch } = this.props.state;
    const { data, isLoading, originalData } = this.state;
    let d = []
    d = searchChurch == null || searchChurch == '' ? originalData : data;
    return (
      <View style={{
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            let scrollingHeight = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y
            let totalHeight = event.nativeEvent.contentSize.height
            if (event.nativeEvent.contentOffset.y <= 0) {
              if (isLoading == false) {
                // this.retrieve(false)
              }
            }
            if (scrollingHeight >= (totalHeight)) {
              if (isLoading == false) {
                if(searchChurch === null &&  searchChurch === '') {
                  this.retrieve(true)
                } else {
                  this.search(true)
                }
              }
            }
          }}
        >
          {d.length === 0 && !isLoading && <View style={{
            padding: 20
          }}>
            <EmptyMessage message={language.churches.empty} /></View>}
          {this.state.isLoading ? <Spinner mode="overlay" /> : null}
          <CardsWithImages
            photos={true}
            version={3}
            data={d}
            buttonColor={theme ? theme.primary : Color.primary}
            buttonTitle={language.subscribe}
            redirect={(index) => { this.props.navigation.navigate('churchProfileStack', { data: index }) }}
            buttonClick={(item) => { this.props.navigation.navigate('otherTransactionStack', { type: 'Subscription Donation', data: item }) }}
          />
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setSearchChurch: (searchChurch) => dispatch(actions.setSearchChurch(searchChurch))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Churches);
