// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { SafeAreaView, StyleSheet, Animated, Easing, Alert, View, Linking } from 'react-native';
// https://www.npmjs.com/package/react-native-deep-linking
import DeepLinking from 'react-native-deep-linking';
// https://github.com/react-native-netinfo/react-native-netinfo
import NetInfo from "@react-native-community/netinfo";
// external imports
import LinearGradient from 'react-native-linear-gradient';
// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );
// https://lodash.com/
import _ from 'lodash';
import { _i } from '../Translations';
// context
import { AuthContext } from '../context/AuthContext';
// local components
import GeneralMessage from '../components/GeneralMessage';
import ButtonBlock from '../components/ButtonBlock';
// local vars
import { STYLES } from '../Styles';

export default class AuthLoadingScreen extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            isLoading: true,
            rotationValue: new Animated.Value(0),
            loadFailed: false,
        };
    }

    _isMounted = false;

    _isLoading = false;

    _ConnectionAlert = false;

    _startAnimation = () => {

        this.state.rotationValue.setValue(0);

        Animated.timing(
            this.state.rotationValue,
            {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
            .start(() => {
                this._startAnimation();
            });

    }

    _init = async () => {

        if( this._isMounted ) {
            this.setState({ loadFailed: false });
        }

        // initiall test the connection
        const { isConnected } = await NetInfo.fetch();

        if( !isConnected ) {
            // make sure this alertPresent flag is correctly set always because Alerts will stack otherwise
            if( !this.alertPresent ) {
                this.alertPresent = true;
                Alert.alert(
                    _i('No Connection'),
                    _i('Please connect to wifi or a data network and try again'),
                    [
                        {
                            text: 'OK', 
                            onPress: () => { this.alertPresent = false }
                        }
                    ],
                    { 
                        cancelable: false 
                    }
                );
            }

            if( this._isMounted ) {
                this.setState({ loadFailed: true });
            }

            return;
        }

        try {
            
            // get tyhe auth preference
            const preference = await this.context.getAuthPreference();
            const phoenixMeta = await this.context.getPhoenixMeta();

            if( !_.get( phoenixMeta, 'success', false ) ) {
                throw 'Error getting csrf token from Phoenix';
            }

            // navigate to login
            this.props.navigation.navigate('login.login');

        } catch( error ) {
            Alert.alert( _i('Sorry!'), _i('The app was unable to connect to Club Royal. Please try again later.') );

            if( this._isMounted ) {
                this.setState({ loadFailed: true });
            }
        }
    }

    componentDidMount() {

        this._isMounted = true;

        this._startAnimation();

        this._init();

    }

    componentWillUnmount() {

        this._isMounted = false;

    }

    render() {

        const AnimatedIcon = Animated.createAnimatedComponent( Icon );

        let spinTransition = this.state.rotationValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
        });

        return (
            <AuthContext.Consumer>{( authContext ) => {
                const { isAuthenticated, toggleAuth } = authContext;

                return (
                    <LinearGradient colors={STYLES.gradients.purple} start={STYLES.gradients.top} end={STYLES.gradients.bottom} style={{ flex: 1 }}>
                        <SafeAreaView style={styles.container}>
                            { !this.state.loadFailed &&
                                <AnimatedIcon
                                    name={ 'rc-icon-loading' }
                                    size={ 60 }
                                    color={ STYLES.colors.white }
                                    style={{
                                        transform: [{ rotate: spinTransition }]
                                    }}
                                />
                            }
                            {
                                this.state.loadFailed &&
                                <View style={STYLES.section.large}>
                                    <GeneralMessage textColor={STYLES.colors.white} message={ _i('Unable to load, please try again later') } />
                                    <ButtonBlock
                                        color={'yellow'}
                                        label={_i('Try Again')}
                                        xAdjust={36}
                                        onPressEvent={ () => this._init() }
                                    />
                                </View>
                            }
                        </SafeAreaView>
                    </LinearGradient>
                );
            }}</AuthContext.Consumer>
        );
    };

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
});

AuthLoadingScreen.contextType = AuthContext;