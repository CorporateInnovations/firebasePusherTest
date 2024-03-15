// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, FlatList } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
// https://github.com/react-native-device-info/react-native-device-info
//import DeviceInfo from 'react-native-device-info';
import Moment from 'moment';

import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserContext';
import { TouchableHighlight } from 'react-native-gesture-handler';

// local components
import ButtonBlock from '../components/ButtonBlock';
import GeneralMessage from '../components/GeneralMessage';
import DeveloperErrorLog from '../components/DeveloperErrorLog';
import LoadingSpinner from '../components/LoadingSpinner';

// styles
import { STYLES, VARS } from '../Styles';
// translations
import { _i } from '../Translations';
import CONFIG from '../Config';
import { getErrorLogs, clearErrorLogs, deleteErrorLog } from '../Helpers';

class MenuDeveloperErrorLogsScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            hasLoaded: false,
            logs: []
        };
    }

    _isMounted = false;

    _isLoading = false;

    _deleteErrorLogs = async () => {
        await clearErrorLogs();
        this._getData();
    }  
    
    _deleteErrorLog = async logId => {
        await deleteErrorLog( logId );
        this._getData();
    }

    _getData = async () => {
        const logs = await getErrorLogs();

        if( !Array.isArray( logs ) ) {
            console.warn( 'Non array error', logs );
            return;
        }

        if( this._isMounted ) {
            this.setState({
                logs,
                hasLoaded: true,
            });
        }
    }

    _listHeader = () => {
        if( this.state.logs.length > 0 ) {
            return (
                <ButtonBlock
                    color={'yellow'}
                    label={_i('Clear all')}
                    customStyle={{ marginBottom: VARS.spacer.small }}
                    xAdjust={VARS.spacer.small}
                    onPressEvent={ () => this._deleteErrorLogs() }
                />
            );
        }
    }

    _listEmpty = () => {
        return (
            <GeneralMessage message={ _i('No errors! Whoop, party party') } />
        );
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
                                {
                                    !this.state.hasLoaded &&
                                    <LoadingSpinner />
                                }
                                {
                                    this.state.hasLoaded &&
                                    <FlatList
                                        data={ this.state.logs }
                                        keyExtractor={ item => item.id.toString() }
                                        style={{
                                            paddingTop: VARS.spacer.small,
                                            paddingLeft: VARS.spacer.small,
                                            paddingRight: VARS.spacer.small,
                                        }}
                                        ListHeaderComponent={this._listHeader()}
                                        ListEmptyComponent={this._listEmpty()}
                                        renderItem={({ item }) => (
                                            <DeveloperErrorLog
                                                key={item.id.toString()}
                                                log={item}
                                                deleteErrorLog={ this._deleteErrorLog }
                                            />
                                        )}
                                    />
                                }
                            </SafeAreaView>
                        );
                    }}</UserContext.Consumer>
                );
            }}</AuthContext.Consumer>
        );
    };

};

// 
    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <MenuDeveloperErrorLogsScreen {...props} navigation={navigation} />;
}