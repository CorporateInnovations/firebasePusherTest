/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { TouchableOpacity, Alert  } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

/*******************************************************************************
 * Local components
 ******************************************************************************/

// none

/*******************************************************************************
 * Services
 ******************************************************************************/

// none

/*******************************************************************************
 * Global Consts
 ******************************************************************************/

// Styles
import { STYLES, VARS } from '../Styles';

/*******************************************************************************
 * HeaderBackButton Class
 ******************************************************************************/
class HeaderBackButton extends React.Component {

    /**
     * go back!!
     *
     * @param {obj} response from a server
     * @return {null} trigger an alert with message
     */
    _goBack() {
        //const backAction = NavigationActions.back();

        this.props.navigation.goBack();

    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <TouchableOpacity
                style={ styles.button }
                onPress={ () => this._goBack() }
            >
                <Icon name={ `rc-icon-arrow-left` } size={ 18 } color={ STYLES.colors.white } />
            </TouchableOpacity>
        );
    }
}

/*******************************************************************************
 * Styles
 ******************************************************************************/
const styles = {
    button: {
        flex: 1,
        width: 50,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    }
}

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <HeaderBackButton {...props} navigation={navigation} />;
}
