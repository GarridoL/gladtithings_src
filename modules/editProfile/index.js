import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  Linking,
  TouchableHighlight,
  Platform
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Api from 'services/api/index.js';
import {
  faCheckCircle,
  faUserCircle,
  faUpload,
  faEdit,
  faUser,
  faMobile,
  faMapMarkerAlt
} from '@fortawesome/free-solid-svg-icons';
import { BasicStyles, Color, Routes, Helper } from 'common';
import { Rating, DateTime } from 'components';
import { connect } from 'react-redux';
import UserImage from 'components/User/Image';
import Button from 'components/Form/Button';
import ImagePicker from 'react-native-image-picker';
import { Spinner } from 'components';
import Skeleton from 'components/Loading/Skeleton';
import ImageModal from 'components/Modal/ImageModal';
import ImageResizer from 'react-native-image-resizer';
import Config from 'src/config.js';
import InputFieldWithIcon from 'modules/generic/InputFieldWithIcon';

const gender = [{
  title: 'Male',
  value: 'male'
},
{
  title: 'Female',
  value: 'female'
}];
class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      // cellular_number: null,
      first_name: null,
      middle_name: null,
      last_name: null,
      sex: null,
      id: null,
      // address: null,
      // birthDate: null,
      profile: null,
      url: null,
      photo: null,
      dataRetrieve: null,
      isLoading: false,
      uploadedID: [],
      imageModal: false,
      urlID: null,
      reachMax: false,
      radioSelected: 'male',
      rating: null,
      verifyButton: false,
      imageId: null
    };
  }

  componentDidMount = () => {
    this.retrieve()
  }

  retrieve = () => {
    const { user } = this.props.state;
    if (user == null) {
      return
    }
    let parameter = {
      condition: [{
        value: user.id,
        clause: '=',
        column: 'account_id'
      }]
    }
    this.setState({
      isLoading: true,
      showDatePicker: false
    })
    Api.request(Routes.accountProfileRetrieve, parameter, response => {
      this.setState({ isLoading: false })
      if (response.data.length > 0) {
        const { data } = response
        this.setState({ dataRetrieve: response.data[0] })
        this.setState({
          id: data[0].account_id,
          first_name: data[0].first_name,
          middle_name: data[0].middle_name,
          last_name: data[0].last_name,
          sex: data[0].sex,
          rating: data[0].rating,
          // cellular_number:  data[0].cellular_number,
          // address: data[0].address,
          profile: data[0]
        })
      } else {
        this.setState({
          id: null,
          first_name: null,
          middle_name: null,
          last_name: null,
          sex: null,
          // cellular_number: null,
          // address: null
          // birthDate: new Date(),
        })
      }
    });
  }



  upload = () => {
    const { user } = this.props.state
    const { profile } = this.state
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
            this.setState({ photo: res })
            let formData = new FormData();
            let uri = Platform.OS == "android" ? res.uri : res.uri.replace("file://", "");
            formData.append("file", {
              name: response.fileName,
              type: response.type,
              uri: uri
            });
            formData.append('file_url', response.fileName);
            formData.append('account_id', user.id);
            this.setState({ isLoading: true })
            Api.upload(Routes.imageUpload, formData, response => {
              this.setState({ isLoading: false })
              let imageData = new FormData()
              imageData.append('account_id', user.id);
              imageData.append('url', response.data.data)
            })
          })
          .catch(err => {
            // Oops, something went wrong. Check that the filename is correct and
            // inspect err to get more details.
            console.log(err)
          });
      }
    })
  }

  uploadMessage = () => {
    const { reachMax } = this.state
    // if(reachMax == true){
    //   Alert.alert(
    //     'Message',
    //     `Please upload minimum of four(4) ID's`,
    //     [
    //       { text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel' }
    //     ],
    //     { cancelable: false }
    //   )
    // }else{
      Alert.alert(
        'Notice',
        "Please upload at least two(2) ID's (Back to Back)",
        [
          { text: 'Ok', onPress: () => this.uploadId(), style: 'cancel' },
          { text: 'Cancel', onPress: () => console.log('cancel'), style: 'cancel' }
        ],
        { cancelable: false }
      )
    // }
  }

  uploadId = () => {
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
            this.setState({ photo: res })
            let formData = new FormData();
            let uri = Platform.OS == "android" ? res.uri : res.uri.replace("file://", "");
            formData.append("file", {
              name: response.fileName,
              type: response.type,
              uri: uri
            });
            formData.append('file_url', response.fileName);
            formData.append('account_id', user.id);
            this.setState({ isLoading: true })
            Api.upload(Routes.imageUpload, formData, response => {
              this.setState({ isLoading: false })
              let imageData = new FormData()
              imageData.append('account_id', user.id);
              imageData.append('payload_value', response.data.data)
              imageData.append('payload', 'upload_image')
                Api.upload(Routes.accountCardsCreate, imageData, response => {
                  if (response.data !== null) {
                    this.retrieve()
                    Alert.alert(
                      'Message',
                      'ID successfully uploaded',
                      [
                        { text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel' }
                      ],
                      { cancelable: false }
                    )
                  }
                })
            })
          })
          .catch(err => {
            // Oops, something went wrong. Check that the filename is correct and
            // inspect err to get more details.
            console.log('[ERROR]', err)
          });
      }
    })}

  update = () => {
    const { user, setScheduleShow } = this.props.state;
    const { dataRetrieve } = this.state
    if (user == null) {
      return
    } else if (this.state.first_name == null || this.state.middle_name == null || this.state.last_name == null) {
      Alert.alert(
        'Try Again',
        'Please fill in all the fields.',
        [
          { text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel' }
        ],
        { cancelable: false }
      )
      return
    } else if (this.state.first_name == dataRetrieve.first_name && this.state.middle_name == dataRetrieve.middle_name && this.state.last_name == dataRetrieve.last_name && this.state.sex == dataRetrieve.sex) {
      Alert.alert(
        'Message',
        'Nothing is Updated',
        [
          { text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel' }
        ],
        { cancelable: false }
      )
      return
    }
    // }else if(this.state.cellular_number.length != 11 || (this.state.cellular_number.substr(0, 2) != '09')){
    //   Alert.alert(
    //     'Try Again',
    //     'Please input a valid phone number.',
    //     [
    //       {text: 'Ok', onPress: () => console.log('Ok'), style: 'cancel'}
    //     ],
    //     { cancelable: false }
    //   )
    //   return
    // }
    let parameters = {
      id: this.state.id,
      account_id: user.id,
      first_name: this.state.first_name,
      middle_name: this.state.middle_name,
      last_name: this.state.last_name,
      sex: this.state.sex,
      // address: this.state.address,
      // birth_date: this.state.birthDate,
      email: this.state.email
    };
    this.setState({ isLoading: true });
    Api.request(
      Routes.accountInformationUpdate,
      parameters, (response) => {
        this.setState({ isLoading: false });
        this.retrieve()
        setScheduleShow(true)
        alert('Updated Successfully');
      },
      (error) => {
        this.setState({ isLoading: false });
      }
    )
  }

  radioClick(id) {
    this.setState({
      sex: id
    })
  }

  gender = () => {
    const { theme } = this.props.state;
    return (
      gender.map((val) => {
        return (
          <TouchableOpacity
          style={{flexDirection: 'row', width: '80%'}}
          key={val.value} onPress={this.radioClick.bind(this, val.value)}>
            <View style={{
              height: 24,
              width: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: theme ? theme.primary : Color.primary,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              marginTop: '5%'
            }}>
              {
                val.value == (this.state.sex != null ? this.state.sex : this.state.radioSelected) ?
                <View style={{
                  height: 12,
                  width: 12,
                  borderRadius: 6,
                  backgroundColor: theme ? theme.primary : Color.primary
                }} />
                : null
              }
            </View>
            <Text style={{flexDirection: 'column', 
              marginTop: '5%', marginLeft: '5%'}}>{val.title}</Text>
          </TouchableOpacity>
        )
      })
    );
  }
 
  render() {
    const { isLoading } = this.state
    const { user, theme } = this.props.state;
    return (
      <View>
        <ScrollView showsHorizontalScrollIndicator={false}>
          <View
            style={{
              alignItems: 'center',
              paddingVertical: 10,
              width: '100%',
              backgroundColor: theme ? theme.primary : Color.primary,
            }}>

            <TouchableOpacity
              style={{
                height: 110,
                width: 110,
                borderRadius: 100,
                borderColor: theme ? theme.primary : Color.primary,
                borderWidth: 2
              }}
              onPress={() => this.upload()}>
              <UserImage
                user={this.state.profile}
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: 100
                }}
                size={100}
                color={Color.white}
              />
              <View style={{
                height: 40,
                width: 40,
                borderRadius: 100,
                marginRight: 5,
                position: 'absolute',
                right: -5,
                bottom: 1,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <View style={{
                  height: 35,
                  width: 35,
                  borderRadius: 100,
                  borderWidth: 2,
                  borderColor: theme ? theme.primary : Color.primary,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <FontAwesomeIcon style={{
                    borderColor: theme ? theme.primary : Color.primary
                  }}
                    icon={faEdit}
                    size={20}
                    color={theme ? theme.primary : Color.primary}
                  />
                </View>
              </View>
            </TouchableOpacity>

            {
              user?.username && (
                <Text style={[{ fontFamily: 'Poppins-SemiBold', color: Color.white }]}>
                  {user.username}
                </Text>
              )
            }

            {
              this.state.rating != null && (
                <Rating ratings={this.state.rating} rating={' '} style={[{ flex: 2 }]}></Rating>
              )
            }
          </View>

          {isLoading ? <Spinner mode="overlay" /> : null}
          <View>

            <Text
              style={{
                borderBottomWidth: 1,
                padding: 15,
                paddingTop: 20,
                paddingBottom: 20,
                marginBottom: 10,
                fontFamily: 'Poppins-SemiBold',
                borderColor: Color.lightGray,
              }}>
              Basic Settings
            </Text>

            <View style={{
              width: '100%',
              paddingLeft: 20,
              paddingRight: 20,
            }}>

            <InputFieldWithIcon
              placeholder={'First Name'}
              icon={faUser}
              label={'First Name'}
              onTyping={(text) => {this.setState({input: text})}}
            />

            <InputFieldWithIcon
              placeholder={'Last Name'}
              icon={faUser}
              label={'Last Name'}
              onTyping={(text) => {this.setState({input: text})}}
            />

            <InputFieldWithIcon
              placeholder={'Mobile Number'}
              icon={faMobile}
              label={'Mobile Number'}
              onTyping={(text) => {this.setState({input: text})}}
            />

            <InputFieldWithIcon
              placeholder={'Address'}
              icon={faMapMarkerAlt}
              label={'Address'}
              onTyping={(text) => {this.setState({input: text})}}
            />

            </View>


            <View style={{
              width: '100%',
              paddingTop: 20,
              paddingBottom: 20,
              paddingLeft: 20,
              paddingRight: 20,
              alignItems: 'center'
            }}>
              <Button
                title={'Save'}
                onClick={() => this.update()}
                style={{
                  width: '100%',
                  backgroundColor: Color.secondary,
                  borderWidth: 1
                }}
                textStyle={{
                  fontFamily: 'Poppins-SemiBold',
                  color: Color.white,
                }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });

const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {
    setImageCount: (imageCount) => dispatch(actions.setImageCount(imageCount)),
    setScheduleShow: (scheduleShow) => dispatch(actions.setScheduleShow(scheduleShow))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProfile);

