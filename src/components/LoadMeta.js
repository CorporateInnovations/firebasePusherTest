// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Alert } from 'react-native';
// https://github.com/react-native-netinfo/react-native-netinfo
import NetInfo from "@react-native-community/netinfo";
import _ from 'lodash';
// context
import { AuthContext } from '../context/AuthContext';
// translations
import { _i } from '../Translations';

export default class LoadMeta extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            isLoading: true,
        };
    }

    _isMounted = false;

    _isLoading = false;

    _ConnectionAlert = false;

    _retryInit = () => {

        if( this._interval ) {
            clearInterval( this._interval );
        }

        //this._init();
    }

    _init = async () => {
        // initiall test the connection
        const { isConnected } = await NetInfo.fetch();

        if( !isConnected ) {
            // make sure this alertPresent flag is correctly set always because Alerts will stack otherwise
            if( !this.alertPresent ) {
                this.alertPresent = true;
                Alert.alert(
                    _i('No Connection'),
                    _i('Please connect to wifi or a data network and try again'),
                    [
                        {
                            text: 'OK', 
                            onPress: () => { this.alertPresent = false }
                        }
                    ],
                    { 
                        cancelable: false 
                    }
                );
            }

            // re-test every 10 seconds the user is not just stranded if they've kept the app open
            this._interval = setInterval(() => {
                this._retryInit();
            }, 10000 );

            return;
        }

        if( this._interval ) {
            clearInterval( this._interval );
        }

        try {
            // get tyhe auth preference
            const phoenixMeta = await this.context.getPhoenixMeta();

            if( !_.get( phoenixMeta, 'success', false ) ) {
                throw 'Error getting csrf token from Phoenix';
            }

            // navigate to login
            this.props.onMetaLoaded(true);

        } catch( error ) {
            Alert.alert( _i('Sorry!'), _i('The app was unable to connect to Club Royal. Please try again later.') );
        }
    }

    componentDidMount() {

        this._isMounted = true;

        this._init();

    }

    componentWillUnmount() {

        this._isMounted = false;

        if( this._interval ) {
            clearInterval( this._interval );
        }

    }

    render() {

        return (
            <AuthContext.Consumer>{( authContext ) => {
                const { isAuthenticated, toggleAuth } = authContext;

                return (
                    <View></View>
                );
            }}</AuthContext.Consumer>
        );
    };

};

LoadMeta.contextType = AuthContext;