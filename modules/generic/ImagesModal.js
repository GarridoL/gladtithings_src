import React, { Component } from 'react';
import { View, Image, ScrollView } from 'react-native';
import { Dimensions } from 'react-native';
import Config from 'src/config';
import { Color } from 'common';
import RBSheet from 'react-native-raw-bottom-sheet';

const width = Math.round(Dimensions.get('window').width);
const height = Math.round(Dimensions.get('window').height);
class ImageModal extends Component {
  constructor(props) {
    super(props);
  }

  openBottomSheet = () => {
    this.RBSheet.open()
  }

  render() {
    const { images } = this.props;
    console
    return (
      <RBSheet
        ref={ref => {
          this.RBSheet = ref;
        }}
        closeOnDragDown={true}
        dragFromTopOnly={true}
        closeOnPressMask={false}
        height={height}
      >
        <ScrollView>
          <View style={{
            marginBottom: 100,
            backgroundColor: Color.gray
          }}>
          {images.length > 0 && images.map((item, index) => {
            return (
              <Image
                source={{ uri: Config.BACKEND_URL + item.category }}
                style={{
                  width: width,
                  height: 300,
                  resizeMode: 'stretch',
                  borderColor: Color.white,
                  borderWidth: 1
                }}
              />
            )
          })}
          </View>
        </ScrollView>
      </RBSheet>
    );
  }
}

export default ImageModal