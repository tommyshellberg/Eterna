import React, { Component } from 'react'
import {Item, Input, Label } from 'native-base'
export default class FloatingLabelExample extends Component {
  render() {
    return (
            <Item fixedLabel>
              <Label>{this.props.label}</Label>
              <Input 
                placeholder={this.props.placeholder}
                onChangeText={ (text) => this.props.handleTextUpdate(text, this.props.prop) }
                value={this.props.value}
              />
            </Item>
    )
  }
}