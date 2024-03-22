/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { StyleSheet, View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// https://github.com/vivaxy/react-native-auto-height-image
import AutoHeightImage from 'react-native-auto-height-image';
// Google Analytics
// import firebase from '@react-native-firebase/app';
// import analytics from '@react-native-firebase/analytics'

// local components
import AnimatedView from '../components/AnimatedView';
import LoadingSpinner from '../components/LoadingSpinner';
import GeneralMessage from '../components/GeneralMessage';

// context
import { UserContext } from '../context/UserContext';

import { STYLES, VARS } from '../Styles';
import { formatDate } from '../Helpers';
import { _i } from '../Translations';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * RewardsBallotsList Class
 ******************************************************************************/
class RewardsBallotsList extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            page: 1,
        };
    }

    _isMounted = false;

    _getBallots = () => {
        this.context.getBallots();
        this.context.getUserBallots();
    }

    componentDidMount() {
        this._isMounted = true;
        this._getBallots();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    async ballotViewedEvent(ballotName, userId) {
        // await analytics().logEvent('ballot_viewed', {
        //     ballot_name: ballotName,
        //     uid: userId
        // });
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <UserContext.Consumer>{( userContext ) => {
                const { ballotsFetched, ballots, phoenixUser } = userContext;
                const baseWidth = DIMENSIONS.width - ( 2 * VARS.spacer.large );
                const width = this.props.mode === 'horizontal' && ballots.length > 1 ? baseWidth * 0.8 : baseWidth;

                if( !ballotsFetched ) {
                    return (
                        <LoadingSpinner />
                    );
                }

                if( ballotsFetched && ballots.length === 0 ) {
                    return (
                        <GeneralMessage message={ _i('You have no available ballots') } />
                    );
                }

                if( ballotsFetched && ballots.length > 0 ) {
                    return (
                        <FlatList
                            data={ ballots }
                            keyExtractor={ item => item.id.toString() }
                            contentContainerStyle={{
                                paddingTop: this.props.mode === 'vertical' ? VARS.spacer.large : 0,
                                paddingLeft: VARS.spacer.large,
                                paddingRight: VARS.spacer.large,
                            }}
                            horizontal={this.props.mode === 'horizontal'}
                            renderItem={({ item, index }) => {
                                return (
                                <TouchableOpacity
                                    key={item.id.toString() }
                                    onPress={ () => {this.ballotViewedEvent(item.name, phoenixUser.user.id), navigate( 'main.menu', { screen: 'ballots.show', params: { ballot: item }} )} }
                                    style={{
                                        ...styles.item_row,
                                        width: width,
                                        marginBottom: this.props.mode === 'horizontal' ? 0 : VARS.spacer.small,
                                        marginLeft: this.props.mode === 'horizontal' ? ( index === 0 ? 0 : VARS.spacer.small ) : 0
                                    }}
                                >
                                    <AutoHeightImage
                                        style={{flex: 0, borderRadius: VARS.borderRadius.default}}
                                        width={width}
                                        source={{ uri: item.image_url }}
                                    />
                                </TouchableOpacity>
                                )
                            }}
                        />
                    );
                }
                
            }}</UserContext.Consumer>
        );
    }
}

RewardsBallotsList.contextType = UserContext;

const styles = StyleSheet.create({
    item_row: {
        flex: 0,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
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

    return <RewardsBallotsList {...props} navigation={navigation} />;
}
