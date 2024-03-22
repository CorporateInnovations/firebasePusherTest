// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { SafeAreaView, Animated, StyleSheet, Easing } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// external imports
import LinearGradient from 'react-native-linear-gradient';
// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );
// context
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
// local vars
import { STYLES } from '../Styles';

export default class MainLoadingScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
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

    _handleRejection( promise ) {
        return promise.catch( error => {
            console.warn('promise erorr', error );
            return error;
        });
    }

    _loadingPromises = ( ...ps ) => {
        return Promise.all( ps.map( this._handleRejection ) );
    }

    /**
     * runs when this screen mounts
     */
    _init = async () => {

        // run all the init promsises together to save on load time
        this._loadingPromises(
            this.context.getProfile(),
            this.context.getPhoenixUser(),
            this.context.getAccountDetails())
            .then( results => {
                this.props.navigation.navigate('main.tabs');
            });
        // navigate to the main tabs view
    }

    componentDidMount() {

        this._isMounted = true;

        this._startAnimation();

        this._init();

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
            <AuthContext.Consumer>{( authContext ) => {
                return (
                    <UserContext.Consumer>{( userContext ) => {
                        const { isAuthenticated, toggleAuth } = authContext;
                        const { user } = userContext;

                        return (
                            <LinearGradient colors={STYLES.gradients.purple} start={STYLES.gradients.top} end={STYLES.gradients.bottom} style={{ flex: 1 }}>
                                <SafeAreaView style={styles.container}>
                                    <AnimatedIcon
                                        name={ 'rc-icon-loading' }
                                        size={ 60 }
                                        color={ STYLES.colors.white }
                                        style={{
                                            transform: [{ rotate: spinTransition }]
                                        }}
                                    />
                                </SafeAreaView>
                            </LinearGradient>
                        );
                    }}</UserContext.Consumer>
                );
            }}</AuthContext.Consumer>
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

MainLoadingScreen.contextType = UserContext;