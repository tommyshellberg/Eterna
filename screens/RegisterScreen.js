import React from 'react'
import { StyleSheet} from 'react-native'
import { Button, Text, Card, CardItem, Input, Spinner, Container, Item } from 'native-base'
import firebase from '@firebase/app'
import '@firebase/auth'
import * as yup from 'yup';
import {debounce} from 'lodash'

const emailSchema = yup.string().trim().min(5).max(50).email()
const passwordSchema = yup.string().min(7).max(30)

class RegisterForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            loading: false,
            isValidEmail: false,
            isValidPassword: false,
            disableSubmit: true
        }
    }

    onButtonPress = () => {
        const {email, password} = this.state
        this.createUser(email, password)
    }

    onEmailChange = (email) => {
        this.setState({ email })
        this.validateField( 'email', email )
    }

    onPasswordChange = (password) => {
        this.setState({password})
        this.validateField( 'password', password )
    }

    componentDidUpdate () {
        const {isValidEmail, isValidPassword, disableSubmit } = this.state
        if ( disableSubmit && isValidEmail && isValidPassword ) {
            this.setState({disableSubmit: false})
        }
    }

    validateField = debounce ((prop, text) => {
        switch(prop) {
        case 'email':
            emailSchema.isValid(text)
            .then( (valid) => this.setState({ isValidEmail: valid }))
            break
        case 'password':
            passwordSchema.isValid(text)
            .then( (valid) => this.setState({ isValidPassword: valid }))
            break
        default:
            break
        }
    }, 500)

    createUser(email, password) {
        this.setState({loading: true})

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then( () => {
                alert('Successfully registered!')
                })
                .then ( () => {
                    this.props.navigation.navigate( 'Login')
                    this.setState({loading: false})
                })
            .catch( (error) => {
                alert(error)
                this.setState({loading: false})
            })
    }

    render() {
        return(
            <Container>
                <Card>
                    <CardItem>
                        <Item fixedLabel error={ this.state.email.length >0 && !this.state.isValidEmail } success={ this.state.email.length >0 && this.state.isValidEmail}>
                            <Input 
                            label="Email"
                            placeholder="Email Address"
                            value={this.state.email}
                            onChangeText={email => this.onEmailChange(email)}
                            secureTextEntry={false}
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
                        <Item fixedLabel error={ this.state.password.length >0 && !this.state.isValidPassword } success={ this.state.password.length >0 && this.state.isValidPassword}>
                            <Input 
                                label="Password"
                                placeholder="Password"
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
                    { !this.state.loading && <Button style={styles.button} block disabled={this.state.disableSubmit} onPress={this.onButtonPress}><Text>Create Account</Text></Button> }
                    { this.state.loading && <Spinner color="blue"/> }
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    button: {
        backgroundColor: "#3F51B5"
    },
    errorText: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
  })

  export default RegisterForm