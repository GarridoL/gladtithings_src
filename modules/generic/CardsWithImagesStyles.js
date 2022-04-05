import { Color } from 'common';
import { Dimensions } from 'react-native';
const width = Math.round(Dimensions.get('window').width);
export default {
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
    borderRadius: 5
  },
  textInImageView: {
    position: 'absolute',
    bottom: 0,
    padding: 7
  },
  address: {
    width: '85%',
    fontSize: 10
  },
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  textInImage: {
    color: Color.white,
    fontSize: 13
  },
  imageView: {
    height: '70%'
  },
  default: {
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.white,
    borderRadius: 5
  },
  container: {
    width: width,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10
  },
  view: {
    height: 250,
    width: '50%',
    padding: 10
  },
  view1: {
    height: 200,
    width: '50%',
    padding: 10
  },
  defaultFeatured: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: '31%',
    marginRight: '3%',
    borderRadius: 5,
    backgroundColor: Color.white,
  },
  textShadow: {
    color: Color.white,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  }
};