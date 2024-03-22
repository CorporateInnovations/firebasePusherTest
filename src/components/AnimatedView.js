/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { Animated, Easing } from 'react-native';

import { STYLES } from '../Styles';

/*******************************************************************************
 * AnimatedView Class
 ******************************************************************************/
export default class AnimatedView extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            duration: this.props.duration ?? 1000,
            //opacityAnimation: this.props.animationName.includes('fade') ? new Animated.Value(0) : 1,
            //translateYAnimation: this.props.animationName.includes('up') ? new Animated.Value(30) : 0,
            opacityAnimation: this._getStartStyle('opacityAnimation'),
            translateYAnimation: this._getStartStyle('translateYAnimation'),
        };

        console
    }

    _getStartStyle = key => {

        let style;
        
        switch( key ) {
            case 'opacityAnimation':
                style = this.props.animationName.includes('fade') ? new Animated.Value(0) : 1;
                break;
            case 'translateYAnimation':
                if( this.props.animationName.includes('down') ) {
                    style = new Animated.Value(-30);
                } else if( this.props.animationName.includes('up') ) {
                    style = new Animated.Value(30);
                } else {
                    style = 0;
                }
                break;
            default:
        }

        return style;
    }

    _fadeIn = () => {
        Animated.timing( this.state.opacityAnimation, {
            toValue: 1,
            duration: this.state.duration,
            useNativeDriver: true
        }).start();
    }

    _slideUp = () => {
        Animated.timing( this.state.translateYAnimation, {
            toValue: 0,
            duration: this.state.duration,
            useNativeDriver: true
        }).start();
    }

    _slideDown = () => {
        Animated.timing( this.state.translateYAnimation, {
            toValue: 0,
            duration: this.state.duration,
            useNativeDriver: true
        }).start();
    }

    _runAmimation = () => {

        switch( this.props.animationName ) {
            case 'fade-in-up':
                this._slideUp();
                this._fadeIn();
            case 'fade-in-down':
                this._slideDown();
                this._fadeIn();
            case 'fade-in':
            default:
                this._fadeIn();
        }
    }

    componentDidMount() {
        
        this._runAmimation();
        
    }

    render() {

        return (
            <Animated.View
                style={{
                    ...this.props.customStyle,
                    opacity: this.state.opacityAnimation,
                    transform: [{ translateY: this.state.translateYAnimation }]
                }}>
                {this.props.children}
            </Animated.View>
        );
    }
}
