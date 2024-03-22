/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { StyleSheet, View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// local components
import MastercardOverview from '../components/MastercardOverview';
import LoadingSpinner from '../components/LoadingSpinner';
import GeneralMessage from '../components/GeneralMessage';

// context
import { UserContext } from '../context/UserContext';

import { STYLES, VARS } from '../Styles';
import { formatDate } from '../Helpers';
import { _i } from '../Translations';

/*******************************************************************************
 * MastercardTransactionsList Class
 ******************************************************************************/
class MastercardTransactionsList extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            page: 1,
        };
    }

    _isMounted = false;

    _getMastercardTransactions = () => {
        this.context.getMastercardTransactions( this.state.page );
    }

    componentDidMount() {
        this._isMounted = true;
        this._getMastercardTransactions();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <UserContext.Consumer>{( userContext ) => {
                const { mastercardTransactionsFetched, mastercardTransactionsItems, getMastercardTransactions } = userContext;

                /*
                if( !mastercardTransactionsFetched ) {
                    return (
                        <LoadingSpinner />
                    );
                }
                */

                /*
                if( mastercardTransactionsFetched && mastercardTransactionsItems.length === 0 ) {
                    return (
                        <GeneralMessage message={ _i('You have no mastercard transactions') } />
                    );
                }
                */

                return (
                    <FlatList
                        data={ mastercardTransactionsItems }
                        keyExtractor={ item => item.id.toString() }
                        ListHeaderComponent={<MastercardOverview />}
                        ListEmptyComponent={<GeneralMessage message={ _i('You have no mastercard transactions') } />}
                        refreshing={false}
                        onRefresh={() => getMastercardTransactions(1)}
                        renderItem={({ item }) => (
                            <View
                                key={item.id.toString() }
                                style={ styles.item_row }
                            >
                                <View>
                                    <Text style={{...styles.item_date, paddingBottom: 3 }}>{formatDate( item.date, 'D MMM YYYY' )}</Text>
                                    <Text style={styles.item_date}>{item.reason}</Text>
                                </View>
                                <View>
                                    <Text style={styles.item_value }>{item.value}</Text>
                                </View>
                            </View>
                        )}
                    />
                );
                
            }}</UserContext.Consumer>
        );
    }
}

MastercardTransactionsList.contextType = UserContext;

const styles = StyleSheet.create({
    item_row: {
        flex: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 14,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderColor: STYLES.colors.gray.xlight
    },
    item_date: {
        ...STYLES.text.body_light
    },
    item_value: {
        ...STYLES.text.body_bold
    }
});

export default function( props ) {

    const navigation = useNavigation();

    return <MastercardTransactionsList {...props} navigation={navigation} />;
}
