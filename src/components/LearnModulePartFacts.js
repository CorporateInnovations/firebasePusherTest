/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/
// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Dimensions, StyleSheet, ImageBackground } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// https://www.npmjs.com/package/react-native-video
import VideoPlayer from 'react-native-video-player';
// local components
import GeneralHTML from '../components/GeneralHTML';
// context
import { LearnContext } from '../context/LearnContext';
// config
import { STYLES, VARS } from '../Styles';
import {_i} from '../Translations';
import CONFIG from '../Config';
import { TouchableOpacity } from 'react-native-gesture-handler';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * LearnModulePartFacts Class
 ******************************************************************************/
class LearnModulePartFacts extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            currentFactIndex: 0,
            hasNext: true,
            hasPrev: false,
            currentFact: null
        };

    }

    _isMounted = false;

    _loadNext = () => {

        if(this.props.part.structure.facts.length === 1){
            this.setState({
                hasNext: false
            })
            this.props.enableNext();
            return;
        }

        const newIndex = this.state.currentFactIndex + 1;

        if((newIndex + 1) == this.props.part.structure.facts.length) {
            this.props.enableNext();
        }

        if( this._isMounted ) {
            this.setState({
                currentFactIndex: newIndex,
                hasNext: ( newIndex + 1 ) < this.props.part.structure.facts.length,
                hasPrev: newIndex > 0,
                currentFact: this.props.part.structure.facts[newIndex]
            })
        }
    }

    _loadPrev = () => {

        if( this.state.currentFactIndex === 0 ) {
            return;
        }

        const newIndex = this.state.currentFactIndex - 1;

        if( this._isMounted ) {
            this.setState({
                currentFactIndex: newIndex,
                hasNext: newIndex < this.props.part.structure.facts.length,
                hasPrev: newIndex > 0,
                currentFact: this.props.part.structure.facts[newIndex]
            })
        }
    }

    _getMediaUrl = path => {

        if( typeof path !== 'string' ) return '';

        return path.includes('http') ? path : `${CONFIG.assets.host.learn[CONFIG.env.learn]}/${path}`;

    }

    _getFactContent = () => {
        const facts = Array.isArray(this.props.part?.structure?.facts) && this.props.part?.structure?.facts?.length > 0 ? this.props.part?.structure?.facts : [];
        const fact = facts[this.state.currentFactIndex];

        if(!fact) {
            return (<></>);
        }

        return (
            <View style={styles.factCard}>
                {
                    fact.video_url &&
                    <VideoPlayer
                        video={{ uri: this._getMediaUrl(fact.video_url) }}
                        poster={ this._getMediaUrl(fact.image_url)}
                        posterResizeMode={'cover'}
                        videoWidth={1600}
                        videoHeight={900}
                    />
                }
                {
                    !fact.video_url && fact.image_url &&
                    <ImageBackground
                        source={{uri: this._getMediaUrl(fact.image_url) }}
                        style={styles.factImage}
                    />
                }

                <View style={styles.factInner}>
                    <View style={{marginBottom:VARS.spacer.small}}>
                        <Text style={{...STYLES.text.body_bold, color: VARS.colors.pink.default }}>{`${this.state.currentFactIndex + 1}/${this.props.part.structure.facts.length}`}</Text>
                    </View>
                    {
                        fact.content &&
                        <GeneralHTML html={fact.content} />
                    }
                    <View style={styles.factActions}>
                        <TouchableOpacity
                            onPress={() => this._loadPrev()}
                            disabled={!this.state.hasPrev}
                            style={{...styles.factButton, marginRight: 10, backgroundColor: !this.state.hasPrev ? VARS.colors.gray.light : VARS.colors.yellow.default}}
                        >
                            <Text style={styles.factButtonText}>Prev</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this._loadNext()}
                            disabled={!this.state.hasNext}
                            style={{...styles.factButton, marginLeft: 10, backgroundColor: !this.state.hasNext ? VARS.colors.gray.light : VARS.colors.yellow.default}}
                        >
                            <Text style={styles.factButtonText}>Next</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted) {
            this.setState({
                currentFact: Array.isArray(this.props.part?.structure?.facts) && this.props.part.structure.facts.length > 0 ? this.props.part.structure.facts[0] : null
            });
        }


    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        return (
            <View style={{marginBottom: VARS.spacer.small}}>
                {
                    this._getFactContent()
                }
            </View>
        );
    }
}

LearnModulePartFacts.contextType = LearnContext;

const styles = StyleSheet.create({
    factContainer: {

    },
    factCard: {
        width: '100%',
    },
    factImage: {
        width: '100%',
        height: 200,
    },
    factInner: {
        padding: VARS.spacer.small,
        backgroundColor: '#F0F0F0'
    },
    factActions: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        //alignContent: 'center',
        //justifyContent: 'space-between',
        //width: '100%',
    },
    factButton: {
        flex: 1,
        flexShrink: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: ((DIMENSIONS.width - (2 * VARS.spacer.small) - (2 * VARS.spacer.large)) / 2) - 10,
        height: 36,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 4,
        backgroundColor: VARS.colors.yellow.default
    },
    factButtonText: {
        fontFamily: VARS.fonts.family.darwin_bold,
        textTransform: 'uppercase',
        fontSize: VARS.fonts.size.body,
        letterSpacing: 1,
        textAlign: 'center',
        color: VARS.colors.white
    }
});

export default function( props ) {

    const navigation = useNavigation();

    return <LearnModulePartFacts {...props} navigation={navigation} />;
}
