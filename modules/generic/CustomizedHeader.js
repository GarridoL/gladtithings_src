import React, { Component } from 'react';
import { View, Image, Dimensions, Text } from 'react-native'
import { BasicStyles, Color } from 'common';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCalendarCheck, faChurch, faExclamationTriangle, faImage, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import Button from '../generic/Button.js'
import Config from 'src/config.js';

const width = Math.round(Dimensions.get('window').width)

const height = Math.round(Dimensions.get('window').height)
class CustomizedHeader extends Component {
  constructor(props) {
    super(props)
  }

  versionOne = () => {
    const { theme, language, user } = this.props.state;
    const { text } = this.props;
    return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Text style={{
          textAlign: 'center',
          padding: 10,
          fontSize: 13
        }}>
          {language.subscription.hi}, {user.account_information.first_name + ' ' + user.account_information.last_name}. {language.subscription.greet} {text}
        </Text>
        <Button
          style={{
            width: '40%',
            height: 30,
            backgroundColor: theme ? theme.secondary : Color.secondary,
            marginTop: 10
          }}
          content={
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Text style={{
                color: 'white',
                fontSize: 12,
                fontFamily: 'Poppins-SemiBold'
              }}>{language.findChurch}</Text>
            </View>
          }
          redirect={() => {
            this.props.redirect()
          }}
        />
      </View>
    )
  }

  versionTwo = () => {
    const { theme, language } = this.props.state;
    const { data } = this.props;
    return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        flexDirection: 'row'
      }}>
        <View style={{
          width: '50%',
          height: (height / 4) - 40,
          backgroundColor: 'white',
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {data?.merchant_details?.logo ? <Image
            source={{ uri: Config.BACKEND_URL + data?.merchant_details?.logo }}
            style={{
              height: '100%',
              width: '100%',
              borderRadius: 10
            }}
          /> : <FontAwesomeIcon
          icon={faImage}
          size={100}
          style={{
            color: Color.gray
          }}
        /> }
        </View>
        <View style={{
          width: '50%',
          paddingLeft: 15,
          paddingRight: 15
        }}>
          <Text style={{
            color: Color.white,
            fontFamily: 'Poppins-SemiBold'
          }}>{data?.merchant_details != null ? data?.merchant_details?.name : ''}</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%'
          }}>
            <FontAwesomeIcon
              icon={faChurch}
              size={10}
              style={{ marginRight: 5 }}
            />
            <Text style={{
              fontFamily: 'Poppins-SemiBold'
            }}>$ {data != null ? data?.amount.toFixed(2) : 0} / {data?.cycle}</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%'
          }}>
            <FontAwesomeIcon
              icon={faCalendarCheck}
              size={10}
              style={{ marginRight: 5 }}
            />
            <Text
              style={{
                fontSize: 10,
                width: '90%',
                fontFamily: 'Poppins-SemiBold'
              }}>{language.nextDonation} {data?.next_month != null ? data?.next_month : ''}</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '85%'
          }}>
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              size={10}
              style={{ marginRight: 5 }}
            />
            <Text style={{
              fontSize: 10,
              fontFamily: 'Poppins-SemiBold'
            }}>{data?.merchant_details != null ? data?.merchant_details?.address : ''}</Text>
          </View>

          {!this.props.showButton && <Button
            style={{
              width: '80%',
              height: 35,
              backgroundColor: (this.props.buttonText != null || this.props.buttonText !== undefined) ? Color.danger : (theme ? theme.secondary : Color.secondary),
              marginTop: 10
            }}
            content={
              <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 12,
                  fontFamily: 'Poppins-SemiBold'
                }}>{(this.props.buttonText != null || this.props.buttonText !== undefined) ? language.edit : this.props.donate ? language.donate : language.goToSubscription}</Text>
              </View>
            }
            redirect={() => {
              this.props.redirect()
            }}
          />}
        </View>
      </View>
    )
  }

  versionThree = () => {
    const { theme, language } = this.props.state;
    const { data } = this.props;
    return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        flexDirection: 'row',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 18
      }}>
        <View style={{
          width: '50%',
          height: (height / 4) - 40
        }}>
          <Image
            source={{ uri: Config.BACKEND_URL + data.merchant_details.logo }}
            style={{
              height: '100%',
              width: '100%',
              borderRadius: 10
            }}
          />
        </View>
        <View style={{
          width: '50%',
          paddingLeft: 15,
          paddingRight: 15
        }}>
          <Text style={{
            color: Color.white,
            fontFamily: 'Poppins-SemiBold'
          }}>{data.merchant_details.name}</Text>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%'
          }}>
            <FontAwesomeIcon
              icon={faChurch}
              size={10}
              style={{ marginRight: 5 }}
            />
            <Text style={{
              fontFamily: 'Poppins-SemiBold'
            }}>$ {data.amount.toFixed(2)} / {data?.cycle}</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%'
          }}>
            <FontAwesomeIcon
              icon={faCalendarCheck}
              size={10}
              style={{ marginRight: 5 }}
            />
            <Text
              style={{
                fontSize: 10,
                width: '90%',
                fontFamily: 'Poppins-SemiBold'
              }}>{language.nextDonation} {data.next_month}</Text>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '85%'
          }}>
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              size={10}
              style={{ marginRight: 5 }}
            />
            <Text style={{
              fontSize: 10,
              fontFamily: 'Poppins-SemiBold'
            }}>{data.merchant_details.address}</Text>
          </View>

          {!this.props.showButton && <Button
            style={{
              width: '80%',
              height: 35,
              backgroundColor: theme ? theme.secondary : Color.secondary,
              marginTop: 10
            }}
            content={
              <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 12,
                  fontFamily: 'Poppins-SemiBold'
                }}>{language.goToSubscription}</Text>
              </View>
            }
            redirect={() => { this.props.redirect() }
            }
          />}
        </View>
      </View>
    )
  }

  versionFour = () => {
    const { theme, language, user } = this.props.state;
    const { text } = this.props;
    return (
      <View style={{
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
      }}>
        <FontAwesomeIcon
          icon={faChurch}
          size={50}
          style={{ marginRight: 5, color: Color.white }}
        />
        <Text style={{
          textAlign: 'center',
          padding: 10,
          fontSize: 13,
          color: Color.white
        }}>
          {text}
        </Text>
        <Button
          style={{
            width: '40%',
            height: 35,
            backgroundColor: theme ? theme.secondary : Color.secondary,
            marginTop: 10
          }}
          content={
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Text style={{
                color: 'white',
                fontSize: 12,
                fontFamily: 'Poppins-SemiBold'
              }}>{language.goToSubscription}</Text>
            </View>
          }
          redirect={() => {
            this.props.redirect()
          }}
        />
      </View>
    )
  }

  render() {
    const { theme } = this.props.state;
    return (
      <View style={{
        height: height / 3.5,
        backgroundColor: this.props.version != 3 ? (theme ? theme.primary : Color.primary) : ('#C4C4C4'),
        borderBottomRightRadius: this.props.version != 3 ? 30 : 50,
        borderBottomLeftRadius: this.props.version != 3 ? 30 : 50,
        borderTopRightRadius: this.props.version != 3 ? 0 : 50,
        borderTopLeftRadius: this.props.version != 3 ? 0 : 50,
        width: width,
        paddingLeft: 15,
        paddingRight: 15,
        marginBottom: this.props.version != 3 ? 0 : 15,
        justifyContent: 'center'
      }}>
        {this.props.version === 1 && this.versionOne()}
        {this.props.version === 2 && this.versionTwo()}
        {this.props.version === 3 && this.versionThree()}
        {this.props.version === 4 && this.versionFour()}
      </View>
    )
  }
}

const mapStateToProps = state => ({ state: state });
const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps)(CustomizedHeader);