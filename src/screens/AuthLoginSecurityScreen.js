// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, StyleSheet, SafeAreaView, Dimensions, Alert, KeyboardAvoidingView, Platform } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation, useRoute } from '@react-navigation/native';
// Google Analytics
// import firebase from '@react-native-firebase/app';
// import analytics from '@react-native-firebase/analytics'

import { AuthContext } from '../context/AuthContext';

import LinearGradient from 'react-native-linear-gradient';

import HeadingGroup from '../components/HeadingGroup';
import ButtonBlock from '../components/ButtonBlock';
import LoadingModal from '../components/LoadingModal';
import AnimatedView from '../components/AnimatedView';

import { _i } from '../Translations';

import { STYLES } from '../Styles';

const DIMENSIONS = Dimensions.get('screen');

class AuthLoginSecurityScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            saveInProgress: false
        };
    }

    _isMounted = false;

    _isLoading = false;

    async successfulLoginEvent() {
        // await analytics().logEvent('login_success');
    }

    async failedLoginEvent() {
        // await analytics().logEvent('login_failed');
    }

    _requestSecurityCode = () => {

        this.context.requestSecurityCode()
            .then( data => {
            })
            .catch( error => {
                Alert.alert( _i('Sorry'), _i('There was an error sending your security code, please try again later'));
                console.error( 'requestSecurityCode error', error );
            });
    }

    _submitSecurityCode = () => {

        if( !this.context.isValid(['security']) ) {
            Alert.alert(_i('Whoops!'), _i('It looks like you have entered an invalid security code, please check and try again'));
            return;
        }

        if( this._isMounted ) {
            this.setState({ saveInProgress: true });
        }

        this.context.submitSecurityCode()
            .then( data => {
                this.successfulLoginEvent()
                this.context.grantAccess();
            })
            .catch( error => {
                this.failedLoginEvent()
                Alert.alert(_i('Error'), _i('There was an error verifying your security code, please try again'));
                this.props.navigation.navigate('login.login');
            })
            .finally(() => {
                if( this._isMouted ) {
                    this.setState({ saveInProgress: false });
                }
            });

    }

    componentDidMount() {

        this._isMounted = true;

        this.context.setCurrentRouteName( this.props.route.name );

        this._requestSecurityCode();

    }

    componentWillUnmount() {

        this._isMounted = false;

    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <AuthContext.Consumer>{( authContext ) => {
                const { renderFields } = authContext;

                return (
                    <LinearGradient colors={STYLES.gradients.pink} start={STYLES.gradients.top} end={STYLES.gradients.bottom} style={{ flex: 1 }}>
                        <SafeAreaView style={STYLES.container.default}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                style={STYLES.container.default}
                            >
                            <View style={STYLES.container.default}>
                                <View style={STYLES.section.large}>
                                    <HeadingGroup
                                        heading={ _i('Enter security code')}
                                        body={ _i('Check your email, we have sent you a security code to complete your login and it should arrrive in the next few minutes.')}
                                        textColor={ STYLES.colors.white }
                                    />
                                </View>
                            </View>
                            <AnimatedView
                                duration={400}
                                animationName={'fade-in-down'}
                                customStyle={STYLES.container.default}
                            >
                                <View style={STYLES.section.large}>
                                    { renderFields( 'security' ) }
                                    <ButtonBlock
                                        color={'yellow'}
                                        label={_i('Submit')}
                                        customStyle={{ marginBottom: 20 }}
                                        xAdjust={36}
                                        onPressEvent={ () => this._submitSecurityCode() }
                                        disabled={this.state.saveInProgress}
                                    />
                                    <ButtonBlock
                                        color={'navy'}
                                        label={_i('Re-Send Security Code')}
                                        xAdjust={36}
                                        onPressEvent={ () => this._requestSecurityCode() }
                                        disabled={this.state.saveInProgress}
                                    />
                                </View>
                            </AnimatedView>
                            <LoadingModal enabled={this.state.saveInProgress} />
                            </KeyboardAvoidingView>
                        </SafeAreaView>
                    </LinearGradient>
                );
            }}</AuthContext.Consumer>
        );
    };

};

const styles = StyleSheet.create({

});

AuthLoginSecurityScreen.contextType = AuthContext;

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();
    const route = useRoute();

    return <AuthLoginSecurityScreen {...props} navigation={navigation} route={route} />;
}