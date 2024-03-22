// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, ScrollView, Alert } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// external imports
import LinearGradient from 'react-native-linear-gradient';
// context
import { UserContext } from '../context/UserContext';
// local components
import RewardsBallotsList from '../components/RewardsBallotsList';
// styles
import { STYLES, VARS } from '../Styles';
import { _i } from '../Translations';

class BallotsListScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            
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
                const { renderFields } = userContext;
                return (
                    <LinearGradient colors={STYLES.gradients.navy} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
                        <SafeAreaView style={ STYLES.container.default }>
                            <RewardsBallotsList mode={'vertical'}  />
                        </SafeAreaView>
                    </LinearGradient>
                );
            }}</UserContext.Consumer>
        );
    };

};

BallotsListScreen.contextType = UserContext;

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <BallotsListScreen {...props} navigation={navigation} />;
}