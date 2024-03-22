/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/
// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Dimensions, StyleSheet, Linking } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// https://github.com/vivaxy/react-native-auto-height-image
import AutoHeightImage from 'react-native-auto-height-image';
// local components
import GeneralHTML from '../components/GeneralHTML';
import ButtonBlock from '../components/ButtonBlock';
// context
import { LearnContext } from '../context/LearnContext';
// config
import { STYLES, VARS } from '../Styles';
import {_i} from '../Translations';
import CONFIG from '../Config';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * LearnModulePartDownload Class
 ******************************************************************************/
export default class LearnModulePartDownload extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {

        };
    }

    _isMounted = false;

    _enableTimeout = null;

    _getMediaUrl = path => {

        if( typeof path !== 'string' ) return '';

        return path.includes('http') ? path : `${CONFIG.assets.host.learn[CONFIG.env.learn]}/${path}`;

    }

    componentDidMount() {
        this._isMounted = true;
        
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
            <View style={{marginBottom: VARS.spacer.small}}>
                {
                    this.props.part?.structure?.download?.image_url &&
                    <AutoHeightImage
                        style={{flex: 0, marginBottom: VARS.spacer.small}}
                        width={DIMENSIONS.width - (2 * VARS.spacer.large)}
                        source={{uri: this._getMediaUrl(this.props.part?.structure?.download?.image_url)}}
                    />
                }
                {
                    this.props.part?.structure?.download?.text &&
                    <GeneralHTML html={this.props.part?.structure?.download?.text} />
                }
                {
                    this.props.part?.structure?.download?.download_url &&
                    <ButtonBlock
                        color={'yellow'}
                        label={_i('Download')}
                        xAdjust={36}
                        onPressEvent={ () => Linking.openURL(this._getMediaUrl(this.props.part?.structure?.download?.download_url)) }
                    />
                }
            </View>
        );
    }
}

LearnModulePartDownload.contextType = LearnContext;

const styles = StyleSheet.create({
   
});
