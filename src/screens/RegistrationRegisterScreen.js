// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, ScrollView, StyleSheet, SafeAreaView, Dimensions, Alert, KeyboardAvoidingView, Platform } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// Google Analytics
// import firebase from '@react-native-firebase/app';
// import analytics from '@react-native-firebase/analytics'

import _ from 'lodash';

import { RegistrationContext } from '../context/RegistrationContext';

import LinearGradient from 'react-native-linear-gradient';

import HeadingGroup from '../components/HeadingGroup';
import FormCheckboxInput from '../components/FormCheckboxInput';
import ButtonBlock from '../components/ButtonBlock';
import LoadingModal from '../components/LoadingModal';
import AnimatedView from '../components/AnimatedView';

import { _i } from '../Translations';

import { STYLES } from '../Styles';

const DIMENSIONS = Dimensions.get('screen');

class RegistrationRegisterScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            saveInProgress: false,
            inteletravelEmployee: false
        };
    }

    _isMounted = false;

    _isLoading = false;

    async registrationStartedEvent() {
        // await analytics().logEvent('registration_started');
    }

    async registrationFailedEvent() {
        // await analytics().logEvent('registration_failed');
    }

    _createAccount = () => {

        if( !this.context.isValid(['identity']) ) {
            // handle the error
            return;
        }

        this.setState({ saveInProgress: true });

        this.context.createAccount()
            .then( data => {
                this.registrationStartedEvent();
                this.props.navigation.navigate('regsiter.outcome');
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
    }

    _toggleInteletravel = async value => {
        await this.setState({ inteletravelEmployee: value });
        this.context.toggleInteletravel( value );
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
            <RegistrationContext.Consumer>{( registrationContext ) => {
                const { renderFields, isInteletravel, toggleInteletravel } = registrationContext;
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
                                            heading={ _i('Registration')}
                                            body={ _i('Please enter your work email address and your primary ABTA number associated to your place of work.')}
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
                                        <View style={styles.field}>
                                            <FormCheckboxInput
                                                value={isInteletravel}
                                                label={_i('I work for Inteletrravel')}
                                                labelColor={STYLES.colors.white}
                                                activeColor={STYLES.colors.yellow.default}
                                                activeIconColor={STYLES.colors.white}
                                                editable={true}
                                                updateValue={ value => toggleInteletravel( value )}
                                            />
                                        </View>
                                        { renderFields( 'identity' ) }
                                        <ButtonBlock
                                            color={'yellow'}
                                            label={_i('Start Registration')}
                                            customStyle={{ marginBottom: 20 }}
                                            xAdjust={36}
                                            onPressEvent={ () => this._createAccount() }
                                            disabled={this.state.saveInProgress}
                                        />
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
            }}</RegistrationContext.Consumer>
        );
    };

};

const styles = StyleSheet.create({
    field: {
        width: '100%',
        marginBottom: 24
    }
});

RegistrationRegisterScreen.contextType = RegistrationContext;

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <RegistrationRegisterScreen {...props} navigation={navigation} />;
}