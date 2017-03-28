'use strict';
import React, { Component } from 'react';
import { requireNativeComponent, View } from 'react-native';

const RNOpenCVNative = requireNativeComponent('NativeCV', RNOpenCV);

class RNOpenCV extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <View>
                <RNOpenCVNative {...this.props} />
            </View>
        );
    }
}

module.exports = RNOpenCV;