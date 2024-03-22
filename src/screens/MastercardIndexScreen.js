// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
import { ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
// external imports
import LinearGradient from 'react-native-linear-gradient';
// context
import { UserContext } from '../context/UserContext';
// local components
import MastercardOverview from '../components/MastercardOverview';
import MastercardTransactionsList from '../components/MastercardTransactionsList';
import GeneralMessage from '../components/GeneralMessage';
// styles
import { STYLES, VARS } from '../Styles';
// translations
import { _i } from '../Translations';
import _ from 'lodash';

class MastercardIndexScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            foo: 'bar'
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
            <UserContext.Consumer>{( userContext ) => {
                const { profile, rewardsTransfer, transferRewardsBalance, claimBookingShow, accountData, mastercardError } = userContext;


                if( !accountData ) {
                    return (
                        <SafeAreaView style={styles.container}>
                            <View style={STYLES.section.large}>
                                <GeneralMessage color={STYLES.colors.navy.default} message={ mastercardError || _i('Mastercard Error') } />
                            </View>
                        </SafeAreaView>
                    );
                }

                const accounts = _.get( accountData, 'full_details.accounts', [] );

                if( !Array.isArray( accounts ) || accounts.length === 0 ) {
                    return (
                        <SafeAreaView style={styles.container}>
                            <View style={STYLES.section.large}>
                                <GeneralMessage color={STYLES.colors.navy.default} message={ _i('No Mastercard') } />
                            </View>
                        </SafeAreaView>
                    );
                }

                return (
                    <SafeAreaView style={STYLES.container.default}>
                        <MastercardTransactionsList />
                    </SafeAreaView>
                );
            }}</UserContext.Consumer>
        );
    };

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

MastercardIndexScreen.contextType = UserContext;

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <MastercardIndexScreen {...props} navigation={navigation} />;
}