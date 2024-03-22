// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
//import { SafeAreaView, StyleSheet, Animated, Easing, Alert, View, Text } from 'react-native';
import { View, Text } from 'react-native';
// https://github.com/react-native-netinfo/react-native-netinfo
//import NetInfo from "@react-native-community/netinfo";
// external imports
//import LinearGradient from 'react-native-linear-gradient';
// icons
//import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
//import icoMoonConfig from '../../assets/icons/selection.json';
//const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );
// https://lodash.com/
//import _ from 'lodash';
//import { _i } from '../Translations';
// context
import { AuthContext } from '../context/AuthContext';
// local components
//import LoadingModal from '../components/LoadingModal';
// local vars
//import { STYLES } from '../Styles';

export default class AuthLoadingScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            isLoading: true,
        };
    }

    _isMounted = false;

    _isLoading = false;

    _ConnectionAlert = false;


    componentDidMount() {

        this._isMounted = true;

    }

    componentWillUnmount() {

        this._isMounted = false;

    }

    render() {

        return (
            <AuthContext.Consumer>{( authContext ) => {
                //const { isAuthenticated, toggleAuth } = authContext;

                return (
                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                        <Text>Auth context, the stack navigator and the AuthLoading screen not calling any dependencies + linking + reg context</Text>
                    </View>
                );
            }}</AuthContext.Consumer>
        );
    };

};
/*
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
});
*/

AuthLoadingScreen.contextType = AuthContext;