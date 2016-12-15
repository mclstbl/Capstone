import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Dimensions  } from 'react-native';
import { Container, Content, Header, Button, Icon, Title, H1, H2, H3, Text, List, ListItem} from 'native-base';
import AppTheme from './theme';

import SegmentedControlTab from 'react-native-segmented-control-tab';
import {StockLine} from 'react-native-pathjs-charts';
import sampleData from './sampleData';

class Progress extends Component {
  constructor(props){
      super(props);
      this.state = {
          selectedWeeksIndex: 0,
          selectedMusclesIndex: 0,
          selectedViewModeIndex: 0
      };
  }
  render() {
    return (
        <Container theme={AppTheme}>
            <Header>
                <Title>Progress</Title>
            </Header>
            <Content style={{backgroundColor: '#EFEFF4', padding: 20, paddingBottom: 40,}}>
                <View>
                    <SegmentedControlTab 
                        selectedIndex={this.state.selectedWeeksIndex}
                        tabStyle={{ borderColor: '#1D41D5' }}
                        tabTextStyle={{color: '#1D41D5'}}
                        activeTabStyle={{ backgroundColor: '#1D41D5' }}
                        values={['1W', '2W', '5W', '13W', '26W']}
                        onPress= {index => this.setState({selectedWeeksIndex:index})}
                    />
                </View>
                <View style={{marginTop: 10}}>
                    <SegmentedControlTab 
                        selectedIndex={this.state.selectedMusclesIndex}
                        tabStyle={{ borderColor: '#1D41D5' }}
                        tabTextStyle={{color: '#1D41D5'}}
                        activeTabStyle={{ backgroundColor: '#1D41D5' }}
                        values={['Bi', 'Tri', 'Chest', 'Back', 'Legs', 'All']}
                        onPress= {index => this.setState({selectedMusclesIndex:index})}
                    />
                </View>
                <View style={{
                    paddingTop: 20,
                    paddingRight: 20,
                    paddingLeft: 30,
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    flex: 1
                }}>
                    <H3 style={{paddingBottom: 20, color: '#606060'}}>Weight/Reps Ratio</H3>
                    <StockLine
                        data={sampleData.stockLine.data}
                        options={{
                            width: Dimensions.get('window').width-40,
                            height: 250,
                            color: '#1D41D5',
                            margin: {
                                top: 10,
                                left: 15,
                                bottom: 10,
                                right: 10
                            },
                            animate: {
                                type: 'delayed',
                                duration: 200
                            },
                            axisX: {
                                showAxis: true,
                                showLines: true,
                                showLabels: false,
                                showTicks: false,
                                zeroAxis: false,
                                orient: 'bottom',
                                tickValues: [],
                                label: {
                                    fontFamily: 'Arial',
                                    fontSize: 8,
                                    fontWeight: true,
                                    fill: '#34495E'
                                }
                            },
                            axisY: {
                                showAxis: true,
                                showLines: true,
                                showLabels: true,
                                showTicks: false,
                                zeroAxis: false,
                                orient: 'left',
                                tickValues: [],
                                label: {
                                    fontFamily: 'Arial',
                                    fontSize: 8,
                                    fontWeight: true,
                                    fill: '#34495E'
                                }
                            }
                        }}
                        xKey='x'
                        yKey='y' />
                </View>
                <View style={{marginTop: 10}}>
                    <SegmentedControlTab 
                        selectedIndex={this.state.selectedViewModeIndex}
                        tabStyle={{ borderColor: '#1D41D5' }}
                        tabTextStyle={{color: '#1D41D5'}}
                        activeTabStyle={{ backgroundColor: '#1D41D5' }}
                        values={['Daily', 'Weekly']}
                        onPress= {index => this.setState({selectedViewModeIndex:index})}
                    />
                </View>
                <View>
                    <List>
                        <ListItem >
                            <Text>Day 1</Text>
                            <Text style={{flex: 1, textAlign: 'right'}}>11.3</Text>
                        </ListItem>
                        <ListItem>
                            <Text>Day 2</Text>
                            <Text style={{flex: 1, textAlign: 'right'}}>13.5</Text>
                        </ListItem>
                        <ListItem>
                            <Text>Day 3</Text>
                            <Text style={{flex: 1, textAlign: 'right'}}>14.5</Text>
                        </ListItem>
                    </List>
                </View>
            </Content>
            {this.props.renderFooter()}
        </Container>
    );
  }
}

module.exports = Progress;