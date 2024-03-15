// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Alert, Linking, KeyboardAvoidingView, Platform } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// Google Analytics
// import firebase from '@react-native-firebase/app';
// import analytics from '@react-native-firebase/analytics'
// lodash
import _ from 'lodash';

// context
import { RegistrationContext } from '../context/RegistrationContext';

// external imports
import LinearGradient from 'react-native-linear-gradient';

// local components
import HeadingGroup from '../components/HeadingGroup';
import ProgressStepper from '../components/ProgressStepper';
import ButtonBlock from '../components/ButtonBlock';
import LoadingModal from '../components/LoadingModal';
import FormSwitchInput from '../components/FormSwitchInput';
import ContentTerms from '../components/ContentTerms';

// helpers
// https://github.com/react-native-linear-gradient/react-native-linear-gradient
import { _i } from '../Translations';

// styles
import { STYLES, VARS } from '../Styles';

class RegistrationTermsScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            agreeTerms: false,
            agreeCookies: false,
            saveInProgress: false
        };
    }

    _isMounted = false;

    _isLoading = false;

    async registrationCompleteEvent() {
        // await analytics().logEvent('registration_completed');
    }

    async registrationFailedEvent() {
        // await analytics().logEvent('registration_failed');
    }

    componentDidMount() {

        this._isMounted = true;

    }

    componentWillUnmount() {

        this._isMounted = false;

    }

    _saveStep = () => {

        if( !this.state.agreeTerms ) {
            Alert.alert(_i('Agree Terms'), _i('To complete your Club Royal rergsitration you must agree to the terms and conditions'));
            return;
        }

        this.setState({ saveInProgress: true });

        this.context.agreeTerms()
            .then(data => {
                this.registrationCompleteEvent();
                this.props.navigation.navigate('app', { screen: 'login.login' });
            })
            .catch(error => {
                this.registrationFailedEvent();
                const message = _.get( error, 'message', 'Sorry, we were unable to process your registration at this point, please try again later.' );
                Alert.alert( 'Registration Error (Phoenix)', message );
            })
            .finally(() => {
                if( this._isMounted ) {
                    this.setState({ saveInProgress: false });
                }
            });
    };

    render() {

        const { navigate } = this.props.navigation;

        return (
            <RegistrationContext.Consumer>{( registrationContext ) => {
                const { totalSteps } = registrationContext;
                return (
                    <LinearGradient colors={STYLES.gradients.purple} start={STYLES.gradients.top} end={STYLES.gradients.bottom} style={{ flex: 1 }}>
                        <SafeAreaView style={{...STYLES.container.default, position: 'relative' }}>
                            <ScrollView>
                                <KeyboardAvoidingView
                                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                    style={STYLES.container.default}
                                >
                                <ProgressStepper step={5} total={totalSteps} />
                                <View style={STYLES.section.large}>
                                    <HeadingGroup
                                        heading={ _i('Terms & Conditions')}
                                        body={_i('To complete your account please agree to the terms & conditions and cookie policy.')}
                                        textColor={ STYLES.colors.white }
                                    />
                                </View>
                                <ContentTerms />
                                </KeyboardAvoidingView>
                            </ScrollView>
                            <View style={styles.fixed_footer}>
                                <FormSwitchInput
                                    label={_i('I agree to the terms & conditions')}
                                    value={ this.state.agreeTerms }
                                    onValueChange={ newValue => this.setState({ agreeTerms: newValue })}
                                />
                                <FormSwitchInput
                                    label={_i('I agree to the cookie policy')}
                                    value={ this.state.agreeCookies }
                                    onValueChange={ newValue => this.setState({ agreeCookies: newValue })}
                                />
                                <ButtonBlock
                                    color={ ( !this.state.agreeTerms || !this.state.agreeCookies ) ? 'disabled' : 'yellow' }
                                    label={_i('Complete')}
                                    xAdjust={36}
                                    onPressEvent={ () => this._saveStep() }
                                    disabled={this.state.saveInProgress || !this.state.agreeTerms || !this.state.agreeCookies }
                                />
                            </View>
                            <LoadingModal enabled={this.state.saveInProgress} />
                        </SafeAreaView>
                    </LinearGradient>
                );
            }}</RegistrationContext.Consumer>
        );
    };

};

RegistrationTermsScreen.contextType = RegistrationContext;

const styles = StyleSheet.create({
    fixed_footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: VARS.spacer.large,
        backgroundColor: STYLES.colors.white
    }
});

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <RegistrationTermsScreen {...props} navigation={navigation} />;
}