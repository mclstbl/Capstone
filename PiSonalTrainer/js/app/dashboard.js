import React, { Component } from 'react';
import { Footer, FooterTab, Button, Icon } from 'native-base';

import Explorer from './explorer';
import Progress from './progress';
import Log from './log';
import Settings from './settings';

class Dashboard extends Component {
  constructor(props){
      super(props);
      this.state = {
          activeTab: 0
      };
  }
  render() {
    switch(this.state.activeTab){
        case 0:
            return (<Explorer renderFooter={()=>this.renderFooter()}/>);
        case 1:
            return (<Progress renderFooter={()=>this.renderFooter()}/>);
        case 2:
            return (<Log renderFooter={()=>this.renderFooter()}/>);
        case 3:
            return (<Settings renderFooter={()=>this.renderFooter()} onLogout={()=>this.props.onLogout()}/>);
        default:
            return (null);
    }
  }
  renderFooter(){
      return(
        <Footer>
            <FooterTab>
                <Button onPress={() => this.pressTab(0)}
                        active={this.state.activeTab == 0}>
                    Explorer
                    <Icon name='user' />
                </Button>
                <Button onPress={() => this.pressTab(1)}
                        active={this.state.activeTab == 1}>
                    Progress
                    <Icon name='bar-chart' />
                </Button>
                <Button onPress={() => this.pressTab(2)}
                        active={this.state.activeTab == 2}>
                    Log
                    <Icon name='plus-square-o' />
                </Button>
                <Button onPress={() => this.pressTab(3)}
                        active={this.state.activeTab == 3}>
                    Settings
                    <Icon name='cog' />
                </Button>
            </FooterTab>
        </Footer>
      );
  }
  pressTab(index){
      this.setState({
          activeTab: index
      });
  }
}

module.exports = Dashboard;