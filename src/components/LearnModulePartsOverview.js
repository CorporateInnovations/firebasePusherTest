/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/
// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Dimensions, StyleSheet, FlatList } from 'react-native';
// lodash
import _ from 'lodash';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
// local components
import GeneralIcon from '../components/GeneralIcon';
// context
import { LearnContext } from '../context/LearnContext';
// config
import { STYLES, VARS } from '../Styles';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * LearnModulePartsOverview Class
 ******************************************************************************/
class LearnModulePartsOverview extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            sanitizedParts: null,
        };
    }

    _isMounted = false;

    _renderItem = ({ item, index }) => {

    };

    _renderParts = () => {
        // only correctly formed and non-empty arrays permitted
        if( !Array.isArray( this.context.currentModule?.parts ) || this.context.currentModule?.parts.length === 0 ) return null;
        // we must exclude the summaries for output because we don't want to provide a preview of that step
        // use the existing rendered version if it's available
        const parts = !this.state.sanitizedParts ? this.context.currentModule.parts : this.state.sanitizedParts;

        //if( this._isMounted ) this.setState({ sanitizedParts: parts });

        return parts.map(( item, index ) => {
            return (
                <View
                    key={item.key}
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                        flexWrap: 'nowrap',
                        width: '100%',
                    }}
                >
                    <View
                        style={{
                            width: 40,
                        }}
                    >
                        <View
                            style={{
                                flex: 0,
                                alignContent: 'center',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexGrow: 0,
                                flexShrink: 0,
                                height: 40,
                                width: 40,
                                borderRadius: 20,
                                backgroundColor: STYLES.colors.white
                            }}
                        >
                            <Text style={{ ...STYLES.text.heading4, color: STYLES.colors.purple.default, textAlign: 'center' }}>{item.key}</Text>
                        </View>
                        {
                            index < ( parts.length - 1 ) &&
                            <View style={{ flex: 1, width: 40, flexShrink: 0 , alignContent: 'stretch' }}>
                                <View style={{ flexGrow: 1, width: 2, marginLeft: 19, backgroundColor: STYLES.colors.white }}></View>
                            </View>
                        }
                    </View>
                    <View
                        style={{
                            flexShrink: 1,
                            alignContent: 'flex-start',
                            justifyContent: 'flex-start',
                            width: '100%',
                            paddingLeft: VARS.spacer.small,
                            paddingBottom: 25,
                            paddingTop: 0,
                        }}
                    >
                        <View style={{marginBottom: 5}}>
                            <Text style={{ ...STYLES.text.heading5, color: STYLES.colors.white, lineHeight: 22, }}>{item.title}</Text>
                        </View>
                        <View>
                            <Text style={{ ...STYLES.text.body_light, color: STYLES.colors.white, lineHeight: 14 }}>{item.activityLabel}</Text>
                        </View>
                    </View>
                </View>
            );
        });
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        return (
            <LearnContext.Consumer>{( learnContext ) => {
                return (
                    <View
                        style={{
                            flex: 0,
                            flexDirection: 'column',
                        }}
                    >
                        { this._renderParts() }
                    </View>
                );
            }}</LearnContext.Consumer>
        );
    }
}

LearnModulePartsOverview.contextType = LearnContext;

const styles = StyleSheet.create({

});

export default function( props ) {

    const navigation = useNavigation();

    return <LearnModulePartsOverview {...props} navigation={navigation} />;
}
