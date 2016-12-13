import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Content, Button, Icon, H1, InputGroup, Input} from 'native-base';
import AppTheme from './theme';

class Signup extends Component {
  render() {
    return (
        <Container theme={AppTheme}>
            <Content style={{backgroundColor: '#F7F6F6'}} 
                     contentContainerStyle={{flex: 1, paddingTop: 50, alignItems:'center', paddingLeft: 30, paddingRight: 30}}>
                <Image source={require('../../images/dumbbell.png')}/>
                <H1 style={{paddingBottom: 20}}>PiSonal Trainer</H1>
                <InputGroup borderType='rounded' style={{marginBottom: 20}} >
                    <Icon name='user' style={{color:'#384850'}}/>
                    <Input style={{textAlign: 'center', marginLeft: -20}} placeholder='Full Name'/>
                </InputGroup>
                <InputGroup borderType='rounded' style={{marginBottom: 20}} >
                    <Icon name='user' style={{color:'#384850'}}/>
                    <Input style={{textAlign: 'center', marginLeft: -20}} placeholder='Username'/>
                </InputGroup>
                <InputGroup borderType='rounded' style={{marginBottom: 20}} >
                    <Icon name='user' style={{color:'#384850'}}/>
                    <Input style={{textAlign: 'center', marginLeft: -20}} placeholder='Email'/>
                </InputGroup>
                <InputGroup borderType='rounded' style={{marginBottom: 20}} >
                    <Icon name='lock' style={{color:'#384850'}}/>
                    <Input style={{textAlign: 'center', marginLeft: -20}} placeholder='Password' secureTextEntry/>
                </InputGroup>
                <InputGroup borderType='rounded' style={{marginBottom: 20}} >
                    <Icon name='lock' style={{color:'#384850'}}/>
                    <Input style={{textAlign: 'center', marginLeft: -20}} placeholder='Confirm Password' secureTextEntry/>
                </InputGroup>
                <Button primary block iconRight style={{marginBottom: 20}}>
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