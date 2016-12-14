import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Container, Content, Header, Button, Icon, Title, H1, H2, H3, Text} from 'native-base';
import AppTheme from './theme';

class Log extends Component {
  constructor(props){
      super(props);
      this.state = {
      };
  }
  render() {
    return (
        <Container theme={AppTheme}>
            <Header>
                <Title>Log</Title>
            </Header>
            <Content style={{backgroundColor: '#EFEFF4'}}>
                <View style={{padding: 20, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                    <H2 style={{color: '#606060'}}>
                        Your Workout
                    </H2>
                </View>
                <View>
                    <H3 style={{color: '#6C6C6C', paddingLeft: 20}}>
                        Biceps
                    </H3>
                    <TouchableOpacity activeOpacity={0.8} style={{backgroundColor: '#fff', marginTop: 5}}>
                        <View style={{padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flex: 1, paddingLeft: 10}}>
                                <H3 style={{color: '#1D41D5', marginTop: -10, paddingLeft: 0, marginBottom: -8}}
                                        transparent> 
                                        Hammer Curls 
                                </H3>
                            </View>
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                                <Icon name='angle-right' style={{color: '#1D41D5'}} />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={{backgroundColor: '#fff', marginTop: 5}}>
                        <View style={{padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flex: 1, paddingLeft: 10}}>
                                <H3 style={{color: '#1D41D5', marginTop: -10, paddingLeft: 0, marginBottom: -8}}
                                        transparent> 
                                        Barbell Curls 
                                </H3>
                            </View>
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                                <Icon name='angle-right' style={{color: '#1D41D5'}} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                 <View style={{marginTop: 30}}>
                    <H3 style={{color: '#6C6C6C', paddingLeft: 20}}>
                        Shoulders
                    </H3>
                    <TouchableOpacity activeOpacity={0.8} style={{backgroundColor: '#fff', marginTop: 5}}>
                        <View style={{padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flex: 1, paddingLeft: 10}}>
                                <H3 style={{color: '#1D41D5', marginTop: -10, paddingLeft: 0, marginBottom: -8}}
                                        transparent> 
                                    Upright Cable Row
                                </H3>
                            </View>
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                                <Icon name='angle-right' style={{color: '#1D41D5'}} />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={{backgroundColor: '#fff', marginTop: 5}}>
                        <View style={{padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flex: 1, paddingLeft: 10}}>
                                <H3 style={{color: '#1D41D5', marginTop: -10, paddingLeft: 0, marginBottom: -8}}
                                        transparent> 
                                   Front Barbell Raise
                                </H3>
                            </View>
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                                <Icon name='angle-right' style={{color: '#1D41D5'}} />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.8} style={{backgroundColor: '#fff', marginTop: 5}}>
                        <View style={{padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{flex: 1, paddingLeft: 10}}>
                                <H3 style={{color: '#1D41D5', marginTop: -10, paddingLeft: 0, marginBottom: -8}}
                                        transparent> 
                                   Cable Front Raise
                                </H3>
                            </View>
                            <View style={{flex: 1, alignItems: 'flex-end'}}>
                                <Icon name='angle-right' style={{color: '#1D41D5'}} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                <Button block style={{marginTop: 30, marginLeft: 20, marginRight: 20}}> + Add New Workout </Button>
                
            </Content>
            {this.props.renderFooter()}
        </Container>
    );
  }
}

module.exports = Log;