// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
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
import LoadingSpinner from '../components/LoadingSpinner';
import LoadMeta from '../components/LoadMeta';

// helpers
// https://github.com/react-native-linear-gradient/react-native-linear-gradient
import { _i } from '../Translations';

// styles
import { STYLES } from '../Styles';

class RegistrationPasswordScreen extends React.Component {

    constructor( props ) {

        super( props );

        const regTag = _.get( props, 'route.params.regTag', null );

        this.state = {
            saveInProgress: false,
            regTag: regTag,
            metaLoaded: false,
        };
    }

    _isMounted = false;

    _isLoading = false;

    _saveStep = () => {

        if( !this.context.isValid(['setPassword']) ) {
            Alert.alert( _i('Whoops!'), _i('Some of the information you provided appears to be invalid, please check the incorrect fields and try again') )
            return;
        }

        if( !this.context.passwordsMatch() ) {
            Alert.alert(_i('Whoops!'), _i('Please make sure the passwords match and then try again'));
            return;
        }

        this.setState({ saveInProgress: true });

        this.context.activate()
            .then( data => {
                this.props.navigation.navigate('register.terms');
            })
            .catch(error => {
                const message = _.get( error, 'message', 'Sorry, we were unable to process your registration at this point, please try again later.' );
                Alert.alert( 'Registration Error', message );
            })
            .finally(() => {
                if( this._isMounted ) {
                    this.setState({ saveInProgress: false });
                }
            });
    };

    _setRegTag = () => {

        if( !this.state.regTag ) {
            // TODO handle error
            return;
        }

        this.context.setRegTag( this.state.regTag );
    }

    componentDidMount() {

        this._isMounted = true;

        this._setRegTag( this.state.regTag );

    }

    componentWillUnmount() {

        this._isMounted = false;

    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <RegistrationContext.Consumer>{( registrationContext ) => {
                const { totalSteps, renderFields } = registrationContext;
                return (
                    <LinearGradient colors={STYLES.gradients.purple} start={STYLES.gradients.top} end={STYLES.gradients.bottom} style={{ flex: 1 }}>
                        <SafeAreaView style={STYLES.container.default}>
                            <LoadMeta onMetaLoaded={ loaded => this.setState({ metaLoaded: loaded })} />
                            {
                                this.state.metaLoaded === true &&
                                <KeyboardAvoidingView
                                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                    style={STYLES.container.default}
                                >
                                <ScrollView>
                                    <ProgressStepper step={5} total={totalSteps} />
                                    <HeadingGroup
                                        heading={ _i('Choose a password')}
                                        body={_i('Your email address has been verified. Please Choose a password to complete your account creation.')}
                                        textColor={ STYLES.colors.white }
                                    />
                                    <View style={STYLES.section.large}>
                                        { renderFields( 'setPassword' ) }
                                        <ButtonBlock
                                            color={this.state.saveInProgress ? 'disabled' : 'yellow'}
                                            label={ this.state.saveInProgress ? _i('Saving...') : _i('Next')}
                                            xAdjust={36}
                                            onPressEvent={ () => this._saveStep() }
                                            disabled={this.state.saveInProgress}
                                        />
                                    </View>
                                </ScrollView>
                                </KeyboardAvoidingView>
                            }
                            {
                                this.state.metaLoaded === false &&
                                <View style={{flex: 1}}>
                                    <LoadingSpinner />
                                </View>
                            }
                        </SafeAreaView>
                    </LinearGradient>
                );
            }}</RegistrationContext.Consumer>
        );
    };

};

RegistrationPasswordScreen.contextType = RegistrationContext;

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <RegistrationPasswordScreen {...props} navigation={navigation} />;
}