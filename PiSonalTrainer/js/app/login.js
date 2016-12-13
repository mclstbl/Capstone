import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Content, Button, Icon, H1, InputGroup, Input} from 'native-base';
import AppTheme from './theme';

import Signup from './signup';

class Login extends Component {
  constructor(props){
      super(props);
      this.state = {
          showSignupForm: false
      };
  }
  render() {
    if(this.state.showSignupForm){
        return(
            <Signup onBack={()=>{
                this.setState({
                    showSignupForm: false
                });
            }} />
        );
    }
    return (
        <Container theme={AppTheme}>
            <Content style={{backgroundColor: '#F7F6F6'}} 
                     contentContainerStyle={{flex: 1, paddingTop: 100, alignItems:'center', paddingLeft: 30, paddingRight: 30}}>
                <Image source={require('../../images/dumbbell.png')}/>
                <H1 style={{paddingBottom: 20}}>PiSonal Trainer</H1>
                <InputGroup borderType='rounded' style={{marginBottom: 20}} >
                    <Icon name='user' style={{color:'#384850'}}/>
                    <Input style={{textAlign: 'center', marginLeft: -20}} placeholder='Username or Email'/>
                </InputGroup>
                <InputGroup borderType='rounded' style={{marginBottom: 20}} >
                    <Icon name='lock' style={{color:'#384850'}}/>
                    <Input style={{textAlign: 'center', marginLeft: -20}} placeholder='Password' secureTextEntry/>
                </InputGroup>
                <Button primary block iconRight style={{marginBottom: 20}}
                        onPress={()=>{
                            this.props.onLogin();
                        }}>
                    Login
                    <Icon name='caret-right' />
                </Button>
                <Button textStyle={{color: '#1D41D5', textAlign: 'center', flex: 1}} transparent
                        onPress={()=>{
                            this.setState({
                                showSignupForm: true
                            });
                        }}> New? Register Now </Button>
            </Content>
        </Container>
    );
  }
}

module.exports = Login;