import React, { Component } from 'react';
import { View, Image, TouchableOpacity, Dimensions  } from 'react-native';
import { Container, Content, Header, Button, Icon, Title, H1, H2, H3, Text, List, ListItem} from 'native-base';
import AppTheme from './theme';

import SegmentedControlTab from 'react-native-segmented-control-tab';
import {StockLine} from 'react-native-pathjs-charts';
import sampleData from './sampleData';

import {getLog} from './mongodb.js';

const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const muscleGroupValues = ['Biceps', 'Shoulders', 'Chest', 'All'];

class Progress extends Component {
  constructor(props){
      super(props);
      this.state = {
          selectedWeeksIndex: 0,
          selectedMusclesIndex: 0,
          selectedViewModeIndex: 0,
          rows: [],
          data: null
      };
  }
  componentDidMount(){
      this.getLog(muscleGroupValues[0]);
  }
  getLog(muscleGroup){
      getLog(muscleGroup, this.props.user._id, (docs) => {
          var reps = [];
          var sets = [];
          for(var i = 0; i < docs.length; i++){
            var row = docs[i];
            reps.push({
                "x": i,
                "y": row.reps
            });
            sets.push({
                "x": i,
                "y": row.sets
            });
          }
        //   data = [
        //     [{
        //         "x": 0,
        //         "y": 10
        //     }, {
        //         "x": 1,
        //         "y": 11
        //     }, {
        //         "x": 2,
        //         "y": 13
        //     }, {
        //         "x": 3,
        //         "y": 12
        //     }, {
        //         "x": 4,
        //         "y": 15
        //     }, {
        //         "x": 5,
        //         "y": 11
        //     }, {
        //         "x": 6,
        //         "y": 16
        //     }, {
        //         "x": 7,
        //         "y": 11
        //     }, {
        //         "x": 8,
        //         "y": 13
        //     }, {
        //         "x": 9,
        //         "y": 11
        //     }, {
        //         "x": 10,
        //         "y": 15
        //     }, {
        //         "x": 11,
        //         "y": 12
        //     }, {
        //         "x": 12,
        //         "y": 17
        //     }, {
        //         "x": 13,
        //         "y": 16
        //     }, {
        //         "x": 14,
        //         "y": 12
        //     }, {
        //         "x": 15,
        //         "y": 11
        //     }, {
        //         "x": 16,
        //         "y": 11
        //     }, {
        //         "x": 17,
        //         "y": 15
        //     }, {
        //         "x": 18,
        //         "y": 13
        //     }]
        // ];
        //   alert(JSON.stringify(data));
          this.setState({
              rows: docs,
              data: reps.length > 0 ? [reps, sets] : null
          });
      });
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
                        values={muscleGroupValues}
                        onTabPress= {(index) => {
                            this.getLog(muscleGroupValues[index]);
                            // this.setState({selectedMusclesIndex:index});
                        }}
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
                    {
                        this.state.data ?
                        <H3 style={{paddingBottom: 20, color: '#606060'}}>Weight/Reps Ratio</H3>
                        :
                        null
                    }
                    {
                        this.state.data ?
                        <StockLine
                        data={this.state.data}
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
                    :
                    null

                    }
                    
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
                        {(this.state.rows.length == 0) ? <Text style={{textAlign: 'center', padding: 20}}>No Entries Found</Text> : null}
                        {
                            this.state.rows.map((row, index) => 
                            <ListItem >
                                <Text>{months[row.month]} {row.date}, {row.year}</Text>
                                <Text style={{flex: 1, textAlign: 'right'}}>{Math.round((row.weight/(row.sets*row.reps)) * 100) / 100} Weight/Reps</Text>
                            </ListItem>
                            )
                        }
                    </List>
                </View>
            </Content>
            {this.props.renderFooter()}
        </Container>
    );
  }
}

module.exports = Progress;