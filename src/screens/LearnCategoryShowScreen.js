// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// external imports
import LinearGradient from 'react-native-linear-gradient';
// context
import { LearnContext } from '../context/LearnContext';
// styles
import { STYLES } from '../Styles';
import { _i } from '../Translations';

class LearnCategoryShowScreen extends React.Component {

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
            <LearnContext.Consumer>{( learnContext ) => {
                return (
                    <SafeAreaView style={STYLES.container.default}>
                        <ScrollView>
                            <Text>LearnCategoryShowScreen</Text>
                        </ScrollView>
                    </SafeAreaView>
                );
            }}</LearnContext.Consumer>
        );
    };

};

LearnCategoryShowScreen.contextType = LearnContext;

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <LearnCategoryShowScreen {...props} navigation={navigation} />;
}