// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// external imports
import LinearGradient from 'react-native-linear-gradient';
// Google Analytics
// import firebase from '@react-native-firebase/app';
// import analytics from '@react-native-firebase/analytics'
// context
import { AuthContext } from '../context/AuthContext';
// local components
import AccountOverview from '../components/AccountOverview';
import SectionHeading from '../components/SectionHeading';
import NewsPostsLatest from '../components/NewsPostsLatest';
import RewardsBallotsList from '../components/RewardsBallotsList';
import TopOffersWidget from '../components/TopOffersWidget';
// styles
import { STYLES, VARS } from '../Styles';
import { _i } from '../Translations';

class AccountDashboardScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            foo: 'bar'
        };
    }

    _isMounted = false;

    _isLoading = false;

    async componentDidMount() {

        this._isMounted = true;

        // await firebase.app();
        // analytics().setCurrentScreen('Dashboard - Overview screen', 'dashboard_overview');

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
                        <ScrollView>
                            
                            <AccountOverview />

                            <LinearGradient colors={STYLES.gradients.orange} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={STYLES.section.large}>
                                <SectionHeading
                                    heading={'News'}
                                    textColor={VARS.colors.white}
                                    linkColor={VARS.colors.yellow.default}
                                    stack={'tab.news'}
                                    screen={'news.index'}
                                />
                                <NewsPostsLatest />
                            </LinearGradient>

                            <TopOffersWidget />

                            <LinearGradient colors={STYLES.gradients.navy} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{paddingTop: VARS.spacer.large,paddingBottom: VARS.spacer.large}}>
                                <View style={{paddingLeft: VARS.spacer.large,paddingRight: VARS.spacer.large,}}>
                                    <SectionHeading
                                        heading={_i('Ballots')}
                                        textColor={VARS.colors.white}
                                        linkColor={VARS.colors.yellow.default}
                                        stack={'main.menu'}
                                        screen={'ballots.index'}
                                    />
                                </View>
                                <RewardsBallotsList mode={'horizontal'} />
                            </LinearGradient>
                            
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

    return <AccountDashboardScreen {...props} navigation={navigation} />;
}