import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Container, Content, Header, Button, Icon, Title, H1, H2, H3, Text} from 'native-base';
import AppTheme from './theme';

import {setConfigByKey} from './mongodb.js';

class Settings extends Component {
  constructor(props){
      super(props);
      this.state = {
      };
  }
  render() {
    return (
        <Container theme={AppTheme}>
            <Header>
                <Title>Settings</Title>
            </Header>
            <Content style={{backgroundColor: '#EFEFF4'}}>
                <View style={{marginTop: 30}}>
                    <H3 style={{color: '#6C6C6C', paddingLeft: 20}}>
                        Account Settings
                    </H3>
                    <TouchableOpacity activeOpacity={0.8} style={{backgroundColor: '#fff', marginTop: 5}}>
                        <View style={{paddingTop: 20, paddingBottom: 20, paddingLeft: 10, flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flex: 1, paddingLeft: 10}}>
                                <H3 style={{color: '#1D41D5', marginTop: -10, paddingLeft: 0, marginBottom: -8}}
                                        transparent> 
                                   Report a bug
                                </H3>
                            </View>
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={{backgroundColor: '#fff', marginTop: 5}}>
                        <View style={{paddingTop: 20, paddingBottom: 20, paddingLeft: 10, flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flex: 1, paddingLeft: 10}}>
                                <H3 style={{color: '#1D41D5', marginTop: -10, paddingLeft: 0, marginBottom: -8}}
                                        transparent> 
                                   Change password
                                </H3>
                            </View>
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={{backgroundColor: '#fff', marginTop: 5}} onPress={()=>{
                        setConfigByKey('user', null);
                        this.props.onLogout();
                    }}>
                        <View style={{paddingTop: 20, paddingBottom: 20, paddingLeft: 10, flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flex: 1, paddingLeft: 10}}>
                                <H3 style={{color: '#1D41D5', marginTop: -10, paddingLeft: 0, marginBottom: -8}}
                                        transparent> 
                                   Logout
                                </H3>
                            </View>
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

            </Content>
            {this.props.renderFooter()}
        </Container>
    );
  }
}

module.exports = Settings;