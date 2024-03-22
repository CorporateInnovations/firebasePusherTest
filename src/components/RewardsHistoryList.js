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
import AnimatedView from '../components/AnimatedView';
import LoadingSpinner from '../components/LoadingSpinner';
import GeneralMessage from '../components/GeneralMessage';

// context
import { UserContext } from '../context/UserContext';

import { STYLES, VARS } from '../Styles';
import { formatDate } from '../Helpers';
import { _i } from '../Translations';

/*******************************************************************************
 * RewardsHistoryList Class
 ******************************************************************************/
class RewardsHistoryList extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            page: 1,
        };
    }

    _isMounted = false;

    _renderTabs = () => {
        return this.props.tabs.map( tab => {
            return (
                <TouchableOpacity
                    key={tab.slug}
                    onPress={ () => tab.setActiveTab(tab.slug) }
                    style={STYLES.tabs.header_button}
                >
                    <Text style={{
                        ...STYLES.tabs.header_button_text,
                        color: tab.slug === this.props.activeTabSlug ? STYLES.colors.navy.default : STYLES.colors.gray.light,
                    }}>{tab.label}</Text>
                    {
                        tab.slug === this.props.activeTabSlug &&
                        <AnimatedView
                            duration={400}
                            animationName={'fade-in'}
                            customStyle={STYLES.tabs.header_active_indicator}
                        />
                    }
                </TouchableOpacity>
            );
        });
    }

    _getRewardshistory = () => {
        this.context.getRewardsHistory( this.state.page );
    }

    componentDidMount() {
        this._isMounted = true;
        this._getRewardshistory();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <UserContext.Consumer>{( userContext ) => {
                const { rewardsHistoryFetched, rewardsHistoryLoading, rewardsHistoryItems } = userContext;

                if( !rewardsHistoryFetched ) {
                    return (
                        <LoadingSpinner />
                    );
                }

                if( rewardsHistoryFetched && rewardsHistoryItems.length === 0 ) {
                    return (
                        <GeneralMessage message={ _i('You have no rewards history') } />
                    );
                }

                if( rewardsHistoryFetched && rewardsHistoryItems.length > 0 ) {
                    return (
                        <FlatList
                            data={ rewardsHistoryItems }
                            keyExtractor={ item => item.id.toString() }
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    key={item.id.toString() }
                                    onPress={ () => navigate( 'rewards.show', { reward: item } ) }
                                    style={ styles.item_row }
                                >
                                    <View>
                                        <Text style={styles.item_date }>{formatDate( item.reward_date, 'D MMM YYYY' )}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.item_value }>{item.value}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    );
                }
                
            }}</UserContext.Consumer>
        );
    }
}

RewardsHistoryList.contextType = UserContext;

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

    return <RewardsHistoryList {...props} navigation={navigation} />;
}
