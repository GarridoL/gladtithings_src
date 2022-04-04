import {createStackNavigator} from 'react-navigation-stack';
import Login from 'src/modules/account/Login';
import ForgotPassword from 'src/modules/account/ForgotPassword';
import Register from 'src/modules/account/Register';
import ViewProfileStack from 'src/modules/viewProfile/Drawer';
import ProfileStack from 'src/modules/profile/Drawer';
import Welcome from 'src/modules/account/Landing';
import CommunityStack from 'src/modules/community/Drawer';
import SubscriptionStack from 'src/modules/subscription/Drawer';
import MessagePageStack from 'src/modules/messagePage/Drawer';
import PrivacyStack from 'src/modules/privacy/Drawer';
import TermsAndConditionsStack from 'src/modules/termsAndConditions/Drawer';
import DisplayStack from 'src/modules/display/DisplayDrawer';
import AccountSettingStack from 'src/modules/accountSettings/Drawer';
import TransactionsStack from 'src/modules/transactions/Drawer';
import PageMessageStack from 'src/modules/messages/Drawer';
import DepositStack from 'src/modules/deposit/Drawer';
import OtpStack from 'src/modules/otpPage/Drawer';
import EditProfileStack from 'src/modules/editProfile/Drawer';
import NotificationSettingsStack from 'src/modules/notificationSettings/Drawer';
import ChurchProfileStack from 'src/modules/churchProfile/Drawer';
import ChurchesStack from 'src/modules/churches/Drawer';
import EventsStack from 'src/modules/events/Drawer';
import QRCodeScannerStack from 'modules/qrCodeScanner/qrCodeScannerDrawer.js';
import EwalletStack from 'src/modules/ewallet/Drawer';
import LanguageSettingsStack from 'src/modules/languageSettings/Drawer';
import Drawer from './Drawer';
import CreateCommunityStack from 'src/modules/community/createCommunityDrawer.js';
import PaymentStack from 'src/modules/payments/Drawer';
import PageStack from 'src/modules/community/page/Drawer'
import PageSettingStack from 'src/modules/community/setting/Drawer'
import PageAboutStack from 'src/modules/community/about/Drawer'
import PageRolesStack from 'src/modules/community/roles/Drawer'
import PageMembersStack from 'src/modules/community/members/Drawer'
import TransactionDetailsStack from 'src/modules/transactions/details/Drawer';
import MassesStack from 'src/modules/masses/Drawer';
import DirectCashInStack from 'src/modules/cashIn/direct/Drawer'
import PayPalStack from 'components/Payments/PayPal/Drawer'
import MethodsStack from 'src/modules/paymentMethods/Drawer';
import LedgerStack from 'src/modules/ledger/Drawer.js';
import CurrencyStack from 'src/modules/currency/CurrencyDrawer.js';
import StripeStack from 'components/Payments/Stripe/Drawer';
import GooglePayStack from 'components/Payments/GooglePay/Drawer';
import OtherTransactionStack from 'src/modules/deposit/Drawer';
import DashboardStack from 'src/modules/dashboard/Drawer';
import PaymentCardsStack from 'components/Payments/Cards/Drawer';
import AttendedEvents from 'src/modules/attendedEvents/Drawer';
import ViewEvent from 'src/modules/events/viewEvent/Drawer';
import AccountPosts from 'src/modules/accountPosts/Drawer';
import UnionBankStack from 'components/Payments/UnionBank/Drawer';
import PayMayaStack from 'components/Payments/PayMaya/Drawer';
import VisaStack from 'components/Payments/Visa/Drawer'

const WelcomeStack = createStackNavigator(
  {
    loginScreen: {screen: Welcome},
  },
  {
    headerMode: 'none',
    navigationOptions: {},
  },
);


// login stack
const LoginStack = createStackNavigator(
  {
    loginScreen: {screen: Login},
  },
  {
    headerMode: 'none',
    navigationOptions: {},
  },
);

// Forgot Password stack
const ForgotPasswordStack = createStackNavigator(
  {
    forgotPasswordScreen: {screen: ForgotPassword},
  },
  {
    headerMode: 'none',
    navigationOptions: {},
  },
);

// Forgot Password stack
const RegisterStack = createStackNavigator(
  {
    registerScreen: {screen: Register},
  },
  {
    headerMode: 'none',
    navigationOptions: {},
  },
);

// Manifest of possible screens
const PrimaryNav = createStackNavigator(
  {
    landingStack: {screen: WelcomeStack},
    loginStack: {screen: LoginStack},
    forgotPasswordStack: {screen: ForgotPasswordStack},
    registerStack: {screen: RegisterStack},
    drawerStack: {screen: Drawer},
    profileStack: {screen: ProfileStack},
    viewProfileStack: {screen: ViewProfileStack},
    communityStack: {screen: CommunityStack},
    subscriptionStack: {screen: SubscriptionStack},
    paymentStack: {screen: PaymentStack},
    messagePageStack: {screen: MessagePageStack},
    termsAndConditionStack: {screen: TermsAndConditionsStack},
    privacyStack: {screen: PrivacyStack},
    displayStack: {screen: DisplayStack},
    accountSettingsStack: { screen: AccountSettingStack},
    transactionsStack: {screen: TransactionsStack},
    pageMessageStack: { screen: PageMessageStack},
    // depositStack: { screen: DepositStack},
    withdrawStack: { screen: DepositStack},
    notificationSettingsStack: { screen: NotificationSettingsStack},
    otpStack: { screen: OtpStack },
    editProfileStack: { screen: EditProfileStack },
    churchProfileStack: { screen: ChurchProfileStack },
    churchesStack: { screen: ChurchesStack },
    eventsStack: { screen: EventsStack },
    qrCodeScannerStack: {screen: QRCodeScannerStack},
    ewalletStack: {screen: EwalletStack},
    createCommunityStack: { screen: CreateCommunityStack },
    languageSettingsStack: { screen: LanguageSettingsStack },
    pageStack: { screen: PageStack },
    pageSettingStack: { screen: PageSettingStack },
    pageAboutStack: { screen: PageAboutStack },
    pageRolesStack: { screen: PageRolesStack },
    pageMembersStack: { screen: PageMembersStack },
    transactionDetailsStack: { screen: TransactionDetailsStack },
    massesStack: { screen: MassesStack},
    directCashInStack: { screen: DirectCashInStack},
    paypalStack: { screen: PayPalStack},
    methodsStack: { screen: MethodsStack},
    ledgerStack: { screen: LedgerStack},
    currencyStack: { screen: CurrencyStack },
    stripeStack: { screen: StripeStack },
    googlePayStack: { screen: GooglePayStack },
    otherTransactionStack: { screen : OtherTransactionStack },
    dashboardStack : { screen : DashboardStack },
    paymentCardsStack: { screen: PaymentCardsStack},
    eventSettingsStack: { screen: AttendedEvents},
    viewEventStack: { screen: ViewEvent },
    accountPostsStack: { screen: AccountPosts },
    visaStack: { screen: VisaStack},
    unioBankStack: { screen: UnionBankStack},
    payMayaStack: {screen: PayMayaStack}
  },
  {
    // Default config for all screens
    headerMode: 'none',
    title: 'Main',
    initialRouteName: 'landingStack',
  },
);

export default PrimaryNav;
