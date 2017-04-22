import React, { Component } from 'react';
import {View} from 'react-native';
import { Container, Content, Spinner } from 'native-base';
import AppTheme from './theme';

import Dashboard from './dashboard';
import Login from './login';

import { getConfigByKey } from './mongodb.js';

class App extends Component {
  constructor(props){
      super(props);
      getConfigByKey('user', (val)=>{
          if(val){
            this.setState({
                loading: false,
                loggedInUser: val,
                loggedIn: true
            });
          }
          else{
            this.setState({
                loading: false
            });
          }
      });
      this.state = {
          loading: true,
          loggedIn: false
      };
  }
  render() {
    if(this.state.loading){
        return(null);
    }
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
            <Dashboard user={this.state.loggedInUser} onLogout={()=>{
                this.setState({
                    loggedIn: false
                });
            }}/>
        );
    }
    else{
        return(
            <Login onLogin={(user)=>{
                this.setState({
                    loggedIn: true,
                    loggedInUser: user                  
                });
            }}/>
        );
    }
  }
}

module.exports = App;