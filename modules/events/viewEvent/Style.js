import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width)
export default {
  ScrollView: {
    flex: 1
  },
  MainContainer: {
    flex: 1,
    backgroundColor: Color.containerBackground,
    zIndex: 0
  },
  footerIcon: {
    marginTop: Platform.OS == 'ios' ? 30 : 0
  },
  card: {
    backgroundColor: Color.white,
    borderWidth: 1,
    borderColor: Color.lightGray,
    padding: 20,
    borderRadius: 10,
    width: '90%'
  }
}