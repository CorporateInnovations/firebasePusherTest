/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Dimensions, StyleSheet, Image, Alert, TouchableOpacity } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );
// https://github.com/react-native-image-picker/react-native-image-picker
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

// external imports
import LinearGradient from 'react-native-linear-gradient';
// local components
import ButtonBlock from '../components/ButtonBlock';
// context
import { UserContext } from '../context/UserContext';
// styles
import { STYLES, VARS } from '../Styles';
// translations
import { _i } from '../Translations';

//transfer

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * AccountShow Class
 ******************************************************************************/
class AccountShow extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {

        };
    }

    _selectImage = async () => {

        const options = {
            mediaType: 'photo',
            quality: 0.5,
            includeBase64: true,
            maxWidth: 600,
            maxHeight: 600,
        };
        const result = await launchImageLibrary(options);

        if( result.didCancel ) {
            return;
        }

        const assets = _.get( result, 'assets', null );

        if( assets && Array.isArray(assets) && assets.length > 0 ) {
            const asset = assets[0];

            if( !asset || !asset.base64 ) {
                return;
            }

            const imageData = `data:${asset.type};base64,${asset.base64}`;

            this.context.updateProfileImage( imageData )
                .then( data => {
                    Alert.alert( _i('Success'), _i('Your profile image has been uploaded for approval') );
                    this.context.getProfile();
                })
                .catch( error => {
                    //console.warn('updateProfileImage error', error);
                    //Alert.alert('Image upload error', typeof error === 'string' ? error : JSON.stringify( error ) );
                });
        }
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <UserContext.Consumer>{( userContext ) => {
                const { profile, rewardsTransfer, transferRewardsBalance, claimBookingShow, mastercardBalanceAvailable } = userContext;

                return (
                    <LinearGradient colors={STYLES.gradients.pink} start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }} style={{ flex: 0 }}>
                        <View style={STYLES.section.large}>
                            <View style={{...styles.row, marginBottom: 20 }}>
                                <Image
                                    style={styles.profile_image}
                                    source={{ uri: profile.profile_image }}
                                    resizeMode={'cover'}
                                />
                            </View>
                            <View style={{...styles.row, marginBottom: 15 }}>
                                <Text style={styles.name_text}>{ `${profile.first_name} ${profile.last_name}` }</Text>
                            </View>
                            <ButtonBlock
                                color={'yellow'}
                                label={_i('Update Profile Picture')}
                                xAdjust={36}
                                customStyle={{ marginBottom: 0 }}
                                onPressEvent={ () => this._selectImage() }
                            />
                        </View>

                    </LinearGradient>
                );
            }}</UserContext.Consumer>
        );
    }
}

const styles = StyleSheet.create({
    row: {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    name_text: {
        ...STYLES.text.heading3,
        color: STYLES.colors.white,
        textAlign: 'center',
    },
    mastercard_text: {
        ...STYLES.text.heading4,
        fontFamily: VARS.fonts.family.darwin_light,
        color: STYLES.colors.white,
        textAlign: 'center',
    },
    mastercard_balance_text: {
        ...STYLES.text.heading4,
        color: STYLES.colors.white,
        textAlign: 'center',
    },
    profile_image: {
        width: 130,
        height: 130,
        borderRadius: 65
    },
    actions_row: {
        flex: 0,
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        flexWrap: 'nowrap',
    },
    action_col: {
        width: '100%',
        flexGrow: 1,
        flexShrink: 1,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        flexWrap: 'wrap',
        textAlign: 'center',
        paddingLeft: 15,
        paddingRight: 15
    },
    action_inner: {
        width: '100%',
    },
    action_label_text: {
        fontFamily: VARS.fonts.family.darwin_light,
        fontSize: 12,
        lineHeight: 14,
        color: STYLES.colors.white,
        textTransform: 'uppercase',
        textAlign: 'center',
        letterSpacing: 1
    },
    action_icon: {
        textAlign: 'center',
        marginBottom: 5
    },
    balance_row: {
        flex: 0,
        width: '100%',
        justifyContent: 'center',
        marginBottom: 3
    },
    balance_value_text: {
        fontFamily: VARS.fonts.family.darwin_bold,
        textAlign: 'center',
        color: STYLES.colors.white,
        fontSize: 26,
    }
});

AccountShow.contextType = UserContext;


// Wrap and export
export default function( props ) {

    const navigation = useNavigation();
    
    return <AccountShow {...props} navigation={navigation} />;
}
