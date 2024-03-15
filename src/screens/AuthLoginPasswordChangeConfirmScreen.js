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
        };
    }

    _isMounted = false;

    _isLoading = false;

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
                                            heading={ _i('Password Changed')}
                                            body={ _i('Your password was changed successfully.\nPlease return back to the login page to log in.')}
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
                                        <ButtonBlock
                                            color={ this.state.saveInProgress ? 'disabled' : 'navy'}
                                            label={ this.state.saveInProgress ? _i('Saving...') : _i('Back to Sign In')}
                                            xAdjust={36}
                                            onPressEvent={ () => navigate('login.login') }
                                            disabled={this.state.saveInProgress}
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