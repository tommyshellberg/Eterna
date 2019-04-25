import React, { Component } from 'react'
import {Item, Input, Label, Icon } from 'native-base'
export default class FloatingLabelExample extends Component {
  render() {
    return (
            <Item fixedLabel error={this.props.value.length >0 && this.props.error} success={ this.props.value.length >0 && !this.props.error}>
              <Label>{this.props.label}</Label>
              <Input 
                placeholder={this.props.placeholder}
                onChangeText={ (text) => this.props.handleTextUpdate(text, this.props.prop) }
                value={this.props.value}
                autoCapitalize={this.props.autoCapitalize}
                autoCorrect={this.props.autoCorrect}
                keyboardType={this.props.keyboardType}
                textContentType={this.props.textContentType}
              />
              { 
                this.props.value.length >0 ? this.props.error ? <Icon name='close-circle' /> : <Icon name='checkmark-circle'/> :null
             }
            </Item>
    )
  }
}