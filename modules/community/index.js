import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Color, BasicStyles, Routes } from 'common';
import Loading from 'components/Loading/Skeleton'
import { connect } from 'react-redux';
import IncrementButton from 'components/Form/Button';
import Format from './TabContainer'
import Card from './Card'
import Api from 'services/api';
import _ from 'lodash';
import Comments from 'src/components/Comments/index';
import { Spinner } from 'components';
import Skeleton from '../../components/Loading/Skeleton';
import { WebView } from 'react-native-webview';

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)

const dataPope = [
  {
    id: 0,
    account: {
      id: 0,
      username: 'Pope Francis',
      first_name: 'Pope',
      last_name: 'Francis'
    },
    text: "May Saints Cyril and Methodius, precursors of #ecumenism, help us make every effort to work for a reconciliation of diversity in the Holy Spirit: a unity that, witout being uniformity, is capable of being a sign and witness to the freedom of Christ, the Lord. #ApostolicJourney",
    created_at_human: 'Just Now',
  },
  {
    id: 1,
    account: {
      id: 0,
      username: 'Pope Francis',
      first_name: 'Pope',
      last_name: 'Francis'
    },
    text: "The Eucharist is here to remind us who God is. It does not do so just in words, but in a concrete way, showing us God as bread broken, as love crucified and  bestowed. #EcharisticCongress #Budapest",
    created_at_human: 'Just Now',
  }
]

class Community extends Component {
  constructor(props) {
    super(props);
    this.state = {
      default: true,
      community: false,
      message: false,
      isActive: null,
      isActive2: null,
      community: [],
      data: [],
      offset: 0,
      limit: 5,
      isSuggestionLoading: false,
      isJoinedLoading: false,
      isManagedLoading: false
    }
  }

  componentDidMount() {
    this.setState({
      default: true,
      community: false,
      message: false,
      shouldRetrieve: false
    })
  }

  componentDidUpdate() {
    const { searchPost } = this.props.state;
    console.log(searchPost, '--')
  }

  retrieveCommunitiesSuggestions = () => {
    const { user } = this.props.state;
    if (user == null) {
      return null
    }
    let parameter = {
    }
    console.log({
      parameter
    })
    this.setState({ isSuggestionLoading: true })
    Api.request(Routes.pageRetrieve, parameter, response => {
      this.retrieveCommunitiesJoined()
      this.setState({ isSuggestionLoading: false })
      console.log({
        response
      })
      if (response.data && response.data.length > 0) {
        this.setState({
          community: response.data
        })
      } else {
        this.setState({
          community: []
        })
      }
    }, error => {
      this.retrieveCommunitiesJoined()
      this.setState({ isSuggestionLoading: false })
    });
  }

  retrieveCommunitiesJoined = () => {
    const { user } = this.props.state;
    if (user == null) {
      return null
    }
    let parameter = {
    }
    console.log({
      parameter
    })
    this.setState({ isJoinedLoading: true })
    Api.request(Routes.pageRetrieve, parameter, response => {
      this.setState({ isJoinedLoading: false })
      this.retrieveCommunitiesManaged()
      console.log({
        response
      })
      if (response.data && response.data.length > 0) {
        this.setState({
          community: response.data
        })
      } else {
        this.setState({
          community: []
        })
      }
    }, error => {
      this.retrieveCommunitiesManaged()
      this.setState({ isJoinedLoading: false })
    });
  }

  retrieveCommunitiesManaged = () => {
    const { user } = this.props.state;
    if (user == null) {
      return null
    }
    let parameter = {
    }
    console.log({
      parameter
    })
    this.setState({ isManagedLoading: true })
    Api.request(Routes.pageRetrieve, parameter, response => {
      this.setState({ isManagedLoading: false })
      console.log({
        response
      })
      if (response.data && response.data.length > 0) {
        this.setState({
          community: response.data
        })
      } else {
        this.setState({
          community: []
        })
      }
    }, error => {
      this.setState({ isManagedLoading: false })
    });
  }

  popetwitterMessage = () => {
    this.setState({
      default: false,
      message: true,
      community: false,
    })
  }

  communitiesMessage = () => {
    this.setState({
      default: false,
      message: false,
      community: true
    })
    this.retrieveCommunitiesSuggestions()
  }

  popetwitter = () => {
    return (
      <WebView
        source={{
          uri: 'https://twitter.com/pontifex'
        }}
        style={{
          height: 10000,
        }}
        startInLoadingState={true}
        javaScriptEnabled={true}
        thirdPartyCookiesEnabled={true}
      // onShouldStartLoadWithRequest={this.handleChange}
      />
    )
  }

  communities = () => {
    const { community, isSuggestionLoading, isJoinedLoading, isManagedLoading } = this.state;
    return (
      <View style={{
        marginBottom: 100
      }}>
        <View style={{
          marginTop: 20,
        }}>
          <Text
            style={{
              ...BasicStyles.standardWidth,
              fontFamily: 'Poppins-SemiBold',
              fontWeight: 'bold'
            }}
          >Communities You Might Interested In</Text>
        </View>
        {isSuggestionLoading && (
          <Loading template={'block'} size={1} />
        )}
        {community.length > 0 && community.map((item, index) => (
          <Card
            data={item}
            from={'suggestions'}
            navigation={this.props.navigation}
          />
        ))}
        <View style={{
          marginTop: 20,
        }}>
          <Text
            style={{
              ...BasicStyles.standardWidth,
              fontFamily: 'Poppins-SemiBold',
              fontWeight: 'bold'
            }}
          >Communities You Manage</Text>
        </View>
        {isJoinedLoading && (
          <Loading template={'block'} size={1} />
        )}
        {community.length > 0 && community.map((item, index) => (
          <Card
            data={item}
            from={'managed'}
            navigation={this.props.navigation}
          />
        ))}
        <View style={{
          marginTop: 20,
          marginBottom: 20
        }}>
          <Text
            style={{
              ...BasicStyles.standardWidth,
              fontFamily: 'Poppins-SemiBold',
              fontWeight: 'bold'
            }}
          >Communities You Followed & Joined</Text>
          <Text
            style={{
              paddingTop: 10,
              ...BasicStyles.standardWidth,
            }}
          >View Recommendation</Text>
        </View>

        {isManagedLoading && (
          <Loading template={'block'} size={1} />
        )}
        {community.length > 0 && community.map((item, index) => (
          <Card
            data={item}
            navigation={this.props.navigation}
            from={'joined'}
          />
        ))}
      </View>
    )
  }

  render() {
    const { isLoading, shouldRetrieve } = this.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        <ScrollView showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            let scrollingHeight = event.nativeEvent.layoutMeasurement.height + event.nativeEvent.contentOffset.y
            let totalHeight = event.nativeEvent.contentSize.height
            if (event.nativeEvent.contentOffset.y <= 0) {
              if (isLoading == false) {
              }
            }
            if (Math.round(scrollingHeight) >= Math.round(totalHeight)) {
              console.log(Math.round(scrollingHeight), Math.round(totalHeight), this.commentRef)
              this.setState({ shouldRetrieve: true })
            } else[
              this.setState({ shouldRetrieve: false })
            ]
          }}>
          {/* <TouchableOpacity
            style={{
              margin: 10
            }} onPress={() => {
              console.log('hi')
              this.myRef.current.openBottomSheet()
            }} >
            <Text>Test Bottom Sheet</Text>
          </TouchableOpacity> */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            marginHorizontal: 20,
            overflow: 'hidden'
          }}>
            <IncrementButton style={{
              backgroundColor: this.state.isActive2 == 1 ? Color.secondary : Color.white,
              width: '45%',
              borderWidth: 0.1,
            }}
              textStyle={{
                color: this.state.isActive2 == 1 ? Color.white : Color.black
              }}
              onClick={() => {
                this.setState({
                  isActive2: 1,
                  isActive: 0
                })
                this.communitiesMessage()
              }}
              title={'Communities'}
            />
            <IncrementButton style={{
              backgroundColor: this.state.isActive == 1 ? Color.secondary : Color.white,
              width: '50%',
              borderWidth: 0.1,
            }}
              textStyle={{
                color: this.state.isActive == 1 ? Color.white : Color.black
              }}
              onClick={() => {
                this.setState({
                  isActive: 1,
                  isActive2: 0
                })
                this.popetwitterMessage()
              }}
              title={"Pope's Messages"}
            />
          </View>
          {this.state.default == true &&
            <View style={{
              marginBottom: height / 2
            }}>
              <Comments withImages={true} shouldRetrieve={shouldRetrieve} navigation={this.props.navigation} />
            </View>
          }
          {
            (this.state.default && this.isLoading) && (
              <Skeleton template={'request'} />
            )
          }
          {this.state.message && this.popetwitter()}
          {this.state.community && this.communities()}
        </ScrollView>
        {/* <Footer layer={0} {...this.props} /> */}
        {/* <BottomSheetOptions
          ref={this.myRef}
        ></BottomSheetOptions> */}
      </View>
    );
  }
}

const mapStateToProps = (state) => ({ state: state });

const mapDispatchToProps = (dispatch) => {
  const { actions } = require('@redux');
  return {
    setComments: (comments) => {
      dispatch(actions.setComments(comments));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Community);