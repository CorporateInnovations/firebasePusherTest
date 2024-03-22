// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, ScrollView, StyleSheet, SafeAreaView, Dimensions, Alert, KeyboardAvoidingView, Platform } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';

import { AuthContext } from '../context/AuthContext';

import LinearGradient from 'react-native-linear-gradient';

import HeadingGroup from '../components/HeadingGroup';
import FormCheckboxInput from '../components/FormCheckboxInput';
import ButtonBlock from '../components/ButtonBlock';
import LoadingModal from '../components/LoadingModal';
import AnimatedView from '../components/AnimatedView';

import { _i } from '../Translations';

import { STYLES } from '../Styles';
import { TouchableHighlight } from 'react-native-gesture-handler';

class AuthLoginForgotPasswordScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            submitInProgress: false,
        };
    }

    _isMounted = false;

    _isLoading = false;

    _submitEmail = () => {

        if( !this.context.isValid(['forgotPasswordEmail']) ) {
            // handle the error
            // Alert.alert( 'Email Sent', data.message );
            return;
        }

        if( !this.context.compareFields(this.context.fields.forgotPasswordEmail.email.value, this.context.fields.forgotPasswordEmail.confirmEmail.value) ) {
            // handle the error
            Alert.alert( 'Email are different', 'The email addresses provided don\'t match. Please check and try again' );
            return;
        }

        this.setState({ submitInProgress: true });

        this.context.submitEmail2FA()
            .then( data => {
                if( data.success === true) {
                    Alert.alert( 'Email Sent', data.message );
                }
                this.props.navigation.navigate('login.forgot_password_2FA');
            })
            .catch(error => {
                const message = _.get( error, 'message', 'Sorry, we were unable to process your Email at this point, please try again later.' );
                Alert.alert( 'Forgotten Password Error (Bridge)', message );
                this.setState({ submitInProgress: false });
            })
            .finally(() => {
                if( this._isMounted ) {
                    this.setState({ saveInProgress: false });
                }
            });

    }

    componentDidMount() {

        this._isMounted = true;

    }

    componentWillUnmount() {

        this._isMounted = false;

    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <AuthContext.Consumer>{( authContext ) => {
                const {renderFields, isAuthenticated, toggleAuth } = authContext;

                return (
                    <LinearGradient colors={STYLES.gradients.pink} start={STYLES.gradients.top} end={STYLES.gradients.bottom} style={{ flex: 1 }}>
                        <SafeAreaView style={STYLES.container.default}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                style={STYLES.container.default}>
                                <ScrollView>
                                    <View style={{...STYLES.container.default, flex: 1 }}>
                                        <View style={STYLES.section.large}>
                                            <HeadingGroup
                                                heading={ _i('Forgotten Password')}
                                                body={ _i('Please fill out the details below and you\'ll receive an email with further instructions to reset your account')}
                                                textColor={ STYLES.colors.white }
                                            />
                                        </View>
                                    </View>
                                    <AnimatedView
                                        duration={400}
                                        animationName={'fade-in-down'}
                                        customStyle={{...STYLES.container.default, flex: 2 }}
                                    >
                                        <View style={STYLES.section.large}>
                                            {renderFields('forgotPasswordEmail')}
                                            <ButtonBlock
                                                color={this.state.submitInProgress ? 'disabled' : 'yellow'}
                                                label={ this.state.submitInProgress ? _i('Submitting...') : _i('Reset Password')}
                                                customStyle={{ marginBottom: 20 }}
                                                xAdjust={36}
                                                onPressEvent={ () => this._submitEmail() }
                                                disabled={this.state.submitInProgress}
                                            />
                                            <ButtonBlock
                                                color={ this.state.submitInProgress ? 'disabled' : 'navy'}
                                                label={_i('Back to Sign In')}
                                                xAdjust={36}
                                                onPressEvent={ () => navigate('login.login') }
                                                disabled={this.state.submitInProgress}
                                            />
                                        </View>
                                    </AnimatedView>
                                </ScrollView>
                            </KeyboardAvoidingView>
                        </SafeAreaView>
                    </LinearGradient>
                );
            }}</AuthContext.Consumer>
        );
    };

};

const styles = StyleSheet.create({
    field: {
        width: '100%',
        marginBottom: 24
    }
});

AuthLoginForgotPasswordScreen.contextType = AuthContext;

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <AuthLoginForgotPasswordScreen {...props} navigation={navigation} />;
}