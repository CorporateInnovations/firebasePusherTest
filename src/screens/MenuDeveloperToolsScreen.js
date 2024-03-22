// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, ScrollView, Switch } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
// https://github.com/react-native-device-info/react-native-device-info
import DeviceInfo from 'react-native-device-info';
import Moment from 'moment';

import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import { TouchableHighlight } from 'react-native-gesture-handler';

// local components
import ButtonBlock from '../components/ButtonBlock';
import DeveloperData from '../components/DeveloperData';
import MenuItemLink from '../components/MenuItemLink';

// styles
import { STYLES, VARS } from '../Styles';
// translations
import { _i } from '../Translations';
import CONFIG from '../Config';
import { clearErrorLogs, getErrorLogs, errorLoggingEnabled, disableErrorLogging, enableErrorLogging } from '../Helpers';

class MenuDeveloperToolsScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            firstInstallTime: null,
            lastUpdateTime: null,
            serialNumber: null,
            uniqueId: null,
            buildNumber: null,
            version: null,
            errorLoggingEnabled: false
        };
    }

    _isMounted = false;

    _isLoading = false;

    _renderAccountCards = accounts => {

        accounts = accounts || [];

        for( let i = 0; i < accounts.length; i++ ) {
            accounts[i] = accounts[i] || {};
            accounts[i].key = ( i + 1 ).toString();
        }

        return accounts.map((item) => {
            return (
                <View key={item.key}>
                    <Text style={{ ...STYLES.text.body_bold, paddingBottom: 5 }}>{ `Card: ${item.key}` }</Text>
                    <DeveloperData label={'accountNo'} value={_.get( item, 'accountInfo.accountNo' , null )} />
                    <DeveloperData label={'accountType'} value={_.get( item, 'accountInfo.accountType' , null )} />
                    <DeveloperData label={'defaultProductBalanceCode'} value={_.get( item, 'accountInfo.defaultProductBalanceCode' , null )} />
                    <DeveloperData label={'productClassCode'} value={_.get( item, 'accountInfo.productClassCode' , null )} />
                    <DeveloperData label={'productClassLongDesc'} value={_.get( item, 'accountInfo.productClassLongDesc' , null )} />
                    <DeveloperData label={'productClassShortDesc'} value={_.get( item, 'accountInfo.productClassShortDesc' , null )} />
                    <DeveloperData label={'cardholderRef'} value={_.get( item, 'cardholderRef' , null )} />
                    <DeveloperData label={'currency'} value={_.get( item, 'productBalances[0].currency' , null )} />
                    <DeveloperData label={'maxBalance'} value={_.get( item, 'productBalances[0].maxBalance.amount' , null )} />
                </View>
            );
        });
    }

    _getData = async () => {

        const serialNumber = await DeviceInfo.getSerialNumber();
        const uniqueId = DeviceInfo.getUniqueId();
        const firstInstallTime = await DeviceInfo.getFirstInstallTime();
        const lastUpdateTime = await DeviceInfo.getLastUpdateTime();
        const buildNumber = DeviceInfo.getBuildNumber();
        const version = DeviceInfo.getVersion();
        const errorLoggingEnabledFlag = await errorLoggingEnabled();

        if( this._isMounted ) {
            this.setState({
                firstInstallTime: firstInstallTime > 0 ? Moment(firstInstallTime).format('DD MMM YYYY kk:mm:ss') : 'unavailable',
                lastUpdateTime: lastUpdateTime > 0 ? Moment(lastUpdateTime).format('DD MMM YYYY kk:mm:ss') : 'unavailable',
                serialNumber,
                uniqueId,
                buildNumber,
                version,
                errorLoggingEnabled: errorLoggingEnabledFlag
            });
        }
    }

    _toggleLoggingEnabled = ( someValue ) => {

        if( this._isMounted ) {
            this.setState({ errorLoggingEnabled: someValue });
        }

        someValue ? enableErrorLogging() : disableErrorLogging();
    }

    componentDidMount() {

        this._isMounted = true;

        this._getData();

    }

    componentWillUnmount() {

        this._isMounted = false;

    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <AuthContext.Consumer>{( authContext ) => {
                const { confirmWipeData, authPreference } = authContext;
                return (
                    <UserContext.Consumer>{( userContext ) => {
                        const { profile, customerCode, cardholderRef, mastercardBalanceAvailable, mastercardBalanceCleared, accountData } = userContext;

                        return (
                            <SafeAreaView style={ STYLES.container.default }>
                                <ScrollView>
                                    <View style={ STYLES.section.large }>
                                        <View style={ STYLES.text.paragraph }>
                                            <Text style={{ ...STYLES.text.heading5, paddingBottom: VARS.spacer.xsmall }}>Error Logging</Text>
                                            <Text style={{ ...STYLES.text.body_light }}>Basic local error logging. If you enable this, certain errors will be stored in AsyncStorage. Don't enable this in production for non-developer users!</Text>
                                        </View>
                                        <View style={{
                                            ...STYLES.text.paragraph,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                            <Text style={{ ...STYLES.text.body_bold }}>{`Enable device error logging:`}</Text>
                                            <Switch
                                                trackColor={{ false: STYLES.colors.gray.light, true: STYLES.colors.pink.default }}
                                                ios_backgroundColor={STYLES.colors.gray.light}
                                                onValueChange={this._toggleLoggingEnabled}
                                                value={this.state.errorLoggingEnabled}
                                            />
                                        </View>
                                        {
                                            this.state.errorLoggingEnabled &&
                                            <MenuItemLink
                                                type={'basic'}
                                                action={{ type: 'navigate', target: 'menu.error_logs'}}
                                                label={'View error logs'}
                                                chevron={true}
                                                color={STYLES.colors.pink.default}
                                            />
                                        }
                                    </View>
                                    <View style={ STYLES.section.large }>
                                        <View style={ STYLES.text.paragraph }>
                                            <Text style={{ ...STYLES.text.heading5, paddingBottom: VARS.spacer.xsmall }}>Reset App Data</Text>
                                            <Text style={{ ...STYLES.text.body_light }}>Tap 'Wipe Device' below to clear all stored data and return app to newly-installed state.</Text>
                                        </View>
                                        <ButtonBlock
                                            color={'yellow'}
                                            label={_i('Reset App')}
                                            xAdjust={VARS.spacer.large}
                                            onPressEvent={ () => confirmWipeData() }
                                        />
                                    </View>
                                    <View style={ STYLES.section.large }>
                                        <View style={ STYLES.text.paragraph }>
                                            <Text style={{ ...STYLES.text.heading5, paddingBottom: VARS.spacer.xsmall }}>Local Configs</Text>
                                            <Text style={{ ...STYLES.text.body_light }}>Local app configurations in Config.js</Text>
                                        </View>
                                        <Text style={{ ...STYLES.text.body_bold, paddingBottom: 5 }}>Bridge Settings</Text>
                                        <DeveloperData label={'Environment'} value={CONFIG.env.bridge} />
                                        <DeveloperData label={'API Base uri'} value={CONFIG.api.bridge[CONFIG.env.bridge]} />
                                        <DeveloperData label={'Default API version'} value={CONFIG.api.bridge.defaultVersion} />
                                        <Text style={{ ...STYLES.text.body_bold, paddingBottom: 5 }}>Phoenix Settings</Text>
                                        <DeveloperData label={'Environment'} value={CONFIG.env.phoenix} />
                                        <DeveloperData label={'API Base uri'} value={CONFIG.api.phoenix[CONFIG.env.phoenix]} />
                                    </View>

                                    <View style={ STYLES.section.large }>
                                        <View style={ STYLES.text.paragraph }>
                                            <Text style={{ ...STYLES.text.heading5, paddingBottom: VARS.spacer.xsmall }}>Installation Info</Text>
                                            <Text style={{ ...STYLES.text.body_light }}>Various installation values available</Text>
                                        </View>
                                        <Text style={{ ...STYLES.text.body_bold, paddingBottom: 5 }}>Installation</Text>
                                        <DeveloperData label={'Store Veresion'} value={this.state.version} />
                                        <DeveloperData label={'Build Number'} value={this.state.buildNumber} />
                                        <DeveloperData label={'First installed'} value={this.state.firstInstallTime} />
                                        <DeveloperData label={'Last updated'} value={this.state.lastUpdateTime} />
                                        <Text style={{ ...STYLES.text.body_bold, paddingBottom: 5 }}>Device</Text>
                                        <DeveloperData label={'Serial Number'} value={this.state.serialNumber} />
                                        <DeveloperData label={'UUID'} value={this.state.uniqueId} />
                                    </View>

                                    <View style={ STYLES.section.large }>
                                        <View style={ STYLES.text.paragraph }>
                                            <Text style={{ ...STYLES.text.heading5, paddingBottom: VARS.spacer.xsmall }}>AuthContext State</Text>
                                            <Text style={{ ...STYLES.text.body_light }}>The following data is stored currently in AuthContext</Text>
                                        </View>
                                        <Text style={{ ...STYLES.text.body_bold, paddingBottom: 5 }}>authPreference</Text>
                                        <DeveloperData label={'passcode'} value={authPreference.passcode} />
                                        <DeveloperData label={'biometricPreference'} value={authPreference.biometricPreference} />
                                        <DeveloperData label={'has2FACode'} value={authPreference.has2FACode ? 'true' : 'false'} />
                                        <DeveloperData label={'hasCredentials'} value={authPreference.hasCredentials ? 'true' : 'false'} />
                                        <Text style={{ ...STYLES.text.body_bold, paddingBottom: 5 }}>Bridge Session</Text>
                                        <DeveloperData label={'accessToken (bridge)'} value={authContext.accessToken} />
                                        <Text style={{ ...STYLES.text.body_bold, paddingBottom: 5 }}>Phoenix Session</Text>
                                        <DeveloperData label={'phoenixCsrf'} value={authContext.phoenixCsrf} />
                                        <DeveloperData label={'phoenixAssetPath'} value={authContext.phoenixAssetPath} />
                                        
                                    </View>
                                    <View style={ STYLES.section.large }>
                                        <View style={ STYLES.text.paragraph }>
                                            <Text style={{ ...STYLES.text.heading5, paddingBottom: VARS.spacer.xsmall }}>UserContext State</Text>
                                            <Text style={{ ...STYLES.text.body_light }}>The following data is stored currently in UserContext</Text>
                                        </View>
                                        <Text style={{ ...STYLES.text.body_bold, paddingBottom: 5 }}>Profile</Text>
                                        <DeveloperData label={'id'} value={profile.id} />
                                        <DeveloperData label={'email'} value={profile.email} />
                                        <DeveloperData label={'first_name'} value={profile.first_name} />
                                        <DeveloperData label={'last_name'} value={profile.last_name} />
                                        <DeveloperData label={'profile_image'} value={profile.profile_image} />
                                        <Text style={{ ...STYLES.text.body_bold, paddingBottom: 5 }}>Mastercard Account</Text>
                                        <DeveloperData label={'cardholderRef'} value={cardholderRef} />
                                        <DeveloperData label={'customerCode'} value={customerCode} />
                                        <DeveloperData label={'mastercardBalanceAvailable'} value={mastercardBalanceAvailable} />
                                        <DeveloperData label={'mastercardBalanceCleared'} value={mastercardBalanceCleared} />
                                        <DeveloperData label={'accountNo'} value={_.get( accountData, 'full_details.current.accountNo', null )} />
                                        <DeveloperData label={'cardSerial'} value={_.get( accountData, 'full_details.current.cardSerial', null )} />
                                        <DeveloperData label={'addressLine1'} value={_.get( accountData, 'full_details.address.addressLine1', null )} />
                                        <DeveloperData label={'addressLine2'} value={_.get( accountData, 'full_details.address.addressLine2', null )} />
                                        <DeveloperData label={'addressLine3'} value={_.get( accountData, 'full_details.address.addressLine3', null )} />
                                        <DeveloperData label={'country'} value={_.get( accountData, 'full_details.address.country', null )} />
                                        <DeveloperData label={'countryCode'} value={_.get( accountData, 'full_details.address.countryCode' , null )} />
                                        <DeveloperData label={'postCode'} value={_.get( accountData, 'full_details.address.postCode', null )} />
                                        <DeveloperData label={'town'} value={_.get( accountData, 'full_details.address.town', null )} />
                                        { this._renderAccountCards( _.get( accountData, 'full_details.accounts', [] ) ) }
                                    </View>
                                </ScrollView>
                            </SafeAreaView>
                        );
                    }}</UserContext.Consumer>
                );
            }}</AuthContext.Consumer>
        );
    };

};

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <MenuDeveloperToolsScreen {...props} navigation={navigation} />;
}