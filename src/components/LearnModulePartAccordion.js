/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/
// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Dimensions, StyleSheet, Alert, ImageBackground } from 'react-native';
// https://github.com/vivaxy/react-native-auto-height-image
import AutoHeightImage from 'react-native-auto-height-image';
// local components
import GeneralHTML from '../components/GeneralHTML';
import GeneralIcon from '../components/GeneralIcon';
// context
import { LearnContext } from '../context/LearnContext';
// config
import { STYLES, VARS } from '../Styles';
import {_i} from '../Translations';
import CONFIG from '../Config';
import { TouchableOpacity } from 'react-native-gesture-handler';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * LearnModulePartAccordion Class
 ******************************************************************************/
export default class LearnModulePartAccordion extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            accordions: []
        };
    }

    _isMounted = false;


    _getMediaUrl = path => {

        if( typeof path !== 'string' ) return '';

        return path.includes('http') ? path : `${CONFIG.assets.host.learn[CONFIG.env.learn]}/${path}`;

    }

    _activateAccordion = activeIndex => {

        this.props.enableNext();
        
        const accordions = this.state.accordions;

        accordions.forEach((item, index) => {
            item.active = index == activeIndex;
        })

        if(this._isMounted) this.setState({accordions});
    }

    _setAccordions = () => {
        const accordions = this.props.part?.structure?.accordian?.sections;

        if(!Array.isArray(accordions) || accordions.length === 0) return null;

        this.state.accordions.forEach((item, index) => {
            item.active = index === 0;
        })

        if(this._isMounted) this.setState({accordions});
    }

    _renderAccordions = () => {

        return this.state.accordions.map((accordion, index) => (

            <View
                style={styles.accordion}
                key={index.toString()}
            >
                <TouchableOpacity
                    onPress={() => this._activateAccordion(index)}
                    style={styles.accordionButton}
                    disabled={accordion.active}
                >
                    <View style={styles.accordionButtonInner}>
                        <View style={{flex: 0, flexGrow: 1, flexShrink: 1}}>
                            <Text style={STYLES.text.body_bold}>{accordion.title}</Text>
                        </View>
                        <GeneralIcon icon={accordion.active ? 'rp-icon-chevron-up' : 'rp-icon-chevron-down'} size={15} color={ STYLES.colors.navy.default } style={{marginLeft: 10, flexGrow: 0, flexShrink: 0}} />
                    </View>
                </TouchableOpacity>
                {
                    accordion.active &&
                    <View style={styles.accordionInner}>
                        {
                            accordion.content.image_url &&
                            <AutoHeightImage
                                style={{flex: 0}}
                                width={DIMENSIONS.width - (2 * VARS.spacer.small) - (2 * VARS.spacer.large)}
                                source={{uri: this._getMediaUrl(accordion.content.image_url)}}
                            />
                        }
                        <View style={styles.answerContent}>
                            <GeneralHTML html={accordion.content.text} />
                        </View>
                    </View>
                }
            </View>

        ));
    }

    _enableTimeout = null;

    componentDidMount() {
        this._isMounted = true;
        this._setAccordions();
        
        if(this._enableTimeout) clearTimeout(this._enableTimeout);

        this._enableTimeout = setTimeout(() => {
            this.props.enableNext();
        }, 1000);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        return (
            <View>
                {
                    this.state.accordions.length > 0 &&
                    this._renderAccordions()
                }
            </View>
        );
    }
}

LearnModulePartAccordion.contextType = LearnContext;

const styles = StyleSheet.create({
    accordion: {
        flex: 0,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: DIMENSIONS.width - (2 * VARS.spacer.large),
        marginBottom: 10,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
    },
    accordionButton: {
        flex: 0,
        width: '100%',
    },
    accordionButtonInner: {
        width: DIMENSIONS.width - (2 * VARS.spacer.large),
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding:VARS.spacer.small,
    },
    accordionInner: {
        flex: 0,
        width: '100%',
        paddingHorizontal: VARS.spacer.small,
    }
});
