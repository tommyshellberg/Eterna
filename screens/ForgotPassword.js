import React from 'react'
import { StyleSheet} from 'react-native'
import { Button, Text, Card, CardItem, Input, Spinner, Container } from 'native-base'
import firebase from '@firebase/app'
import '@firebase/auth'

class ResetForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            email: ''
        }
    }

    onButtonPress = () => {
        const {email} = this.state
        this.resetUser(email)
    }

    onEmailChange = (email) => {
        this.setState({ email })
    }

    onPasswordChange = (password) => {
        this.setState({password})
    }

    resetUser(email) {
        this.setState({loading: true})
        
        firebase.auth().sendPasswordResetEmail(email)
            .then( () => {
                alert('Password reset sent!')
                this.setState({loading: false})
                })
                .then ( () => {
                    this.props.navigation.navigate("Login")
                })
            .catch( () => {
                alert('Password reset failed to send!')
                this.setState({loading: false})
            })
    }

    render() {
        return(
            <Container>
                <Card>
                    <CardItem>
                    <Input 
                        label="Email"
                        placeholder="email@gmail.com"
                        value={this.state.email}
                        onChangeText={email => this.onEmailChange(email)}
                        secure={false}
                    />
                    </CardItem>
                </Card>
                    { !this.props.loading && <Button style={styles.button} block onPress={this.onButtonPress}><Text>Send Password Reset Email</Text></Button> }
                    { this.props.loading && <Spinner color="blue"/> }
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    button: {
        marginTop: 20,
        backgroundColor: "#3F51B5",
        color: '#fff'
    },

    errorText: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    }
  })

  export default ResetForm