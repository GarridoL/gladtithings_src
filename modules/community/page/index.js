import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image, Platform } from 'react-native';
import { Color, BasicStyles, Routes } from 'common';
import { connect } from 'react-redux';
import { faChevronLeft, faImage, faCog, faSitemap, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import _ from 'lodash';
import Comments from 'src/components/Comments/index';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImagePicker from 'react-native-image-picker';
import ImageModal from 'components/Modal/ImageModalV2'
import Config from 'src/config.js';
import ImageResizer from 'react-native-image-resizer';
import Api from 'services/api';

const photoMenu = [{
  title: 'View Photo',
  route: 'view_photo',
  type: 'callback',
  icon: faChevronLeft
}, {
  title: 'Change Photo',
  route: 'change_photo',
  type: 'callback',
  icon: faCog
}];

const width = Math.round(Dimensions.get('window').width)
const height = Math.round(Dimensions.get('window').height)



class Page extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef()
    this.imageRef = React.createRef()
    this.state = {
      isLoading: false,
      data: null,
      image: null,
      viewImage: []
    }
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    this.setState({ data: params.data })
  }

  upload = () => {
    const { data, image } = this.state;
    const { user } = this.props.state
    const options = {
      noData: true
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        this.setState({ photo: null })
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        this.setState({ photo: null })
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        this.setState({ photo: null })
      } else {
        ImageResizer.createResizedImage(response.uri, response.width * 0.5, response.height * 0.5, 'JPEG', 72, 0)
          .then(res => {
            let formData = new FormData();
            let uri = Platform.OS == "android" ? res.uri : res.uri.replace("file://", "");
            formData.append("file", {
              name: response.fileName,
              type: response.type,
              uri: uri
            });
            formData.append('file_url', response.fileName);
            formData.append('account_id', user.id);
            formData.append('category', image === 'profile' ? 'page-logo' : 'page-cover');
            this.setState({ isLoading: true })
            Api.upload(Routes.imageUpload, formData, respo => {
              this.setState({ isLoading: false })
              let details = null
              let add = this.state.data.additional_informations
              if (add !== null) {
                if (image === 'profile') {
                  details = {
                    ...JSON.parse(add),
                    profile: respo.data.data
                  }
                } else {
                  details = {
                    ...JSON.parse(add),
                    cover: respo.data.data
                  }
                }
              } else {
                if (image === 'profile') {
                  details = {
                    profile: respo.data.data
                  }
                } else {
                  details = {
                    cover: respo.data.data
                  }
                }
              }
              let par = {
                id: data?.id,
                additional_informations: JSON.stringify(details)
              }
              this.setState({ isLoading: true })
              Api.request(Routes.pageUpdate, par, resp => {
                this.setState({ isLoading: false })
                let dta = {
                  ...data,
                  additional_informations: JSON.stringify(details)
                }
                this.setState({data: dta});
                this.RBSheet.close()
              }, error => {
                this.setState({ loading: true })
              })
            }, error => {
              console.log(error)
            })
          })
          .catch(err => {
            console.log('[ERROR]', err)
          });
      }
    })
  }

  checkImage(params, payload) {
    if (params == null) return false
    if (params && params.additional_informations == null) return false
    if (params && params.additional_informations) {
      let details = JSON.parse(params.additional_informations)
      console.log({
        details
      })
      if (details && details.profile && payload == 'profile') {
        return true
      } else if (details && details.cover && payload == 'cover') {
        return true
      }
    }
    return false
  }

  getImage(params, payload) {
    if (params == null) return null
    if (params && params.additional_informations == null) return null
    if (params && params.additional_informations) {
      let details = JSON.parse(params.additional_informations)
      if (details && details.profile && payload == 'profile') {
        return Config.BACKEND_URL + details.profile
      } else if (details && details.cover && payload == 'cover') {
        return Config.BACKEND_URL + details.cover
      }
    }
    return null
  }


  imageOption(item) {
    const { data } = this.state;
    switch (item.title.toLowerCase()) {
      case 'change photo': {
        this.upload()
        break
      }
      case 'view photo': {
        this.RBSheet.close()
        let images = []
        if (data) {
          if (data.additional_informations) {
            let details = JSON.parse(data.additional_informations)
            images.push(details[this.state.image])
          }
        }
        this.setState({
          viewImage: images
        })
        this.imageRef.current.openBottomSheet()
        break
      }
    }
  }
  header() {
    const { theme } = this.props.state;
    const { data } = this.state;
    return (
      <View style={{
        flexDirection: 'row',
        width: '100%',
        position: 'absolute',
        top: Platform.OS == 'ios' ? 40 : 0,
        left: 0,
        zIndex: 9999,
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        alignItems: 'center'
      }}>
        <TouchableOpacity onPress={() => {
          this.props.navigation.pop()
        }}>
          {/*Donute Button Image */}
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={BasicStyles.headerBackIconSize}
            style={{
              ...BasicStyles.iconStyle,
              color: theme ? theme.primary : Color.primary
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('pageSettingScreen', {
              data: data
            })
          }}>
          {/*Donute Button Image */}
          <FontAwesomeIcon
            icon={faCog}
            size={BasicStyles.headerBackIconSize}
            style={{
              ...BasicStyles.iconStyle,
              color: theme ? theme.primary : Color.primary
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }

  pageImage() {
    const { theme } = this.props.state;
    const { data } = this.state;
    return (
      <View style={{
        marginBottom: 25
      }}>
        <TouchableOpacity style={{
          width: '100%',
          display: 'flex',
          alignContent: 'center',
          justifyContent: 'center',
          alignItems: 'center'
        }}
          onPress={() => {
            this.setState({
              image: 'cover'
            })
            this.RBSheet.open()
          }}
        >
          {
            data && this.checkImage(data, 'cover') ? (
              <Image
                style={{
                  width: width,
                  height: height / 3
                }}
                source={{ uri: this.getImage(data, 'cover') }}
              />
            ) : (
              <FontAwesomeIcon icon={faPlus} size={height / 3} color={Color.gray} />
            )
          }
        </TouchableOpacity>

        <View style={{
          width: '90%',
          position: 'relative',
          marginTop: -50,
          marginLeft: '5%',
          marginRight: '5%',
          borderRadius: 20,
          padding: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme ? theme.primary : Color.primary
        }}

        >
          <TouchableOpacity
            onPress={() => {
              this.setState({
                image: 'profile'
              })
              this.RBSheet.open()
            }}
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 30,
              height: 60,
              width: 60,
              color: Color.gray,
              backgroundColor: Color.white,
              borderColor: Color.secondary,
              borderWidth: 2
            }}
          >
            {
              data && this.checkImage(data, 'profile') ? (
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    borderWidth: 0.5,
                    borderColor: Color.secondary
                  }}
                  source={{ uri: this.getImage(data, 'profile') }}
                />
              ) : (
                <FontAwesomeIcon icon={faSitemap} size={30} color={Color.gray} />
              )
            }

          </TouchableOpacity>
          {
            data && (
              <View style={{
                width: '90%',
                marginLeft: 10
              }}>
                <Text style={{
                  fontWeight: 'bold'
                }}>{data.title}</Text>
                <Text style={{
                  color: Color.white
                }}>{data.sub_title}</Text>
              </View>
            )
          }

        </View>
      </View>
    );
  }


  render() {
    const { viewImage, data } = this.state;
    return (
      <View style={{
        height: height,
        backgroundColor: Color.containerBackground
      }}>
        {
          this.header()
        }
        <RBSheet
          ref={ref => {
            this.RBSheet = ref;
          }}
          closeOnDragDown={true}
          dragFromTopOnly={true}
          closeOnPressMask={false}
          height={height / 2}>
          {
            photoMenu && photoMenu.map(item => (
              <TouchableOpacity style={{
                width: '100%',
                paddingTop: 20,
                paddingBottom: 20,
                paddingRight: 20,
                paddingLeft: 20,
                borderBottomColor: Color.gray,
                borderBottomWidth: 0.5
              }}
                onPress={() => {
                  this.imageOption(item)
                }}
              >
                <View>
                  <Text>{item.title}</Text>
                </View>
              </TouchableOpacity>
            ))
          }
        </RBSheet>


        <ImageModal
          images={viewImage}
          ref={this.imageRef}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            minHeight: height * 1.5,
            width: '100%'
          }}>

            {
              this.pageImage()
            }

            <Comments
              navigation={this.props.navigation}
              withImages={true}
              payload={{
                payload: 'page',
                payload_value: data?.id
              }} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Page);