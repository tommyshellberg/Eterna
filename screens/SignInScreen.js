import React from 'react'
import { StyleSheet, ImageBackground } from 'react-native'
import { Button, Text, Card, CardItem, Input, Spinner, Container, Item, Label } from 'native-base'
import firebase from '@firebase/app'
import '@firebase/auth'

class LoginForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: 'thomas@shellberg.com',
            password: 'reallybigones',
            loading: false
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
    }

    onPasswordChange = (password) => {
        this.setState({password})
    }

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
            .then( () => {
                // TODO: handle the current user auth.
                //const { currentUser } = firebase.auth()
                //console.log( 'Current user: ' + currentUser )
                //firebase.database().ref('/users/')
                //.push(currentUser)
            })
            .catch( () => {
                alert('failed to sign in!')
                this.setState({loading: false})
            })
            
        // add Firebase login method here
        // Don't forget to set this.state.loading to true while doing actions. Inside of the then() function calls set loading to false
    }

    render() {
        //console.log(firebase.app())
        return(
            <ImageBackground source={require('../assets/images/sunbgimage.png')} style={{width: '100%', height: '100%'}} imageStye={{resizeMode: 'stretch'}}>
                <Container style={styles.container}>
                    <Card>
                        <CardItem>
                        <Item fixedLabel>
                            <Label>Email</Label>
                            <Input
                                placeholder="thomas@shellberg.com"
                                value={this.state.email}
                                onChangeText={email => this.onEmailChange(email)}
                                secure={false}
                            />
                        </Item>
                        </CardItem>

                        <CardItem>
                            <Item fixedLabel>
                                <Label>Password</Label>
                                <Input
                                    placeholder="reallybigones"
                                    value={this.state.password}
                                    onChangeText={password => this.onPasswordChange(password)}
                                    secure={true}
                                />
                            </Item>
                        </CardItem>
                    </Card>
                        { !this.props.loading && <Button block style={styles.button} onPress={this.onLoginPress}><Text>Login</Text></Button> }
                        { !this.props.loading && <Button block style={styles.button} onPress={this.onRegisterPress}><Text>Register</Text></Button> }
                        { !this.props.loading && <Button block style={styles.button} onPress={this.onResetPress}><Text>Forgot Password?</Text></Button> }
                        { this.props.loading && <Spinner color="blue"/> }
                </Container>
            </ImageBackground>
        )
    }
}

// TODO: add a splash screen background image.
// TODO: center the container on the screen
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    button: {
        marginTop: 20
    },
    errorText: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
  })

  export default LoginForm