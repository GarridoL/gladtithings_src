import { faHome, faShieldAlt, faCopy, faCog, faUsers, faWallet, faHistory, faCreditCard } from '@fortawesome/free-solid-svg-icons';
import {English, Spanish} from 'src/modules/locales';
import Color from 'common/Color'
export default {
  company: 'Increment Technologies',
  APP_NAME: '@GLADTITHINGS_',
  APP_NAME_BASIC: 'GLADTITHINGS',
  APP_EMAIL: 'support@gladtithings.com',
  APP_WEBSITE: 'support@gladtithings.com',
  APP_HOST: 'com.gladtithings',
  pusher: {
    broadcast_type: 'pusher',
    channel: 'runway',
    notifications: 'App\\Events\\Notifications',
    orders: 'App\\Events\\Orders',
    typing: 'typing',
    messages: 'App\\Events\\Message',
    messageGroup: 'App\\Events\\MessageGroup',
    rider: 'App\\Events\\Rider',
  },
  DrawerMenu: [
    {
      title: 'Homepage',
      route: 'Homepage',
      icon: faHome,
      borderBottom: false,
      payload: 'drawer',
      currentPage: 'drawerStack'
    },
    {
      title: 'Communities',
      route: 'Community',
      icon: faUsers,
      borderBottom: false,
      payload: 'drawer',
      currentPage: 'Community'
    },
    {
      title: 'Wallet',
      route: 'Dashboard',
      icon: faWallet,
      borderBottom: false,
      payload: 'drawer',
      currentPage: 'Dashboard'
    },
    {
      title: 'Tithings',
      route: 'Donations',
      icon: faHistory,
      borderBottom: false,
      currentPage: 'Donations'
    },
    {
      title: 'Settings',
      route: 'Settings',
      icon: faCog,
      borderBottom: false,
      payload: 'drawer',
      currentPage: 'Settings'
    },
    {
      title: 'Deposit',
      route: 'directCashInStack',
      icon: faWallet,
      borderBottom: false,
      payload: 'drawerStack',
      currentPage: 'Deposit'
    },
    {
      title: 'Withdraw',
      route: 'directCashInStack',
      icon: faCreditCard,
      borderBottom: false,
      payload: 'drawerStack',
      currentPage: 'Deposit'
    }
  ],
  DrawerMenu1: [{
    title: 'Terms & Conditions',
    route: 'termsAndConditionStack',
    icon: faCopy,
    borderBottom: false
  },
  {
    title: 'Privacy Policy',
    route: 'privacyStack',
    icon: faShieldAlt,
    borderBottom: false
  }],
  tutorials: [],
  referral: {
    message:
      `Share the benefits of <<popular products>> with your friends and family. ` +
      `Give them ₱100 towards their first purchase when they confirm your invite. ` +
      `You’ll get ₱100 when they do!`,
    emailMessage: "I'd like to invite you on RunwayExpress!",
  },
  retrieveDataFlag: 1,
  validateEmail(email) {
    let reg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+.[a-zA-Z0-9]*$/;
    if (reg.test(email) === false) {
      return false;
    } else {
      return true;
    }
  },
  defaultLanguage: English,
  international: [],
  cashInMethods: [
  //   {
  //   title: 'VISA DIRECT',
  //   description: 'Accepts Credit / Debit Card',
  //   fees: 'Zero Fees',
  //   logo: require('assets/visa.png'),
  //   color: '#1A1F71',
  //   code: 'VISA',
  //   type: 'bank',
  //   currency: 'USD',
  //   country: 'International',
  //   feeConfiguration: {
  //     type: 'percentage',
  //     amount: 2
  //   }
  // },
  {
    title: 'PayPal',
    description: 'PayPal Authorized',
    fees: '3% Fee',
    logo: require('assets/paypal.png'),
    color: Color.gray,
    code: 'PAYPAL',
    type: 'ewallet',
    country: 'International',
    currency: 'USD',
    feeConfiguration: {
      type: 'percentage',
      amount: 3
    }
  }, {
    title: 'Credit Card / Debit Card',
    description: '0000-0000-0000-0000',
    fees: '3% Fee',
    logo: require('assets/stripe.png'),
    color: Color.primary,
    code: 'STRIPE',
    type: 'bank',
    country: 'International',
    currency: 'USD',
    feeConfiguration: {
      type: 'percentage',
      amount: 3
    }
  }, 
  {
    title: 'Google Pay',
    description: '0000-0000-0000-0000',
    fees: '3% Fee',
    logo: require('assets/gpay.png'),
    color: Color.primary,
    code: 'GOOGLEPAY',
    type: 'ewallet',
    country: 'International',
    currency: 'USD',
    feeConfiguration: {
      type: 'percentage',
      amount: 3
    }
  }
],
  checkStatus(user){
    if(user == null){
      return false
    }
    switch(user.status.toLowerCase()){
      case 'invalid_email': return -1; break;
      case 'not_verified': return 0;break
      case 'email_verified': return 1;break
      case 'account_verified': return 2; break;
      case 'basic_verified': return 3; break;
      case 'standard_verified': return 4; break;
      case 'business_verified': return 5; break;
      case 'enterprise_verified': return 6; break;
      default: return 7;break
    }
  },
  accountStatus(user){
    if(user == null){
      return false
    }
    switch(user.status.toLowerCase()){
      case 'not_verified': return 'Not Verified';break
      case 'verified': return 'Email Verified';break
      case 'email_verified': return 'Email Verified';break
      case 'account_verified': return 'Account Verified'; break;
      case 'basic_verified': return 'Basic Verified'; break;
      case 'standard_verified': return 'Standard Verified'; break;
      case 'business_verified': return 'Business Verified'; break;
      case 'enterprise_verified': return 'Enterprise Verified'; break;
      default: return 'Granted';break
    }
  },
  convertMaximum(maximum, currency){
    switch(currency.toLowerCase()){
      case 'php': return maximum;
      case 'usd': return maximum / 50;
      case 'euro': return parseInt(maximum / 60);
      case 'thb': return parseInt(maximum / 1.50);
    }
  },
  cycles:[{
    key: 1,
    label: 'Weekly'
  }, {
    key: 2,
    label: 'Twice a week'
  }, {
    key: 3,
    label: 'End of the month'
  }, {
    key: 4,
    label: 'Monthly'
  }, {
    key: 5,
    label: 'Quarterly'
  }, {
    key: 6,
    label: 'Semi-annually'
  }, {
    key: 7,
    label: 'Annually'
  }]
};
