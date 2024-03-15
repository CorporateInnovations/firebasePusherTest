/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { StyleSheet, Modal, View, Animated, Easing } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

import AnimatedView from '../components/AnimatedView';

import { STYLES } from '../Styles';

/*******************************************************************************
 * LoadingModal Class
 ******************************************************************************/
export default class LoadingModal extends React.Component {

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
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.enabled}
            >
                <View style={styles.modal_backdrop}>                    
                    <AnimatedView
                        duration={400}
                        animationName={'fade-in-up'}
                        customStyle={styles.modal_panel}
                    >
                        <AnimatedIcon
                            name={ 'rc-icon-loading' }
                            size={ 60 }
                            color={ STYLES.colors.white }
                            style={{
                                transform: [{ rotate: spinTransition }]
                            }}
                        />
                    </AnimatedView>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modal_backdrop: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)'
    },
    modal_panel: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        width: 150,
        height: 150,
        borderRadius: 4,
        backgroundColor: 'transparent'
        //backgroundColor: 'rgba(255, 255, 255, 0.8)'
    }
});
