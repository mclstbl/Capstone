import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Container, Content, Header, Button, Icon, Title, H1, H2, H3, Text} from 'native-base';
import AppTheme from './theme';

class Explorer extends Component {
  constructor(props){
      super(props);
      this.state = {
      };
  }
  render() {
    return (
        <Container theme={AppTheme}>
            <Header>
                <Title>Explorer</Title>
            </Header>
            <Content style={{backgroundColor: '#EFEFF4'}}>
                <View style={{padding: 20, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                    <Image source={require('../../images/defaultuser.png')}
                        style={{width: 80, height: 80}}/>
                    <H2 style={{paddingLeft: 10, color: '#606060'}}>
                        {this.props.user.name}
                    </H2>
                </View>
                <View style={{backgroundColor: '#fff', padding: 20}}>
                    <H3 style={{color: '#6C6C6C'}}>
                        Suggested Workouts
                    </H3>
                    <TouchableOpacity activeOpacity={0.4} onPress={()=>{alert('Feature Coming Soon!');}}>
                        <View style={{paddingTop: 10, flexDirection: 'row'}}>
                            <View>
                                <Image source={require('../../images/manlunges.png')}
                                    style={{width: 80, height: 80}}/>
                            </View>
                            <View style={{flex: 1, paddingLeft: 10}}>
                                <Button textStyle={{color: '#1D41D5', flex: 1}} 
                                        style={{marginTop: -10, paddingLeft: 0, marginBottom: -8}}
                                        transparent> 
                                        Lunges 
                                </Button>
                                <Text style={{fontSize: 13, color: '#6C6C6C'}}>
                                    Leg Muscles
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <Button block style={{marginTop: 15}} onPress={()=>{alert('Feature Coming Soon!');}}> View more workouts </Button>
                </View>

                <View style={{backgroundColor: '#fff', padding: 20, marginTop: 20}}>
                    <H3 style={{color: '#6C6C6C'}}>
                        Suggested Diet Plans
                    </H3>
                    <TouchableOpacity activeOpacity={0.4} onPress={()=>{alert('Feature Coming Soon!');}}>
                        <View style={{paddingTop: 10, flexDirection: 'row'}}>
                            <View>
                                <Image source={require('../../images/salad.png')}
                                    style={{width: 80, height: 80}}/>
                            </View>
                            <View style={{flex: 1, paddingLeft: 10}}>
                                <Button textStyle={{color: '#1D41D5', flex: 1}} 
                                        style={{marginTop: -10, paddingLeft: 0, marginBottom: -8}}
                                        transparent> 
                                        Salad 
                                </Button>
                                <Text style={{fontSize: 13, color: '#6C6C6C'}}>
                                    400 Calories
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <Button block style={{marginTop: 15}} onPress={()=>{alert('Feature Coming Soon!');}}> View more diet plans </Button>
                </View>
                
            </Content>
            {this.props.renderFooter()}
        </Container>
    );
  }
}

module.exports = Explorer;