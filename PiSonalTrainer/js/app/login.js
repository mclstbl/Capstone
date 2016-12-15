import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Content, Button, Icon, H1, InputGroup, Input} from 'native-base';
import AppTheme from './theme';

import Signup from './signup';

import {getUser} from './mongodb.js';

class Login extends Component {
  constructor(props){
      super(props);
      this.state = {
          showSignupForm: false,
          username: '',
          password: ''
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
                    <Input autoCorrect={false} style={{textAlign: 'center', marginLeft: -20}} placeholder='Username or Email' onChangeText={(text) => {this.setState({username: text})}}/>
                </InputGroup>
                <InputGroup borderType='rounded' style={{marginBottom: 20}} >
                    <Icon name='lock' style={{color:'#384850'}}/>
                    <Input autoCorrect={false} style={{textAlign: 'center', marginLeft: -20}} placeholder='Password' onChangeText={(text) => {this.setState({password: text})}} secureTextEntry/>
                </InputGroup>
                <Button primary block iconRight style={{marginBottom: 20}}
                        onPress={()=>{
                            getUser(this.state, (doc)=>{
                                if(doc){
                                    this.props.onLogin(doc);
                                }
                                else{
                                    alert('Incorrect username/email or password');
                                }
                            });
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