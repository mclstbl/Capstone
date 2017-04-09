'use strict';
import React, { Component } from 'react';
import { requireNativeComponent, View, StyleSheet } from 'react-native';

const RNOpenCVNative = requireNativeComponent('NativeCV', RNOpenCV);

class RNOpenCV extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <View style={styles.camera}>
                <RNOpenCVNative {...this.props} />
            </View>
        );
    }
}

module.exports = RNOpenCV;

var styles = StyleSheet.create({
    camera: { position: 'absolute', top: 0, left: 0}
});