// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';

// context
import { RegistrationContext } from '../context/RegistrationContext';

// external imports
import LinearGradient from 'react-native-linear-gradient';

// local components
import HeadingGroup from '../components/HeadingGroup';
import ProgressStepper from '../components/ProgressStepper';
import ButtonBlock from '../components/ButtonBlock';
import LoadingModal from '../components/LoadingModal';

// helpers
// https://github.com/react-native-linear-gradient/react-native-linear-gradient
import { _i } from '../Translations';

// styles
import { STYLES } from '../Styles';

class RegistrationProfileScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            saveInProgress: false
        };
    }

    _isMounted = false;

    _isLoading = false;

    _saveStep = () => {

        if( !this.context.isValid(['profile']) ) {
            // handle the error
            return;
        }

        this.props.navigation.navigate('register.marketing');
    };

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
                const { totalSteps, renderFields, updateAccount } = registrationContext;
                return (
                    <LinearGradient colors={STYLES.gradients.purple} start={STYLES.gradients.top} end={STYLES.gradients.bottom} style={{ flex: 1 }}>
                        <SafeAreaView style={STYLES.container.default}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                style={STYLES.container.default}
                            >
                            <ScrollView>
                                <ProgressStepper step={2} total={totalSteps} />
                                <HeadingGroup
                                    heading={ _i('Your Profile')}
                                    textColor={ STYLES.colors.white }
                                />
                                <View style={STYLES.section.large}>
                                    { renderFields( 'profile' ) }
                                    <ButtonBlock
                                        color={this.state.saveInProgress ? 'disabled' : 'yellow'}
                                        label={ this.state.saveInProgress ? _i('Saving...') : _i('Next')}
                                        xAdjust={36}
                                        customStyle={{ marginBottom: 20 }}
                                        onPressEvent={ () => this._saveStep() }
                                        disabled={this.state.saveInProgress}
                                    />
                                    <ButtonBlock
                                        color={'navy'}
                                        label={_i('Back')}
                                        xAdjust={36}
                                        onPressEvent={ () => navigate('register.account') }
                                        disabled={this.state.saveInProgress}
                                    />
                                </View>
                            </ScrollView>
                            </KeyboardAvoidingView>
                        </SafeAreaView>
                    </LinearGradient>
                );
            }}</RegistrationContext.Consumer>
        );
    };

};

RegistrationProfileScreen.contextType = RegistrationContext;

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <RegistrationProfileScreen {...props} navigation={navigation} />;
}