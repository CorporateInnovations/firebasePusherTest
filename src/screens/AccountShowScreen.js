// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// external imports
import LinearGradient from 'react-native-linear-gradient';
// context
import { UserContext } from '../context/UserContext';
// local components
import AccountShow from '../components/AccountShow';
import SectionHeading from '../components/SectionHeading';
import NewsPostsLatest from '../components/NewsPostsLatest';
import MenuItemLink from '../components/MenuItemLink';
// styles
import { STYLES, VARS } from '../Styles';

class AccountShowScreen extends React.Component {

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
            <UserContext.Consumer>{( authContext ) => {

                return (
                    <SafeAreaView style={{...STYLES.container.default, backgroundColor: STYLES.colors.white }}>
                        <ScrollView>
                            <AccountShow />
                            <View style={STYLES.section.large}>
                                <MenuItemLink
                                    type={'basic'}
                                    action={{ type: 'navigate', target: 'account.edit'}}
                                    label={'Edit Account'}
                                    color={STYLES.colors.navy.default}
                                    chevron={true}
                                />
                                <MenuItemLink
                                    type={'basic'}
                                    action={{ type: 'navigate', target: 'account.settings'}}
                                    label={'Settings'}
                                    color={STYLES.colors.navy.default}
                                    chevron={true}
                                />
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                );
            }}</UserContext.Consumer>
        );
    };

};

AccountShowScreen.contextType = UserContext;

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <AccountShowScreen {...props} navigation={navigation} />;
}