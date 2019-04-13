import React from 'react'
import { StyleSheet} from 'react-native'
import { Button, Text, Card, CardItem, Input, Spinner, Container } from 'native-base'
import firebase from '@firebase/app'
import '@firebase/auth'

class RegisterForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            loading: false
        }
    }

    onButtonPress = () => {
        const {email, password} = this.state
        this.createUser(email, password)
    }

    onEmailChange = (email) => {
        this.setState({ email })
    }

    onPasswordChange = (password) => {
        this.setState({password})
    }

    createUser(email, password) {
        this.setState({loading: true})
        
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then( () => {
                alert('Successfully registered!')
                this.setState({loading: false})
                })
            .catch( () => {
                alert('Failed to register!')
                this.setState({loading: false})
            })
        // if successful we should also redirect to the Login page afterward. since it's going to be part of the same stack you can use this.props.navigation.
        // Don't forget to set this.state.loading to true while doing actions. Inside of the then() function calls set loading to false
    }

    render() {
        return(
            <Container>
                <Card>
                    <CardItem>
                    <Input 
                        label="Email"
                        placeholder="thomas@shellberg.com"
                        value={this.state.email}
                        onChangeText={email => this.onEmailChange(email)}
                        secure={false}
                    />
                    </CardItem>

                    <CardItem>
                        <Input 
                            label="Password"
                            placeholder="reallybigones"
                            value={this.state.password}
                            onChangeText={password => this.onPasswordChange(password)}
                            secure={true}
                        />
                    </CardItem>
                </Card>
                    { !this.props.loading && <Button block onPress={this.onButtonPress}><Text>Create Account</Text></Button> }
                    { this.props.loading && <Spinner color="blue"/> }
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    
    errorText: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
  })

  export default RegisterForm