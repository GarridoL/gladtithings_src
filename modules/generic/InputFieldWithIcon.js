import React, { Component } from 'react';
import { View, Text, TextInput, Dimensions} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Color, BasicStyles } from 'common';
import { connect } from 'react-redux';
const width = Math.round(Dimensions.get('window').width)
class TextInputWithIcon extends Component{
  
  constructor(props){
    super(props);
    this.state = {
      flag: false,
      input: null
    }
  }
  componentDidMount() {
    if(this.props.value) {
      this.setState({input: this.props.value})
    }
  }

  setInput(input){
    this.setState({
      input: input
    })
    this.props.onTyping(input)
  }

  render () {
    const { theme } = this.props.state;
    return (
      <View>
        {
          this.props.label && (
            <Text style={{
              ...this.props.labelStyle,
              fontFamily: this.props.profile ? 'Poppins-SemiBold' : 'normal',
              paddingTop: 20,
              paddingBottom: this.props.profile ? 10 : 20
            }}>{this.props.label} <Text style={{ color: 'red' }}>*</Text></Text>
          )
        }
        <View style={{
          flexDirection: 'row',
          ...BasicStyles.standardFormControl,
          ...this.props.style,
          alignItems: 'center',
          overflow: 'hidden'
          }}>
          <FontAwesomeIcon style={{
            marginLeft: 10,
            marginRight: 10
          }}
            icon={this.props.icon}
            size={20}
            color={Color.primary}
          />
          <TextInput
            onChangeText={(input) => this.setInput(input)}
            value={this.state.input}
            placeholder={this.props.placeholder}
            placeholderTextColor={'#d1d1d1'}
            editable={this.props.disable ? false : true}
            secureTextEntry={this.props.secureTextEntry ? this.props.secureTextEntry : false}
            style={{
              width: '80%',
              paddingRight: 5
            }}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => ({ state: state });
const mapDispatchToProps = dispatch => {
  const { actions } = require('@redux');
  return {};
}
export default connect(
  mapStateToProps,
  mapDispatchToProps)(TextInputWithIcon);