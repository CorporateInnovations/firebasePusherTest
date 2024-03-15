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
import FormSwitchInput from '../components/FormSwitchInput';
// styles
import { STYLES, VARS } from '../Styles';
import { _i } from '../Translations';

class SampleScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            placeholderFour: true
        };
    }

    _isMounted = false;

    _isLoading = false;

    _someHandler = () => {

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
                                <FormSwitchInput
                                    label={'Enable this thing'}
                                    value={ this.state.placeholderFour }
                                    onValueChange={ newValue => this.setState({ placeholderFour: newValue })}
                                />
                            </View>
                        </ScrollView>
                    </SafeAreaView>
                );
            }}</UserContext.Consumer>
        );
    };

};

SampleScreen.contextType = UserContext;

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <SampleScreen {...props} navigation={navigation} />;
}