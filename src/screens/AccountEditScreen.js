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
import ButtonBlock from '../components/ButtonBlock';
// styles
import { STYLES, VARS } from '../Styles';
import { _i } from '../Translations';

class AccountEditScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            foo: 'bar'
        };
    }

    _isMounted = false;

    _isLoading = false;

    _save = () => {
        this.context.updateProfile()
            .then( data => {
                Alert.alert('Thank you', 'Your updates have been saved');
            })
            .catch(error => {
                Alert.alert('Thank you', 'Your updates have been saved');
                //console.warn( 'updateProfile error', error );
            });
    }

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
                    <SafeAreaView style={STYLES.container.default}>
                        <ScrollView>
                            <View style={STYLES.section.large}>
                                <View style={ STYLES.text.paragraph }>
                                    <Text style={{ ...STYLES.text.heading5, paddingBottom: VARS.spacer.xsmall }}>{ _i('Profile Information') }</Text>
                                    <Text style={{ ...STYLES.text.body_light }}>{ _i('After you have completed updating your profile information, don\'t forget to tap Save!') }</Text>
                                </View>
                                { renderFields('profile') }
                                <ButtonBlock
                                    color={'yellow'}
                                    label={_i('Save')}
                                    xAdjust={36}
                                    onPressEvent={ () => this._save() }
                                />
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                );
            }}</UserContext.Consumer>
        );
    };

};

AccountEditScreen.contextType = UserContext;

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <AccountEditScreen {...props} navigation={navigation} />;
}