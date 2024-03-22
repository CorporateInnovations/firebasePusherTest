/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/
// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Dimensions, StyleSheet, ImageBackground, TouchableOpacity, Alert } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
// local components
import GeneralIcon from '../components/GeneralIcon';
// context
import { LearnContext } from '../context/LearnContext';
// config
import { STYLES, VARS } from '../Styles';
import { _i } from '../Translations';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * LearnModuleOverview Class
 ******************************************************************************/
class LearnModuleOverview extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            cardWidth: ( DIMENSIONS.width - ( ( 2 * VARS.spacer.large ) + VARS.spacer.xsmall ) ) / 2,
        };
    }

    _isMounted = false;

    _handleClick = () => {

        if( this.props.module?.locked ) return Alert.alert(_i('Locked!'), _i('You need to be in at least the %s tier to access this module.', { "%s": this.props.module?.tierName}))

        this.props.navigation.navigate( 'learn.module.show', { moduleId: this.props.module?.id, moduleTitle: this.props.module?.title } )
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
            <TouchableOpacity
                onPress={ () => this._handleClick() }
                style={{
                    width: this.state.cardWidth,
                    marginRight: this.props.last ? VARS.spacer.large : VARS.spacer.xsmall,
                }}
            >
                <View style={{flex: 1, flexGrow: 1, paddingBottom: VARS.spacer.small }}>
                    <ImageBackground
                        defaultSource={ require('../../assets/images/placeholder-800-600-yellow.png') }
                        source={{ uri: this.props.module?.thumbnail }}
                        resizeMode='cover'
                        style={{
                            width: this.state.cardWidth,
                            height: this.state.cardWidth * 0.7,
                            marginBottom: 5
                        }}
                    >
                        {
                            this.props.module?.locked &&
                            <View style={{ flex: 1, flexDirection: 'column', alignContent: 'center', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', backgroundColor: 'rgba(113,197,232,0.8)'}}>
                                <GeneralIcon icon={'rp-icon-locked'} size={20} color={ STYLES.colors.navy.default } style={{marginBottom: 5}} />
                                <Text style={{ ...STYLES.text.body_bold, color: STYLES.colors.navy.default }}>{ this.props.module?.tierName }</Text>
                            </View>
                        }
                        {
                            this.props.module?.completed &&
                            <View style={{ flex: 1, position: 'relative'}}>
                                <View style={styles.completed}>
                                    <GeneralIcon icon={'rp-check'} size={20} color={ STYLES.colors.white } />
                                </View>
                            </View>
                        }
                    </ImageBackground>
                    <Text style={{...STYLES.text.body_light, color: STYLES.colors.white }}>{ this.props.module?.title }</Text>
                </View>
                <View style={{flex: 0, width: 50, height: 2, backgroundColor: 'rgba(255,255,255,0.3)'}}></View>
            </TouchableOpacity>
        );
    }
}

LearnModuleOverview.contextType = LearnContext;

const styles = StyleSheet.create({
    completed: {
        position: 'absolute',
        top: 8,
        right: 8,
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        height: 30, width: 30,
        borderRadius: 15,
        backgroundColor: VARS.colors.green.default,
        shadowColor: '#171717',
        shadowOffset: {width: 0, height: 0},
        shadowOpacity: 0.4,
        shadowRadius: 5,
    }
});

export default function( props ) {

    const navigation = useNavigation();

    return <LearnModuleOverview {...props} navigation={navigation} />;
}
