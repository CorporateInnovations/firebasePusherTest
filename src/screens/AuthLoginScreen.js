// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, StyleSheet, SafeAreaView, ImageBackground, Dimensions, Image, Alert, Animated, Easing, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation, NavigationEvents } from '@react-navigation/native';
// Google Analytics
// import firebase from '@react-native-firebase/app';
// import analytics from '@react-native-firebase/analytics'
// external imports
import LinearGradient from 'react-native-linear-gradient';
// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );
// https://lodash.com/
import _ from 'lodash';
// translations
import { _i } from '../Translations';
// styles
import { STYLES, VARS } from '../Styles';
// contexts
import { AuthContext } from '../context/AuthContext';
// local components
import LoadingModal from '../components/LoadingModal';
import ButtonBlock from '../components/ButtonBlock';
import AnimatedView from '../components/AnimatedView';
import HeadingGroup from '../components/HeadingGroup';
import GeneralModal from '../components/GeneralModal';
import FormPasscodeCheck from '../components/FormPasscodeCheck';

const DIMENSIONS = Dimensions.get('screen');

/**
 * AuthLoginScreen - the login screen
 */
class AuthLoginScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            submitInProgress: false,
            rotationValue: new Animated.Value(0),
            testActive: true,
            keyboardActive: false,
            imageLoadError: false,
            defaultImage: require('../../assets/images/rp_auth_background_coconut.png')
        };
    }

    _isMounted = false;

    _isLoading = false;

    _keyboardToggleTimeout;

    async successfulLoginEvent() {
        await analytics().logEvent('login_success');
    }

    async failedLoginEvent() {
        await analytics().logEvent('login_failed');
    }

    _keyboardWillShow = () => {

        if( this._keyboardToggleTimeout ) {
            clearTimeout( this._keyboardToggleTimeout );
        }

        if( this._isMounted ) {
            this.setState({ keyboardActive: true });
        }
    }

    _keyboardWillHide = () => {
        if( this._keyboardToggleTimeout ) {
            clearTimeout( this._keyboardToggleTimeout );
        }

        this._keyboardToggleTimeout = setTimeout(() => {
            if( this._isMounted ) {
                this.setState({ keyboardActive: false });
            }
        }, 100 );
    }

    _updateValue = ( key, value ) => {
        this.context.setValue( key, value );
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

    _login = () => {
        
        if( this._isMounted ) {
            this.setState({ submitInProgress: true });
        }

        this.context.manualLogin()
            .then( data => {
                this._grantAccess( data );
            })
            .catch(error => {
                this.failedLoginEvent();
                this._handleLoginError( error );
            })
            .finally(() => {
                if( this._isMounted ) {
                    this.setState({ submitInProgress: false });
                }
            });
    }

    _grantAccess = async authResponse => {

        try {

            if( authResponse.require2FA ) {
                // pass the user into 2FA if required
                this.props.navigation.navigate('login.security');
            } else {
                // user can be edirected into the app
                // this action will update the auth provider that is consumed in Routes and redirect the user into dashboard
                this.successfulLoginEvent();
                this.context.grantAccess();
                
            }
        
        } catch( error ) {
            failedLoginEvent();
            this._handleLoginError( error );
        }
    }

    _handleLoginError = error => {

        let heading = _i('Sorry!'),
            body = _i('There was an error logging you in');

        if( _.get( error, 'error', null ) == 'Unauthorized' ) {
            heading = _i('Whoops!');
            body = _i('Please check that you have entered your email and password correctly.');
        }

        console.warn( 'Login error', error );
        Alert.alert( heading, body );

    }

    _dismissAuthModal = () => {
        if( this._isMounted ) {
            this.setState({ authModalActive: false });
        }
    }

    closeModal = () => {
        this.setState({ testActive: false });
    }

    componentDidMount() {
        this._isMounted = true;
        this._startAnimation();

        this.keyboardWillShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            this._keyboardWillShow,
        );

        this.keyboardWillHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            this._keyboardWillHide,
        );

    }

    componentWillUnmount() {
        this._isMounted = false;

        this.keyboardWillShowListener.remove();
        this.keyboardWillHideListener.remove();
    }

    render() {

        /*
        source={ !this.state.keyboardActive ? ( !this.state.imageLoadError ? authImage : this.state.defaultImage ) : null }
        */

        const AnimatedIcon = Animated.createAnimatedComponent( Icon );

        let spinTransition = this.state.rotationValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        const { navigate } = this.props.navigation;

        if( this.state.submitInProgress ) {
            
        }

        return (
            <AuthContext.Consumer>{( authContext ) => {
                const {
                    renderFields,
                    authMethod,
                    authModalActive,
                    submitInProgress,
                    authImage
                } = authContext;

                if( submitInProgress ) {
                    return (
                        <LinearGradient colors={STYLES.gradients.purple} start={STYLES.gradients.top} end={STYLES.gradients.bottom} style={{ flex: 1 }}>
                            <SafeAreaView style={styles.loading_container}>
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
                }

                return (
                    <ImageBackground
                        defaultSource={ !this.state.keyboardActive ? this.state.defaultImage : null }
                        source={ !this.state.keyboardActive ? this.state.defaultImage : null }
                        resizeMode={"cover"}
                        style={{
                            flex: 1,
                            backgroundColor: !this.state.keyboardActive ? 'transparent' : STYLES.colors.pink.default
                        }}
                        imageStyle={{
                            resizeMode: "cover",
                            flex: 1,
                        }}
                        onError={ () => this.setState({ imageLoadError: true }) }
                    >
                        <SafeAreaView style={styles.container}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.container}
                        >
                            <AnimatedView
                                duration={400}
                                animationName={'fade-in-up'}
                                customStyle={{...STYLES.section, flex: 1, alignItems: 'center', alignItems: 'center', justifyContent: 'center' }}
                            >
                                {
                                    !this.state.keyboardActive &&
                                    <Image
                                        style={{}}
                                        source={ require('../../assets/images/rp_club_royal_plus_logo.png') }
                                    />
                                }
                            </AnimatedView>
                            <AnimatedView
                                duration={400}
                                animationName={'fade-in-down'}
                                customStyle={{...styles.section, justifyContent: 'flex-end' }}
                            >
                                { renderFields('login') }
                                <ButtonBlock
                                    color={'yellow'}
                                    label={ this.state.submitInProgress ? _i('Please wait') : _i('Sign in')}
                                    xAdjust={36}
                                    customStyle={{ marginBottom: 20 }}
                                    onPressEvent={ () => this._login() }
                                    disabled={this.state.submitInProgress}
                                />
                                <Text style={styles.text_body_light} onPress={ () => navigate( 'login.forgot_password' ) }>Forgot your password?</Text>
                                <Text style={styles.text_body_light}>Don't have an account? <Text style={styles.text_body_bold} onPress={ () => navigate( 'register', { screen: 'register.registration' } ) }>SIGN UP HERE</Text></Text>
                            </AnimatedView>

                            {
                                authMethod !== null &&
                                <GeneralModal
                                    active={ !submitInProgress && authModalActive }
                                    actions={ authMethod.actions }
                                >
                                    <HeadingGroup
                                        heading={ authMethod.heading }
                                        body={ authMethod.body }
                                        icon={ authMethod.icon }
                                        iconColor={STYLES.colors.navy.default}
                                        textColor={STYLES.colors.navy.default}
                                    />
                                    {
                                        authMethod.type === 'passcode' &&
                                        <FormPasscodeCheck />
                                    }
                                </GeneralModal>
                            }
                        </KeyboardAvoidingView>
                        </SafeAreaView>
                    </ImageBackground>
                );
            }}</AuthContext.Consumer>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        ...STYLES.container.default,
    },
    loading_container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    section: {
        ...STYLES.container.default,
        paddingLeft: VARS.spacer.large,
        paddingRight: VARS.spacer.large,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        ...STYLES.button.yellow.button,
        flex: 0,
        width: DIMENSIONS.width - ( 2 * VARS.spacer.large ),
    },
    button_text: STYLES.button.yellow.text,
    text_body_light: {
        ...STYLES.text.body_light,
        color: STYLES.colors.navy.default
    },
    text_body_bold: {
        ...STYLES.text.body_bold,
        color: STYLES.colors.navy.default
    }
});

AuthLoginScreen.contextType = AuthContext;

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <AuthLoginScreen {...props} navigation={navigation} />;
}