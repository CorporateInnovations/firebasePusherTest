/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { StyleSheet, View, Animated, Easing } from 'react-native';

// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

import { STYLES, VARS } from '../Styles';

/*******************************************************************************
 * LoadingSpinner Class
 ******************************************************************************/
export default class LoadingSpinner extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            rotationValue: new Animated.Value(0),
        };
    }

    _startAnimation = () => {

        this.state.rotationValue.setValue(0);

        Animated.timing(
            this.state.rotationValue,
            {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
            .start(() => {
                this._startAnimation();
            });

    }

    componentDidMount() {
        this._startAnimation();
    }

    render() {

        const AnimatedIcon = Animated.createAnimatedComponent( Icon );

        let spinTransition = this.state.rotationValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        return (
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: VARS.spacer.large,
                paddingBottom: VARS.spacer.large,
            }}>                    
                <AnimatedIcon
                    name={ 'rc-icon-loading' }
                    size={ this.props.size || 40 }
                    color={ this.props.color || STYLES.colors.navy.default }
                    style={{
                        transform: [{ rotate: spinTransition }]
                    }}
                />
        </View>
        );
    }
}

const styles = StyleSheet.create({

});
