import React, { Component } from 'react';
import {View} from 'react-native';
import { Container, Content, Spinner } from 'native-base';
import AppTheme from './theme';

import Dashboard from './dashboard';
import Login from './login';
 
class App extends Component {
  constructor(props){
      super(props);
      this.state = {
          loggedIn: true
      };
  }
  render() {
    if(this.state.loggedIn == null){
        return(
            <Container theme={AppTheme}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Spinner/>
                </View>
            </Container>
        )
    }
    if(this.state.loggedIn){
        return (
            <Dashboard />
        );
    }
    else{
        return(
            <Login onLogin={()=>{
                this.setState({
                    loggedIn: true                    
                });
            }}/>
        );
    }
  }
}

module.exports = App;