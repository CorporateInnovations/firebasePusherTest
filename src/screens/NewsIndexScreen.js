// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// external imports
import LinearGradient from 'react-native-linear-gradient';

// context
import { NewsContext } from '../context/NewsContext';

// local config
import { STYLES, VARS } from '../Styles';

// components
import NewsPostsLists from '../components/NewsPostsList';

class NewsIndexScreen extends React.Component {

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
            <NewsContext.Consumer>{( newsContext ) => {
                return (
                    <LinearGradient colors={STYLES.gradients.orange} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
                        <SafeAreaView style={STYLES.container.default}>
                            <View style={{}}>
                                <NewsPostsLists />
                            </View>
                        </SafeAreaView>
                    </LinearGradient>
                );
            }}</NewsContext.Consumer>
        );
    };

};

    // Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <NewsIndexScreen {...props} navigation={navigation} />;
}