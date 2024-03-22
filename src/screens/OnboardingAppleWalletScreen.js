// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, SafeAreaView, ScrollView, Image } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';

import { OnboardingContext } from '../context/OnboardingContext';

import HeadingGroup from '../components/HeadingGroup';
import ButtonBlock from '../components/ButtonBlock';
import MastercardProvisioning from '../components/MastercardProvisioning';

import * as UserService from '../services/user';

// helpers
// https://github.com/react-native-linear-gradient/react-native-linear-gradient
import { _i } from '../Translations';

// styles
import { STYLES, VARS } from '../Styles';

class OnboardingAppleWalletScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            hasLoaded: false
        };
    }

    _setSkipApplePay = async () => {
        await this.context.setApplePaySkippedKey();
        this._skip();
    }

    _skip = async () => {
        const status = await this.context.getOnboardingStatus();
        // if status returns an empty array or otherwise falsey response, the context provider itself will setState isOnboarded to true which will auto route the user into the app - no manual navigation required
        if( Array.isArray( status ) && status.length > 0 ) {
            this.props.navigation.navigate( status[0].screen );
        }
    }

    _isMounted = false;
    _isLoadingCard = false;
    _isLoading = false;

    _getAccountDetails = () => {

        if( !this._isLoadingCard ) {
            this._isLoadingCard = true;
            UserService.getAccountDetails()
                .then(( data ) => {

                    if( this._isMounted ) {
                        this.setState({
                            accountDetails: data.details,
                        });
                    }
                })
                .catch(( error ) => {
                    console.warn( 'error', error );
                })
                .finally(() => {

                    this._isLoadingCard = false;
                    if( this._isMounted ) {
                        this.setState({ hasLoaded: true });
                    }

                });
        }

    }

    componentDidMount() {

        this._isMounted = true;

        this._getAccountDetails();

    }

    componentWillUnmount() {

        this._isMounted = false;

    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <OnboardingContext.Consumer>{( onboardingContext ) => {
                const { biometricLabel } = onboardingContext;
                return (
                    <SafeAreaView style={STYLES.container.default}>
                        <View style={STYLES.container.default}>
                            <View style={STYLES.section.large}>
                                <HeadingGroup
                                    heading={ _i('Apple Pay')}
                                    body={ _i('Pay easily and securely with Apple Pay. Add your card today.') }
                                    textColor={ STYLES.colors.navy.default }
                                />
                                <View style={{...STYLES.section.large, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={ require('../../assets/images/apple-pay-icon.png') } style={{marginBottom: 30}} />
                                </View>
                            </View>
                        </View>
                        {
                            this.state.hasLoaded === true &&
                            <View style={{ ...STYLES.container.default, justifyContent: 'flex-end' }}>
                                <View style={STYLES.section.large}>
                                    <View style={{marginBottom:VARS.spacer.small}}>
                                        <MastercardProvisioning account={ this.state.accountDetails } context={'splash-screen'} />
                                    </View>
                                    <ButtonBlock
                                        color={ 'yellow' }
                                        label={_i('Skip')}
                                        xAdjust={36}
                                        onPressEvent={ () => this._setSkipApplePay() }
                                    />
                                </View>
                            </View>
                        }
                    </SafeAreaView>
                );
            }}</OnboardingContext.Consumer>
        );
    };

};

OnboardingAppleWalletScreen.contextType = OnboardingContext;

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <OnboardingAppleWalletScreen {...props} navigation={navigation} />;
}