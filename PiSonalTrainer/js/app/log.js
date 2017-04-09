'use strict';
import React, { Component } from 'react';
import { requireNativeComponent, View, Image, TouchableOpacity, StyleSheet, NativeModules, Dimensions } from 'react-native';
import { Container, Content, Header, Button, Icon, Title, H1, H2, H3, Text, Input, InputGroup} from 'native-base';

import AppTheme from './theme';

import {insertLog} from './mongodb.js';

import RNOpenCV from './camera';
const RNOpenCVNative = requireNativeComponent('NativeCV',null);
const CameraModule = NativeModules.CameraView;

var {height, width} = Dimensions.get('window');

class Log extends Component {
  constructor(props){
      super(props);
      this.state = {
          showAddLog: false,
          showCamera: false
      };
  }
  render() {
    if(this.state.showCamera) {
        return (
            <View>
                <View>
                    <RNOpenCV {...this.props} />
                </View>
                <View style={styles.buttonbar}>
                    <Button style={styles.button1}
                    onPress={()=>{
                        CameraModule.quit((error, reps) => {
                          if (error) {
                            console.error(error);
                          } else {
                            this.setState({
                                reps: 0,
                                showCamera: false,
                                showAddLog: true
                            });
                          }
                        });
                    }}>
                    Cancel
                    </Button>
                    <Button style={styles.button2}
                    onPress={()=>{
                        CameraModule.quit((error, reps) => {
                          if (error) {
                            console.error(error);
                          } else {
                            this.setState({
                                reps: reps,
                                showCamera: false,
                                showAddLog: true
                            });
                            console.log(this.state.reps.toString());
                          }});
                    }}>
                    Save and Quit
                    </Button>
                    <Button style={styles.button3}
                        onPress={()=>{
                            CameraModule.reset();
                        }}>
                        Reset
                    </Button>
                </View>
            </View>
        );
    }
    if(this.state.showAddLog){
        return (
            <Container theme={AppTheme}>
                <Header>
                    <Button transparent onPress={()=>{this.setState({showAddLog: false})}}>
                        <Icon name='angle-left' />
                        Back
                    </Button>
                    <Title>Add Log</Title>
                </Header>
                <Content style={{backgroundColor: '#EFEFF4'}}>
                    <View style={{padding: 20, justifyContent: 'center', alignItems: 'center'}}>
                        <H2 style={{color: '#606060'}}>
                            {this.state.muscleGroup}
                        </H2>
                        <H3 style={{color: '#6C6C6C'}}>
                            {this.state.exerciseType}
                        </H3>
                        <H3 style={{color: '#6C6C6C', paddingTop: 20, textAlign: 'center', fontSize: 14}}>
                            {this.state.date.toString()}
                        </H3>
                        <Button block style={{marginTop: 10, marginLeft: 20, marginRight: 20}} onPress={()=>{
                            this.setState({showCamera: true})
                            }}
                        > Use Camera </Button>
                        <H2 style={{color: '#6C6C6C', paddingTop: 20, textAlign: 'center', fontSize: 14}}>
                            OR enter stats
                        </H2>
                        <InputGroup borderType='rounded' style={{marginTop: 20}} >
                            <Icon name='user' style={{color:'#384850'}}/>
                            <Input autoCorrect={false} style={{textAlign: 'center', marginLeft: -20}} placeholder='Weight (lb)' onChangeText={(text) => {this.setState({weight: text})}}/>
                        </InputGroup>
                        <InputGroup borderType='rounded' style={{marginTop: 10}} >
                            <Icon name='user' style={{color:'#384850'}}/>
                            <Input autoCorrect={false} style={{textAlign: 'center', marginLeft: -20}} placeholder='Sets (eg. 3)' onChangeText={(text) => {this.setState({sets: text})}}/>
                        </InputGroup>
                        <InputGroup borderType='rounded' style={{marginTop: 10}} >
                            <Icon name='user' style={{color:'#384850'}}/>
                            <Input autoCorrect={false} style={{textAlign: 'center', marginLeft: -20}} placeholder='Reps (eg. 10)' onChangeText={(text) => {this.setState({reps: text})}}/>
                        </InputGroup>
                    </View>

                    <Button block style={{marginTop: 10, marginLeft: 20, marginRight: 20}}
                            onPress={()=>{
                                function isNormalInteger(str) {
                                    return /^\+?(0|[1-9]\d*)$/.test(str);
                                }
                                if(this.state.weight && this.state.reps && this.state.sets){
                                    if(isNormalInteger(this.state.weight) && isNormalInteger(this.state.reps) && isNormalInteger(this.state.sets)){
                                        insertLog({
                                            userid: this.props.user._id,
                                            muscleGroup: this.state.muscleGroup, 
                                            exerciseType: this.state.exerciseType, 
                                            date: this.state.date, 
                                            weight: parseInt(this.state.weight), 
                                            sets: parseInt(this.state.sets),
                                            reps: parseInt(this.state.reps)
                                        }, (doc) => {
                                            this.setState({
                                                showAddLog: false,
                                                muscleGroup: null,
                                                exerciseType: null,
                                                date: null,
                                                weight: null,
                                                sets: null,
                                                reps: null
                                            });
                                            alert('Excerise Logged!');
                                        });
                                    }
                                    else{
                                        alert('All fields are must be positive numeric value.');
                                    }
                                }
                                else{
                                    alert('All fields are required.');
                                }
                                // {muscleGroup: 'Biceps', exerciseType: 'Hammer Curls', date: '', weight: 2, sets: 3, reps: 10}
                            }}> Submit </Button>
                    
                </Content>
                {this.props.renderFooter()}
            </Container>
        );
    }
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
                    <TouchableOpacity activeOpacity={0.8} style={{backgroundColor: '#fff', marginTop: 5}} onPress={()=>{this.addLogFor('Biceps', 'Hammer Curls');}}>
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
                    <TouchableOpacity activeOpacity={0.8} style={{backgroundColor: '#fff', marginTop: 5}} onPress={()=>{this.addLogFor('Biceps', 'Barbell Curls ');}}>
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
                    <TouchableOpacity activeOpacity={0.8} style={{backgroundColor: '#fff', marginTop: 5}} onPress={()=>{this.addLogFor('Shoulders', 'Upright Cable Row');}}>
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
                    <TouchableOpacity activeOpacity={0.8} style={{backgroundColor: '#fff', marginTop: 5}} onPress={()=>{this.addLogFor('Shoulders', 'Front Barbell Raise');}}>
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
                    <TouchableOpacity activeOpacity={0.8} style={{backgroundColor: '#fff', marginTop: 5}} onPress={()=>{this.addLogFor('Shoulders', 'Cable Front Raise');}}>
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

                <Button block style={{marginTop: 30, marginLeft: 20, marginRight: 20}} onPress={()=>{alert('Feature Coming Soon!');}}> + Add New Workout </Button>
                
            </Content>
            {this.props.renderFooter()}
        </Container>
    );
  }
  addLogFor(muscleGroup, exerciseType){
      this.setState({
          muscleGroup,
          exerciseType,
          date: new Date(),
          showAddLog: true
      })
  }
}

var styles = StyleSheet.create({
    buttonbar: { paddingTop:height - 70, paddingBottom:10, justifyContent: 'space-around', flexDirection:'row', alignItems: 'center' },
    button1:{ width: 150, height: 70, backgroundColor: 'red' },
    button2:{ width: 150, height: 70, backgroundColor: 'green' },
    button3:{ width: 150, height: 70, backgroundColor: 'orange' }
});

module.exports = Log;