import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Content, Button, Icon, H1, InputGroup, Input} from 'native-base';
import AppTheme from './theme';

import {insertUser} from './mongodb.js';

class Signup extends Component {
  constructor(props){
      super(props);
      this.state = {
          name: '',
          username: '',
          password: '',
          email: ''
      };
  }
  render() {
    return (
        <Container theme={AppTheme}>
            <Content style={{backgroundColor: '#F7F6F6'}} 
                     contentContainerStyle={{flex: 1, paddingTop: 50, alignItems:'center', paddingLeft: 30, paddingRight: 30}}>
                <Image source={require('../../images/dumbbell.png')}/>
                <H1 style={{paddingBottom: 20}}>PiSonal Trainer</H1>
                <InputGroup borderType='rounded' style={{marginBottom: 20}} >
                    <Icon name='user' style={{color:'#384850'}}/>
                    <Input style={{textAlign: 'center', marginLeft: -20}} placeholder='Full Name' onChangeText={(text) => {this.setState({name: text})}}/>
                </InputGroup>
                <InputGroup borderType='rounded' style={{marginBottom: 20}} >
                    <Icon name='user' style={{color:'#384850'}}/>
                    <Input style={{textAlign: 'center', marginLeft: -20}} placeholder='Username' onChangeText={(text) => {this.setState({username: text})}}/>
                </InputGroup>
                <InputGroup borderType='rounded' style={{marginBottom: 20}} >
                    <Icon name='user' style={{color:'#384850'}}/>
                    <Input style={{textAlign: 'center', marginLeft: -20}} placeholder='Email' onChangeText={(text) => {this.setState({email: text})}}/>
                </InputGroup>
                <InputGroup borderType='rounded' style={{marginBottom: 20}} >
                    <Icon name='lock' style={{color:'#384850'}}/>
                    <Input style={{textAlign: 'center', marginLeft: -20}} placeholder='Password' secureTextEntry onChangeText={(text) => {this.setState({password: text})}}/>
                </InputGroup>
                <Button primary block iconRight style={{marginBottom: 20}}
                    onPress={()=>{
                        if(this.state.username != ''
                            && this.state.email != ''
                            && this.state.name != ''
                            && this.state.password != '' ){
                            insertUser(this.state, (doc)=>{
                                alert('Account created! You may login.');
                                this.props.onBack();
                            });
                        }
                        else{
                            alert('All fields required');
                        }
                        
                    }}>
                    Register
                    <Icon name='caret-right' />
                </Button>
                <Button onPress={()=>{
                            this.props.onBack();
                        }}
                        textStyle={{color: '#1D41D5', textAlign: 'center', flex: 1}} transparent> Go Back </Button>
            </Content>
        </Container>
    );
  }
}

module.exports = Signup;