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
          loggedIn: false
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