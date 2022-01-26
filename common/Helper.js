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
      route: 'depositStack',
      icon: faWallet,
      borderBottom: false,
      payload: 'drawerStack',
      currentPage: 'Deposit'
    },
    {
      title: 'Withdraw',
      route: 'depositStack',
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
  cashInMethods: [{
    title: 'Unionbank of the Philippines',
    description: 'Unionbank Authorized',
    fees: 'Zero Fees',
    type: 'bank',
    logo: require('assets/union.png'),
    color: '#FFA300',
    code: 'UBP',
    country: 'Philippines',
    currency: 'PHP',
    feeConfiguration: {
      type: 'fixed',
      amount: 10
    }
  }, 
  // {
  //   title: 'GCASH',
  //   description: 'GCash Authorized',
  //   fees: 'Zero Fees',
  //   logo: require('assets/gcash.png'),
  //   color: '#297bfa',
  //   type: 'ewallet',
  //   code: 'GCASH',
  //   country: 'Philippines',
  //   feeConfiguration: {
  //     type: 'fixed',
  //     amount: 0,
  //     currency: 'PHP'
  //   }
  // }, 
  {
    title: 'PayMaya',
    description: 'PayMaya Authorized',
    fees: 'Zero Fees',
    logo: require('assets/paymaya.png'),
    color: Color.success,
    code: 'PAYMAYA',
    type: 'ewallet',
    country: 'Philippines',
    currency: 'PHP',
    feeConfiguration: {
      type: 'percentage',
      amount: 3
    }
  }, {
    title: 'VISA DIRECT',
    description: 'Accepts Credit / Debit Card',
    fees: 'Zero Fees',
    logo: require('assets/visa.png'),
    color: '#1A1F71',
    code: 'VISA',
    type: 'bank',
    currency: 'USD',
    country: 'International',
    feeConfiguration: {
      type: 'percentage',
      amount: 2
    }
  },
  // {
  //   title: 'GrabPay',
  //   description: 'GrabPay Wallet',
  //   fees: 'Fees Apply',
  //   logo: require('assets/grabpay.png'),
  //   color: Color.success,
  //   code: 'GRABPAY',
  //   country: 'International',
  //   feeConfiguration: {
  //     type: 'fixed',
  //     amount: 10,
  //     currency: 'PHP'
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
      amount: 4
    }
  }, {
    title: 'Stripe CC / DC',
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
      amount: 4
    }
  }],
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
};
