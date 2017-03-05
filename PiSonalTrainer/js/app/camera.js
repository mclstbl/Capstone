'use strict';
import React, { Component } from 'react';
import { requireNativeComponent, Stylesheet } from 'react-native';

const RNOpenCVNative = requireNativeComponent('NativeCV', RNOpenCV);

class RNOpenCV extends Component {
    constructor(props){
    super(props);
    }
    render() {
        return <RNOpenCVNative {...this.props} />;
    }
}

module.exports = RNOpenCV;