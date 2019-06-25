import React from 'react'
import firebase from '@firebase/app'
import '@firebase/auth'
import * as yup from 'yup';
import {debounce} from 'lodash'

import { StyleSheet, ImageBackground, View } from 'react-native'
import { Button, Text, Card, CardItem, Input, Spinner, Container, Item, Label } from 'native-base'

const emailSchema = yup.string().trim().min(5).max(50).email()

class LoginForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            loading: false,
            isValidEmail: false
        }
    }

    onRegisterPress = () => {
        this.props.navigation.navigate("Register")
    }

    onLoginPress = () => {
        const {email, password} = this.state
        this.loginUser(email, password)
    }

    onEmailChange = (email) => {
        this.setState({ email })
        this.validateField( 'email', email )
    }

    onPasswordChange = (password) => {
        this.setState({password})
    }

    validateField = debounce ((prop, text) => {
        switch(prop) {
        case 'email':
            emailSchema.isValid(text)
            .then( (valid) => this.setState({ isValidEmail: valid }))
            break
        default:
            break
        }
    }, 500)

    onResetPress= () => {
        this.props.navigation.navigate('Reset')
    }

    loginUser (email, password) {
        this.setState({loading: true})
        
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then( () => {
                alert('successfully signed in!')
                this.setState({loading: false})
                this.props.navigation.navigate('Main')
                })
            .catch( () => {
                alert('failed to sign in!')
                this.setState({loading: false})
            })
    }

    render() {
        return(
            <ImageBackground source={require('../assets/images/sunbgimage.png')} style={styles.bgImage}>
                <View style={styles.container}>
                    <Card>
                        <CardItem>
                        <Item fixedLabel error={ this.state.email.length >0 && !this.state.isValidEmail } success={ this.state.email.length >0 && this.state.isValidEmail} >
                            <Label>Email</Label>
                            <Input
                                placeholder="name@email.com"
                                value={this.state.email}
                                onChangeText={email => this.onEmailChange(email)}
                                secure={false}
                                autoCapitalize='none'
                                autoCorrect={false}
                                autoFocus={true}
                                keyboardType="email-address"
                                maxLength={50}
                                textContentType="emailAddress"
                            />
                        </Item>
                        </CardItem>

                        <CardItem>
                            <Item fixedLabel>
                                <Label>Password</Label>
                                <Input
                                    placeholder=""
                                    value={this.state.password}
                                    onChangeText={password => this.onPasswordChange(password)}
                                    secureTextEntry={true}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    textContentType="password"
                                />
                            </Item>
                        </CardItem>
                    </Card>
                        { !this.props.loading && <Button  block style={styles.button} onPress={this.onLoginPress}><Text>Login</Text></Button> }
                        { !this.props.loading && <Button  block style={styles.button} onPress={this.onRegisterPress}><Text>Register</Text></Button> }
                        { !this.props.loading && <Button  block style={styles.button} onPress={this.onResetPress}><Text>Forgot Password?</Text></Button> }
                        { this.props.loading && <Spinner color="blue"/> }
                </View>
            </ImageBackground>
        )
    }
}
  
export default LoginForm

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'center',
        //backgroundColor: '#fff'
    },
    button: {
        marginTop: 20,
        backgroundColor: "#3F51B5",
        color: '#fff'
    },
    bgImage: {
        width: '100%', 
        height: '100%', 
        flex: 1
    },
    errorText: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
  })