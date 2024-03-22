// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, SafeAreaView, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';

import { OnboardingContext } from '../context/OnboardingContext';
import { AuthContext } from '../context/AuthContext';

import HeadingGroup from '../components/HeadingGroup';
import FormMemwordCreate from '../components/FormMemwordCreate';

// helpers
// https://github.com/react-native-linear-gradient/react-native-linear-gradient
import { _i } from '../Translations';

// styles
import { STYLES } from '../Styles';

class OnboardingMemorableWordScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            memword: '',
            memworddConfirm: '',
            step: 1
        };
    }

    _isMounted = false;

    _isLoading = false;

    _updateOnboardingStatus = async () => {
        
        const status = await this.context.getOnboardingStatus();
        // if status returns an empty array or otherwise falsey response, the context provider itself will setState isOnboarded to true which will auto route the user into the app - no manual navigation required
        if( Array.isArray( status ) && status.length > 0 ) {
            this.props.navigation.navigate( status[0].screen );
        }
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
            <OnboardingContext.Consumer>{( onboardingContext ) => {
                const { totalSteps, renderFields, updateAccount } = onboardingContext;

                return (
                    <SafeAreaView style={STYLES.container.default}>
                        <ScrollView contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                            <KeyboardAvoidingView
                                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                                style={{flex:1, alignItems: 'center', justifyContent: 'center'}}
                            >
                                {
                                    this.state.step === 1 &&
                                    <View style={{...STYLES.section.large, width: '100%', }}>
                                        <HeadingGroup
                                            heading={ _i('Enter a memorable word')}
                                            body={ _i('Enter a memorable word. You’ll need this when making online purchases with your Club Royal Mastercard') }
                                            textColor={ STYLES.colors.navy.default }
                                        />
                                        <FormMemwordCreate buttonLabel={_i('Save')} memwordStored={ memword => this.setState({ step: 2, memword: memword }) } />
                                    </View>
                                }
                                {
                                    this.state.step === 2 &&
                                    <View style={{...STYLES.section.large, width: '100%', }}>
                                        <HeadingGroup
                                            heading={ _i('Re-enter your memorable word')}
                                            body={ _i('Re-enter your memorable word to ensure it’s correct') }
                                            textColor={ STYLES.colors.navy.default }
                                        />
                                        <FormMemwordCreate buttonLabel={_i('Next')} memwordStored={ this._updateOnboardingStatus } back={ () => this.setState({ word: '', step: 1 })} memorableWordCompare={ this.state.memword } />
                                    </View>
                                }
                            </KeyboardAvoidingView>
                        </ScrollView>
                    </SafeAreaView>
                );
            }}</OnboardingContext.Consumer>
        );
    };

};

OnboardingMemorableWordScreen.contextType = OnboardingContext;

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <OnboardingMemorableWordScreen {...props} navigation={navigation} />;
}