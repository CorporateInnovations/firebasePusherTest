// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, ScrollView, Switch } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
// external imports
import LinearGradient from 'react-native-linear-gradient';

// local components
import ContentTerms from '../components/ContentTerms';

// styles
import { STYLES, VARS } from '../Styles';
// translations
import { _i } from '../Translations';
import CONFIG from '../Config';
import { clearErrorLogs, getErrorLogs, errorLoggingEnabled, disableErrorLogging, enableErrorLogging } from '../Helpers';

class MenuTermsScreen extends React.Component {

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
            <LinearGradient colors={STYLES.gradients.purple} start={STYLES.gradients.top} end={STYLES.gradients.bottom} style={{ flex: 1 }}>
                <SafeAreaView style={ STYLES.container.default }>
                    <ScrollView>
                        <ContentTerms />
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>
        );
    };

};

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <MenuTermsScreen {...props} navigation={navigation} />;
}