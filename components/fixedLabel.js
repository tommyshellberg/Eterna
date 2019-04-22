import React, { Component } from 'react'
import {Item, Input, Label, Icon } from 'native-base'
export default class FloatingLabelExample extends Component {
  render() {
    return (
            <Item fixedLabel error={this.props.error} success={!this.props.error}>
              <Label>{this.props.label}</Label>
              <Input 
                placeholder={this.props.placeholder}
                onChangeText={ (text) => this.props.handleTextUpdate(text, this.props.prop) }
                value={this.props.value}
              />
              { this.props.error ? <Icon name='close-circle' /> : <Icon name='checkmark-circle' /> }
            </Item>
    )
  }
}