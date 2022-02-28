import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Color, Routes, BasicStyles } from 'common';
import { connect } from 'react-redux';
import Api from 'services/api/index.js';
import Skeleton from 'components/Loading/Skeleton';
import CardsWithIcon from '../generic/CardsWithIcon';
import EmptyMessage from 'modules/generic/Empty.js'
import _ from 'lodash';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import StreetView from 'react-native-streetview';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

class Masses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      churches: [],
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      isLoading: false,
      offset: 0,
      limit: 5,
      isMapReady: false,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.12,
        longitudeDelta: 0.12,
        formatted_address: null,
      },
      mapType: 'standard',
      streetView: false
    }
  }

  onRegionChange = (region) => {
    this.setState({
      region: region
    })
  };

  onMapLayout = () => {
    this.setState({ isMapReady: true });
  };

  componentDidMount() {
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
        })
        this.retrieveChurches()
      },
      error => console.log("ERROR", error),
      config,
    );
    console.log('--s-')
  }

  retrieveChurches = () => {
    const { region, offset, limit, churches } = this.state;
    const { user } = this.props.state;
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
    this.setState({ isLoading: true })
    console.log(Routes.merchantsRetrieve, parameter);
    Api.request(Routes.merchantsRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        this.setState({
          churches: response.data
        })
        console.log(response.data[0])
      }
    }, error => {
      console.log(error)
      this.setState({ isLoading: false })
    });
  }

  renderMap = () => {
    const { region, mapType, streetView } = this.state;
    const { theme } = this.props.state;
    return (
      <View>
        <MapView
          style={{
            minWidth: width - 50,
            minHeight: height - (height/2.5),
            flex: 1,
            borderRadius: BasicStyles.standardBorderRadius
          }}
          mapType={mapType}
          ref={(ref) => (this.mapView = ref)}
          onMapReady={this.onMapLayout}
          provider={PROVIDER_GOOGLE}
          region={region} // without this the map won't move. but layo kaayo ang map
          // onRegionChangeComplete={(e) => this.onRegionChange(e)} // without this dili momove ang map but dili machange ang current loc as you move the map
        >
          {
            this.state.isMapReady &&
            <Marker
              key={0}
              coordinate={region}
              title={'My Current Location'}
              tracksViewChanges={false}
            >
              <Image
                source={require('src/assets/userPosition.png')}
                style={{
                  width: 50,
                  height: 50
                }}
              />
            </Marker>
          }
          {
            this.state.isMapReady && this.state.churches.length > 0 && this.state.churches.map((item, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={JSON.parse(item.address)}
                  title={JSON.parse(item.address).name}
                  tracksViewChanges={false}
                >
                  <Image
                    source={require('src/assets/userPosition.png')}
                    style={{
                      width: 50,
                      height: 50
                    }}
                  />
                </Marker>
              )
            })
          }
        </MapView>
      </View>
    );
  };

  render() {
    const { language, theme } = this.props.state;
    const { churches, isLoading, region, streetView, mapType } = this.state;
    return (
      <View style={{
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginBottom: height / 2 }}>
            <View>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: 60,
                  right: 10,
                  zIndex: 100,
                  padding: 10,
                  borderRadius: 20,
                  backgroundColor: theme ? theme.primary : Color.primary
                }}
                onPress={() => {
                  this.setState({ mapType: mapType === 'standard' ? 'satellite' : 'standard' })
                }}
              >
                <Text style={{ color: 'white' }}>{mapType === 'standard' ? 'Satellite View' : 'Standard View'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  zIndex: 100,
                  padding: 10,
                  borderRadius: 20,
                  backgroundColor: !streetView ? (theme ? theme.primary : Color.primary) : Color.danger
                }}
                onPress={() => {
                  this.setState({ streetView: !streetView })
                }}
              >
                <Text style={{ color: 'white' }}>{!streetView ? 'Enable Street View' : 'Disable Street View'}</Text>
              </TouchableOpacity>
              {streetView &&
                <View style={{
                  flex: 1
                }}>
                  <StreetView
                    style={{
                      minWidth: width - 50,
                      minHeight: height - (height/2.5),
                      margin: 0
                    }}
                    allGesturesEnabled={true}
                    coordinate={region}
                    pov={{
                      tilt: parseFloat(0),
                      bearing: parseFloat(0),
                      zoom: parseInt(1)
                    }}
                    onSuccess={() => console.log('map loaded')}
                    onError={(event) => console.log('failed to load map', event.nativeEvent)}
                  />
                </View>}
              {!streetView && this.renderMap()}
            </View>
            <View style={{ padding: 15 }}>
            {!isLoading && churches.length === 0 && <EmptyMessage message={language.massesNearby.emptyMasses} />}
              {
                churches.map((item, index) => {
                  return (
                    <CardsWithIcon
                      key={index}
                      item={item}
                      version={6}
                      description={'Direct Transfer'}
                      title={item.name}
                      date={JSON.parse(item.address)?.name}
                      redirect={() => {
                        
                        this.setState({
                          region: {
                            ...this.state.region,
                            latitude: JSON.parse(item.address)?.latitude,
                            longitude: JSON.parse(item.address)?.longitude
                          }
                        })
                      }}
                      amount={null}
                    />
                  )
                })
              }
            </View>
            {
              (isLoading) && (
                <Skeleton size={3} template={'block'} height={75} />
              )
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapStateToProps = state => ({ state: state });

export default connect(
  mapStateToProps
)(Masses);
