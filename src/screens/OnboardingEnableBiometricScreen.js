// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, SafeAreaView, ScrollView, Alert } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';

import { OnboardingContext } from '../context/OnboardingContext';

import HeadingGroup from '../components/HeadingGroup';
import ButtonBlock from '../components/ButtonBlock';

// helpers
// https://github.com/react-native-linear-gradient/react-native-linear-gradient
import { _i } from '../Translations';

// styles
import { STYLES } from '../Styles';

class OnboardingEnableBiometricScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            
        };
    }

    _enableBiometrics = async () => {
        await this.context.setBiometricEnabled();
        this._proceed();
    }

    _skip = async () => {
        await this.context.setBiometricDisabled();
        this._proceed();
    }

    _proceed = async () => {
        const status = await this.context.getOnboardingStatus();
        // if status returns an empty array or otherwise falsey response, the context provider itself will setState isOnboarded to true which will auto route the user into the app - no manual navigation required
        if( Array.isArray( status ) && status.length > 0 ) {
            this.props.navigation.navigate( status[0].screen );
        }
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

        const label = this.state.biometricLabel ? 'Enable ' + this.state.biometricLabel : null;

        return (
            <OnboardingContext.Consumer>{( onboardingContext ) => {
                const { biometricLabel } = onboardingContext;
                return (
                    <SafeAreaView style={STYLES.container.default}>
                        <ScrollView contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <View style={{...STYLES.section.large, width: '100%', }}>
                                <HeadingGroup
                                    heading={ _i('Enable ' + biometricLabel)}
                                    body={ _i('Quick sign in and easily authorise online Mastercard purchaes. You can change your mind later!') }
                                    textColor={ STYLES.colors.navy.default }
                                />
                                <ButtonBlock
                                    color={ 'yellow' }
                                    label={_i('Yes')}
                                    xAdjust={36}
                                    customStyle={{ marginBottom: 20, marginTop: 30 }}
                                    onPressEvent={ () => this._enableBiometrics() }
                                />
                                <ButtonBlock
                                    color={ 'white' }
                                    label={_i('Not right now')}
                                    xAdjust={36}
                                    onPressEvent={ () => this._skip() }
                                />
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                );
            }}</OnboardingContext.Consumer>
        );
    };

};

OnboardingEnableBiometricScreen.contextType = OnboardingContext;

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <OnboardingEnableBiometricScreen {...props} navigation={navigation} />;
}