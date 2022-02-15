import Color from './Color';
import { Dimensions, Platform } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
const borderRadius = 12
export default {
  buttonBorderRadius: 20,
  elevation: 0,
  formControl: {
    height: 50,
    borderColor: Color.lightGray,
    backgroundColor: 'white',
    borderWidth: 1,
    width: width - 40,
    paddingLeft: 10,
    marginBottom: 20,
    borderRadius: 25
  },
  formControlModal: {
    height: 50,
    borderColor: Color.gray,
    borderWidth: 1,
    width: '90%',
    marginLeft: '5%',
    marginBottom: 20,
    borderRadius: 5,
    paddingLeft: 10
  },
  formControlCreate: {
    height: 50,
    borderColor: Color.gray,
    borderWidth: 1,
    width: '100%',
    marginBottom: 20,
    borderRadius: 25,
    paddingLeft: 10
  },
  formControls: {
    height: 60,
    borderBottomColor: Color.gray,
    borderBottomWidth: 1,
    width: '100%',
    paddingLeft: 10,
    marginBottom: 20
  },
  pickerStyle: {
    height: 50,
    borderBottomColor: Color.gray,
    borderBottomWidth: 1,
    width: '90%'
  },
  pickerStyleCreate: {
    height: 50,
    borderColor: Color.lightGray,
    borderWidth: 1,
    width: '100%',
    paddingLeft: 10,
    borderRadius: 5,
    fontSize: 12
  },
  pickerStyleIOS: {
    inputIOS: {
      borderWidth: 1,
      borderColor: Color.gray,
      borderRadius: 5,
      color: '#000',
      paddingRight: 30,
      marginRight: 18,
      marginLeft: 10,
      height: 50,
      paddingLeft: 10,
      fontSize: 12
    }
  },
  pickerStyleIOSNoMargin: {
    inputIOS: {
      borderWidth: 1,
      borderColor: Color.gray,
      borderRadius: 5,
      color: '#000',
      height: 50,
      width: '100%',
      paddingLeft: 10,
      fontSize: 12
    }
  },
  btn: {
    height: 50,
    width: width - 40,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50
  },
  btnRound: {
    height: 50,
    // backgroundColor: Color.primary,
    width: width - 40,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 50
  },
  btnPrimary: {
    backgroundColor: Color.primary
  },
  btnSecondary: {
    backgroundColor: Color.secondary
  },
  btnWarning: {
    backgroundColor: Color.warning
  },
  btnDanger: {
    backgroundColor: Color.danger
  },
  textWhite: {
    color: Color.white
  },
  iconSize: 28,
  headerBackIconSize: 30,
  iconStyle: {
    color: Color.primary,
    paddingLeft: 20,
    paddingRight: 20
  },
  titleText: {
    fontSize: 13,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 20,
    paddingRight: 20
  },
  normalText: {
    fontSize: 12,
    color: Color.gray,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 20,
    paddingRight: 20
  },
  Separator: {
    height: 0.5,
    width: width - 40,
    backgroundColor: Color.lightGray,
    marginLeft: 20
  },
  badge: {
    backgroundColor: Color.danger,
    color: Color.white,
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
    marginRight: 10
  },
  profileImageSize: {
    height: 30,
    width: 30,
    borderRadius: 15
  },
  profileIconSize: 30,
  standardFontSize: 12,
  standardTitleFontSize: 16,
  standardTitle2FontSize: 14,
  standardSubTitleFontSize: 14,
  standardHeaderFontSize: 18,
  standardBorderRadius: borderRadius,
  headerDrawerStyle: {
    headerStyle: {
      elevation: 0,
      backgroundColor: Color.containerBackground,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 18,
      width: width
    },
    headerTitleContainerStyle: {
      backgroundColor: Color.containerBackground,
      justifyContent: 'center',
      alignItems: 'center',
      paddingRight: 64,
      width: '90%'
    },
    headerTitleStyle: {
      fontFamily: 'Poppins-SemiBold',
    },
  },
  headerDrawerStyleStandard: {
    headerStyle: {
      elevation: 0,
      backgroundColor: Color.white,
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 18
    },
    headerTitleContainerStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingRight: 64
    },
    headerTitleStyle: {
      fontFamily: 'Poppins-SemiBold',
    },
  },
  standardDivider: {
    width: '90%',
    height: 0.5,
    marginLeft: '5%',
    marginRight: '5%',
  },
  standardContainer: {
    width: '90%',
    marginRight: '5%',
    marginLeft: '5%'
  },
  standardButton: {
    height: 50,
    backgroundColor: Color.primary,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25
  },
  standardTextInput: {
    height: 50,
    borderColor: Color.lightGray,
    borderWidth: 1,
    width: '100%',
    borderRadius: 25,
    paddingLeft: 10,
    justifyContent: 'center'
  },
  standardTextInputNotCentered: {
    height: 50,
    borderColor: Color.lightGray,
    borderWidth: 1,
    width: '100%',
    borderRadius: 25,
    paddingLeft: 10,
  },
  standardTextInputMultiline: {
    borderColor: Color.lightGray,
    borderWidth: 1,
    width: '100%',
    borderRadius: 25,
    paddingLeft: 10
  },
  standardShadow: {
    shadowColor: Color.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.23, // 0.23
    shadowRadius: 10, // 2.62
    elevation: 2, // 2
  },
  loginShadow: {
    shadowColor: Color.white,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.23, // 0.23
    shadowRadius: 10, // 2.62
    elevation: 15, // 2
  },
  standardFormControl: {
    height: 50,
    borderColor: Color.lightGray,
    backgroundColor: 'white',
    borderWidth: 1,
    width: '100%',
    borderRadius: 25,
    paddingLeft: 10
  },
  circleButton: {
    height: 60,
    backgroundColor: Color.primary,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50
  },
  standardWidth: {
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%'
  },
  drawerHeader: {
    headerStyle: {
      shadowColor: 'transparent',
      elevation: 0,
      borderBottomWidth: 0
    }
  },
  drawerHeader1: {
    headerStyle: {
      shadowColor: 'transparent',
      elevation: 0,
      borderBottomWidth: 0,
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 12,
      width: '100%',
      backgroundColor: Color.containerBackground,
      height: 60,
      marginTop: Platform.OS == 'ios' ? 15 : 0
    },
    headerTitleContainerStyle: {
      backgroundColor: Color.containerBackground,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: '-10%'
    },
    headerTitleStyle: {
      fontFamily: 'Poppins-SemiBold',
    },
  },
}