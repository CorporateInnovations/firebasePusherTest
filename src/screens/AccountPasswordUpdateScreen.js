// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';

import { AuthContext } from '../context/AuthContext';
import { TouchableHighlight } from 'react-native-gesture-handler';

class AccountPasswordUpdateScreen extends React.Component {

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
            <AuthContext.Consumer>{( authContext ) => {
                const { isAuthenticated, toggleAuth } = authContext;

                return (
                    <SafeAreaView>
                        <View>
                            <View>
                                <Text>update password</Text>
                            </View>
                        </View>
                    </SafeAreaView>
                );
            }}</AuthContext.Consumer>
        );
    };

};

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <AccountPasswordUpdateScreen {...props} navigation={navigation} />;
}