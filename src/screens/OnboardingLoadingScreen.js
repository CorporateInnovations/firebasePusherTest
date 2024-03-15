// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, StyleSheet, Animated, Easing } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';

// external imports
import LinearGradient from 'react-native-linear-gradient';
// lodash
import _ from 'lodash';

// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

import { OnboardingContext } from '../context/OnboardingContext';

import LoadingModal from '../components/LoadingModal';

// local vars
import { STYLES } from '../Styles';

class OnboardingLoadingScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            isLoading: true,
            rotationValue: new Animated.Value(0),
        };
    }

    _isMounted = false;

    _isLoading = false;

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

    /**
     *
     */
     _launchOnboarding = async () => {

        const steps = await this.context.getOnboardingStatus();

        if( steps.length > 0 && !this.context.isOnboarded ) {
            let targetScreen = _.get( steps[0], 'screen', null );
            // theoretically not plausible, but we'll catch this just in case
            if( !targetScreen ) {
                console.warn('targetScreen was null in _launchOnboarding', steps );
                return;
            }

            this.props.navigation.navigate( targetScreen );
        }

    }

    componentDidMount() {

        this._isMounted = true;

        this._startAnimation();

        this._launchOnboarding();

    }

    componentWillUnmount() {

        this._isMounted = false;

    }

    render() {

        const AnimatedIcon = Animated.createAnimatedComponent( Icon );

        let spinTransition = this.state.rotationValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        return (
            <OnboardingContext.Consumer>{( onboardingContext ) => {
                const { totalSteps, renderFields, updateAccount } = onboardingContext;

                return (
                    <LinearGradient colors={STYLES.gradients.purple} start={STYLES.gradients.top} end={STYLES.gradients.bottom} style={{ flex: 1 }}>
                        <SafeAreaView style={styles.container}>
                            <AnimatedIcon
                                name={ 'rc-icon-loading' }
                                size={ 40 }
                                color={ STYLES.colors.white }
                                style={{
                                    transform: [{ rotate: spinTransition }]
                                }}
                            />
                        </SafeAreaView>
                    </LinearGradient>
                );
            }}</OnboardingContext.Consumer>
        );
    };

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

OnboardingLoadingScreen.contextType = OnboardingContext;

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <OnboardingLoadingScreen {...props} navigation={navigation} />;
}