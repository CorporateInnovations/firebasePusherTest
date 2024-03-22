// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// context
import { AuthContext } from '../context/AuthContext';
// local components
import RewardsOverview from '../components/RewardsOverview';
import GeneralTabsHeader from '../components/GeneralTabsHeader';
import GeneralTabsPanel from '../components/GeneralTabsPanel';
import RewardsHistoryList from '../components/RewardsHistoryList';
import GeneralMessage from '../components/GeneralMessage';
// styles
import { STYLES } from '../Styles';
import { _i } from '../Translations';

class RewardsIndexScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            activeRewardsTab: 'ballots'
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

        const { navigate } = this.props.navigation;

        return (
            <AuthContext.Consumer>{( authContext ) => {
                const { isAuthenticated, toggleAuth } = authContext;

                return (
                    <SafeAreaView style={STYLES.container.default}>
                        <ScrollView style={{flex: 1}}>
                            <RewardsOverview />
                            
                            <View style={STYLES.section.inner_padding_sides}>
                                <RewardsHistoryList />
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                );
            }}</AuthContext.Consumer>
        );
    };

};

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <RewardsIndexScreen {...props} navigation={navigation} />;
}