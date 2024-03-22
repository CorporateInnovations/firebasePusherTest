// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// external imports
import LinearGradient from 'react-native-linear-gradient';
// context
import { OnboardingContext } from '../context/OnboardingContext';
// local components
import FormSwitchInput from '../components/FormSwitchInput';
import UserSettingsMarketing from '../components/UserSettingsMarketing';
import SectionHeading from '../components/SectionHeading';
import NewsPostsLatest from '../components/NewsPostsLatest';
// styles
import { STYLES, VARS } from '../Styles';
import { _i } from '../Translations';

class AccountSettingsScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            placeholderOne: false,
            placeholderTwo: false,
            placeholderThree: false,
            placeholderFour: false,
            placeholderFive: false,
            placeholderSix: false,
        };
    }

    _isMounted = false;

    _isLoading = false;

    _updateBiometricEnabled = newValue => {
        newValue === true ? this.context.setBiometricEnabled() : this.context.setBiometricDisabled();
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
            <OnboardingContext.Consumer>{( onboardingContext ) => {
                const { biometricSupported, biometricEnabledFlag, biometricSupportedLabel, renderFields } = onboardingContext;

                return (
                    <SafeAreaView style={{...STYLES.container.default, backgroundColor: STYLES.colors.white }}>
                        <ScrollView>
                            <View style={STYLES.section.large}>
                                <View style={ STYLES.text.paragraph }>
                                    <Text style={{ ...STYLES.text.heading5, paddingBottom: VARS.spacer.xsmall }}>{ _i('Security') }</Text>
                                    <Text style={{ ...STYLES.text.body_light }}>{ _i('If your device supports fingerprint or face recognition, you can log in to your account using those methods.') }</Text>
                                </View>
                                {
                                    ( typeof biometricSupported === 'string' && biometricSupported.length > 0 ) &&
                                    <FormSwitchInput
                                        label={`Enable login with ${biometricSupportedLabel}`}
                                        value={ biometricEnabledFlag != '0' }
                                        onValueChange={ newValue => this._updateBiometricEnabled(newValue)}
                                    />
                                }
                                {
                                    !biometricSupported &&
                                    <Text style={STYLES.text.body_light}>{ _i('Unfortunately, biometric access is not available on this device.') }</Text>
                                }
                            </View>
                            <View style={STYLES.section.large}>
                                <View style={ STYLES.text.paragraph }>
                                    <Text style={{ ...STYLES.text.heading5, paddingBottom: VARS.spacer.xsmall }}>{ _i('Marketing') }</Text>
                                    <Text style={{ ...STYLES.text.body_light }}>{ _i('Would you like to receive news about our great offers and updates to our service via any of these methods:') }</Text>
                                </View>
                                <UserSettingsMarketing />
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                );
            }}</OnboardingContext.Consumer>
        );
    };

};

AccountSettingsScreen.contextType = OnboardingContext;

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <AccountSettingsScreen {...props} navigation={navigation} />;
}