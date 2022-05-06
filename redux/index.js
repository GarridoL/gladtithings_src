import AsyncStorage from '@react-native-community/async-storage';
import Data from 'services/Data';
import { Helper, Color } from 'common';

const types = {
  LOGOUT: 'LOGOUT',
  LOGIN: 'LOGIN',
  UPDATE_USER: 'UPDATE_USER',
  SET_THEME: 'SET_THEME',
  SET_LAYER: 'SET_LAYER',
  SET_SHOW_SETTINGS: 'SET_SHOW_SETTINGS',
  SET_RANGE: 'SET_RANGE',
  SET_DEEP_LINK_ROUTE: 'SET_DEEP_LINK_ROUTE',
  SET_CURRENT_ACCOUNT: 'SET_CURRENT_ACCOUNT',
  SET_CURRENT_ROUTE: 'SET_CURRENT_ROUTE',
  SET_QR_CODE_MODAL: 'SET_QR_CODE_MODAL',
  SET_LEDGER: 'SET_LEDGER',
  SET_PAYPAL_URL: 'SET_PAYPAL_URL',
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_COMMENTS: 'SET_COMMENTS',
  SET_SEARCH_CHURCH: 'SET_SEARCH_CHURCH',
  SET_SEARCH_POST: 'SET_SEARCH_POST',
  SET_COUNTRY_CODE: 'SET_COUNTRY_CODE'
};

export const actions = {
  login: (user, token) => {
    console.log('=========TOKEN', user, token);
    return { type: types.LOGIN, user, token };
  },
  logout() {
    return { type: types.LOGOUT };
  },
  updateUser: user => {
    return { type: types.UPDATE_USER, user };
  },
  setTheme(theme) {
    return { type: types.SET_THEME, theme };
  },
  setLayer(layer) {
    return { type: types.SET_LAYER, layer };
  },
  setDeepLinkRoute(deepLinkRoute) {
    return { type: types.SET_DEEP_LINK_ROUTE, deepLinkRoute }
  },
  setCurrentAccount(acc) {
    return { type: types.SET_CURRENT_ACCOUNT, acc }
  },
  setCurrentRoute(route) {
    return { type: types.SET_CURRENT_ROUTE, route }
  },
  setQRCodeModal(isVisible) {
    return { type: types.SET_QR_CODE_MODAL, isVisible }
  },
  setLedger(ledger) {
    return { type: types.SET_LEDGER, ledger }
  },
  setPaypalUrl(paypalUrl) {
    return { type: types.SET_PAYPAL_URL, paypalUrl}
  },
  setLanguage(language) {
    return { type: types.SET_LANGUAGE, language}
  },
  setComments(comments) {
    return { type: types.SET_COMMENTS, comments }
  },
  setSearchChurch(searchChurch) {
    return { type: types.SET_SEARCH_CHURCH, searchChurch }
  },
  setSearchPost(searchPost) {
    return { type: types.SET_SEARCH_POST, searchPost }
  },
  setCountryCode(countryCode) {
    return { type: types.SET_COUNTRY_CODE, countryCode }
  }
};

const initialState = {
  token: null,
  user: null,
  theme: null,
  layer: null,
  deepLinkRoute: null,
  acc: null,
  route: null,
  isVisible: {
    isVisible: false
  },
  ledger: null,
  paypalUrl: null,
  language: null,
  comments: [],
  searchChurch: null,
  searchPost: null,
  countryCode: 'others'
};

storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(`${Helper.APP_NAME}${key}`, value);
  } catch (e) {
    // saving error
  }
};

const reducer = (state = initialState, action) => {
  const { type, user, token } = action;
  const { theme, layer } = action;
  const { acc } = action;
  const { ledger } = action;
  const { paypalUrl } = action;
  const { language } = action;
  const { comments } = action;
  const { searchChurch } = action;
  const { searchPost } = action;
  const { countryCode }  = action;
  switch (type) {
    case types.LOGOUT:
      AsyncStorage.clear();
      initialState['language'] = state.language;
      return Object.assign({}, initialState);
    case types.LOGIN:
      storeData('token', token);
      console.log('LOGIN', true);
      Data.setToken(token);
      return { ...state, user, token };
    case types.UPDATE_USER:
      return {
        ...state,
        user,
      };
    case types.SET_THEME:
      console.log('tertiary', theme);
      storeData('primary', theme.primary);
      storeData('secondary', theme.secondary);
      storeData('tertiary', theme.tertiary);
      storeData('fourth', theme.fourth);
      storeData('gradient', JSON.stringify(theme.gradient));
      Color.setPrimary(theme.primary);
      Color.setSecondary(theme.secondary);
      Color.setTertiary(theme.tertiary);
      Color.setFourth(theme.fourth);
      console.log('[THEME::]', theme.primary);
      if (theme.primary === '#4CCBA6') {
        Color.setGradient(['#8ae6cc', '#2bb58d', '#0ead7f'])
      } else if (theme.primary === '#FFCC00') {
        Color.setGradient(['#ffeb96', '#FFCC00', '#ffbb00'])
      } else if (theme.primary === '#F88BFF') {
        Color.setGradient(['#eb97f0', '#eb97f0', '#f22bff'])
      } else {
        Color.setGradient(['#9276E6', '#9276E6', '#5741D7'])
      }
      return {
        ...state,
        theme,
      };
    case types.SET_LAYER:
      return {
        ...state,
        layer,
      };
    case types.SET_CURRENT_ACCOUNT:
      return {
        ...state,
        acc
      }
    case types.SET_LEDGER:
      return {
        ...state,
        ledger
      }
    case types.SET_PAYPAL_URL:
      return {
        ...state,
        paypalUrl
      }
    case types.SET_LANGUAGE:
      return {
        ...state,
        language
      }
    case types.SET_COMMENTS:
      return {
        ...state,
        comments
      }
    case types.SET_SEARCH_CHURCH: 
      return {
        ...state,
        searchChurch
      }
    case types.SET_SEARCH_POST: 
      return {
        ...state,
        searchPost
      }
    case types.SET_COUNTRY_CODE:
      return {
        ...state,
        countryCode
      }
    default:
      return { ...state, nav: state.nav };
  }
};
export default reducer;