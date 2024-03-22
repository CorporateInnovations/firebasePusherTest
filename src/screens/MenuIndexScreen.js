// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// contexts
import { AuthContext } from '../context/AuthContext';
// https://github.com/react-native-linear-gradient/react-native-linear-gradient
import LinearGradient from 'react-native-linear-gradient';
// https://github.com/react-native-device-info/react-native-device-info
import DeviceInfo from 'react-native-device-info';
// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );
// local components
import ButtonBlock from '../components/ButtonBlock';
import MenuItemLink from '../components/MenuItemLink';
// styles
import { STYLES, VARS } from '../Styles';
// translations
import { _i } from '../Translations';

const DIMENSIONS = Dimensions.get( 'window' );
const xlViewport = DIMENSIONS.width > 375;

/**
 * MenuIndexScreen - the global menu for authenticated users
 */
class MenuIndexScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            build_number: DeviceInfo.getBuildNumber(),
            version: DeviceInfo.getVersion(),
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

        const { navigate, goBack } = this.props.navigation;

        return (
            <AuthContext.Consumer>{( authContext ) => {
                const { isAuthenticated, logout, developerMode, confirmWipeData } = authContext;

                return (
                    <LinearGradient colors={STYLES.gradients.pink} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
                        <SafeAreaView style={ STYLES.container.default }>
                            <View style={{
                                flex: 0,
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                paddingLeft: VARS.spacer.large,
                                paddingRight: VARS.spacer.large,
                            }}>
                                <TouchableOpacity
                                    style={ STYLES.menu.primary_button }
                                    onPress={ () => goBack() }
                                >
                                    <Text style={ STYLES.menu.primary_button_text }>Close</Text>
                                    <View style={{
                                        ...STYLES.menu.primary_button_icon_wrapper,
                                        width: 40,
                                        justifyContent: 'flex-end',
                                    }}>
                                        <Icon
                                            name={ `rc-icon-times` }
                                            size={ 28 }
                                            color={ STYLES.colors.white }
                                            style={{
                                                ...STYLES.menu.primary_button_icon,
                                                marginLeft: 5,
                                                marginRight: 0,
                                            }}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                paddingLeft: VARS.spacer.large,
                                paddingRight: VARS.spacer.large,
                                paddingTop: xlViewport ? VARS.spacer.large : 0,
                                paddingBottom: xlViewport ? VARS.spacer.large : 0,
                                flex: 2,
                            }}>
                                <View style={{}}>
                                    <MenuItemLink
                                        type={'primary'}
                                        action={{ type: 'navigate', target: 'tab.account' }}
                                        icon={'rp-icon-club-royal'}
                                        label={'Dashboard'}
                                    />
                                    <MenuItemLink
                                        type={'primary'}
                                        action={{ type: 'navigate', target: 'tab.rewards'}}
                                        icon={'rp-icon-rewards-gift'}
                                        label={'Rewards'}
                                    />
                                    <MenuItemLink
                                        type={'primary'}
                                        action={{ type: 'navigate', target: 'tab.news'}}
                                        icon={'rp-icon-news'}
                                        label={'News'}
                                    />
                                    <MenuItemLink
                                        type={'primary'}
                                        action={{ type: 'navigate', target: 'tab.mastercard'}}
                                        icon={'rp-icon-mastercard-default'}
                                        label={'Mastercard'}
                                    />
                                    <MenuItemLink
                                        type={'primary'}
                                        action={{ type: 'navigate', target: 'ballots.index'}}
                                        icon={'rp-icon-ballots'}
                                        label={'Ballots'}
                                    />
                                    <MenuItemLink
                                        type={'primary'}
                                        action={{ type: 'navigate', target: 'tab.learn'}}
                                        icon={'rp-icon-learn'}
                                        label={'Learn'}
                                    />
                                    <MenuItemLink
                                        type={'primary'}
                                        action={{ type: 'navigate', target: 'menu.top_offers'}}
                                        icon={'rp-icon-top-offers'}
                                        label={'Top Offers'}
                                    />
                                </View>
                            </View>
                            <View style={{
                                paddingLeft: VARS.spacer.large,
                                paddingRight: VARS.spacer.large,
                                paddingTop: xlViewport ? VARS.spacer.large : 0,
                                paddingBottom: xlViewport ? VARS.spacer.large : 0,
                                flex: 1,
                            }}>
                                <View style={{
                                    ...STYLES.section.inner_stroke_top
                                }}>
                                    <MenuItemLink
                                        type={'basic'}
                                        action={{ type: 'navigate', target: 'account.show'}}
                                        label={'Account'}
                                    />
                                    <MenuItemLink
                                        type={'basic'}
                                        action={{ type: 'navigate', target: 'menu.terms'}}
                                        label={'Terms & Conditions'}
                                    />
                                    {
                                        developerMode === true &&
                                        <MenuItemLink
                                            type={'basic'}
                                            action={{ type: 'navigate', target: 'menu.developer'}}
                                            label={'Developer Tools'}
                                        />
                                    }
                                </View>
                            </View>
                            <View style={{
                                ...STYLES.section.large,
                                flex: 0,
                                flexGrow: 0,
                            }}>
                                <ButtonBlock
                                    color={'yellow'}
                                    label={_i('Logout')}
                                    customStyle={{ marginBottom: 20 }}
                                    xAdjust={VARS.spacer.large}
                                    onPressEvent={ () => logout() }
                                />
                                <View style={{ paddingTop: VARS.spacer.small }}>
                                    <Text style={{...STYLES.text.body_light, textAlign: 'center', color: VARS.colors.white }}>{ `Version: ${this.state.version} (${this.state.build_number})` }</Text>
                                </View>
                            </View>
                        </SafeAreaView>
                    </LinearGradient>
                );
            }}</AuthContext.Consumer>
        );
    };

};

const styles = StyleSheet.create({

});

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <MenuIndexScreen {...props} navigation={navigation} />;
}
