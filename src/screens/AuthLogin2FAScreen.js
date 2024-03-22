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
import { isTimePassed } from '../Helpers';

import { STYLES } from '../Styles';
import { TouchableHighlight } from 'react-native-gesture-handler';

class AuthLoginForgotPasswordScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            submitInProgress: false
        };
    }

    _isMounted = false;

    _isLoading = false;

    _submitCode = () => {

        if( !this.context.isValid(['forgotEmail2FA']) ) {
            // handle the error
            return;
        }

        this.setState({ submitInProgress: true });

        this.context.submitCode2FA()
            .then( data => {
                if(isTimePassed(data.reset_token_expiration)) {
                    Alert.alert( 'Code Expired', 'The verification code has expired, please try again' );
                    return this.props.navigation.navigate('login.login');
                }
                if( data.success === true) {
                    Alert.alert( 'Code Verified', data.message );
                    this.props.navigation.navigate('login.change_password', data.data);
                } else {
                    Alert.alert( 'Code Not Recognised', 'The verification code was incorrect, please try again' );
                    this.setState({ submitInProgress: false });
                    return;
                }
                
            })
            .catch(error => {
                const message = _.get( error, 'message', 'Sorry, we were unable to process your Code at this point, please try again later.' );
                Alert.alert( 'Forgotten Password Error (Bridge)', message );
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
                                style={STYLES.container.default}
                            >
                            <ScrollView>
                                <View style={{...STYLES.container.default, flex: 1 }}>
                                    <View style={STYLES.section.large}>
                                        <HeadingGroup
                                            heading={ _i('Password Reset Code')}
                                            body={ _i('Check your email, we have sent you a password reset code so you can change your password.')}
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
                                    {renderFields('forgotEmail2FA')}
                                    <ButtonBlock
                                        color={'yellow'}
                                        label={_i('Submit')}
                                        customStyle={{ marginBottom: 20 }}
                                        xAdjust={36}
                                        onPressEvent={ () => this._submitCode() }
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