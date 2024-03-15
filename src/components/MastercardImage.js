/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { StyleSheet, Modal, View, Text, Image, Dimensions, Linking } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';

// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );
// local components
import LoadingSpinner from '../components/LoadingSpinner';
// context
import { UserContext } from '../context/UserContext';
// mastercard service
import * as Mastercard from '../services/mastercard';

import { STYLES, VARS } from '../Styles';
import { _i } from '../Translations';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * MastercardImage Class
 ******************************************************************************/
class MastercardImage extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            side: 'front'
        };
    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
        this.context.getMastercardImage( this.context.mastercardVisibleSideLabel )
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <UserContext.Consumer>{( userContext ) => {
                const { profile, mastercardImage, mastercardImageLoading } = userContext;

                if( mastercardImageLoading === true ) {
                    return (
                        <View
                            style={{
                                ...styles.card_image_container,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 8,
                            }}
                        >
                            <LoadingSpinner color={ STYLES.colors.white } />
                        </View>
                    );
                }

                if( mastercardImage !== null ) {
                    return (
                        <View>
                            <Image
                                style={styles.card_image_container}
                                source={mastercardImage}
                            />
                        </View>
                    );
                }
  
            }}</UserContext.Consumer>
        );
    }
}

MastercardImage.contextType = UserContext;

const styles = StyleSheet.create({
    card_image_container: {
        width: DIMENSIONS.width - ( 2 * VARS.spacer.large ),
        height: (DIMENSIONS.width - ( 2 * VARS.spacer.large )) * 0.628,
    },
});

export default function( props ) {

    const navigation = useNavigation();

    return <MastercardImage {...props} navigation={navigation} />;
}
