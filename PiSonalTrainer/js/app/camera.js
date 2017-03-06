'use strict';
import React, { Component } from 'react';
import { requireNativeComponent, View, StyleSheet } from 'react-native';
import { Button } from 'native-base';

const RNOpenCVNative = requireNativeComponent('NativeCV', RNOpenCV);

class RNOpenCV extends Component {
    constructor(props, state){
        super(props);
    }
    render() {
        return (
            <View>
                <View style={styles.buttonbar}>
                    <Button style={styles.button1}
                        onPress={()=>{
                            this.setState({
                                showCamera: false, showAddLog: true
                            })
                        }}>
                        Cancel
                    </Button>
                    <Button style={styles.button2}
                        onPress={()=>{
                            this.setState({
                                showCamera: false, showAddLog: true
                            });
                        }}>
                        Save and Quit
                    </Button>
                    <Button style={styles.button3}
                        onPress={()=>{
                            this.setState({

                            })
                        }}>
                        Reset
                    </Button>
                </View>
                <RNOpenCVNative {...this.props} />
            </View>
        );
    }
}

var styles = StyleSheet.create({
    buttonbar: {
        paddingTop:30,
        paddingBottom:10,
        justifyContent: 'space-around',
        flexDirection:'row',
        alignItems: 'center'
    },
    button1:{
        width: 80,
        backgroundColor: 'red'
    },
    button2:{
        width: 150,
        backgroundColor: 'green'
    },
    button3:{
        width: 80,
        backgroundColor: 'orange'
    }
});

module.exports = RNOpenCV;