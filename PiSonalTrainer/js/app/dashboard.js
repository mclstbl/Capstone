import React, { Component } from 'react';
import { Container, Content, Footer, FooterTab, Button, Icon } from 'native-base';
import AppTheme from './theme';

class Dashboard extends Component {
  render() {
    return (
        <Container theme={AppTheme}>
            <Content />
            <Footer >
                <FooterTab>
                    <Button>
                        Explorer
                        <Icon name='user' />
                    </Button>
                    <Button>
                        Progress
                        <Icon name='bar-chart' />
                    </Button>
                    <Button active>
                        Log
                        <Icon name='plus-square-o' />
                    </Button>
                    <Button>
                        Settings
                        <Icon name='cog' />
                    </Button>
                </FooterTab>
            </Footer>
        </Container>
    );
  }
}

module.exports = Dashboard;