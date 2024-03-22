/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/
// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Dimensions, StyleSheet, Alert } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// https://www.npmjs.com/package/react-native-video
import VideoPlayer from 'react-native-video-player';
// local components
//import GeneralIcon from '../components/GeneralIcon';
// context
import { LearnContext } from '../context/LearnContext';
// config
import { STYLES, VARS } from '../Styles';
import {_i} from '../Translations';
import CONFIG from '../Config';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * LearnModulePartVideo Class
 ******************************************************************************/
class LearnModulePartVideo extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {

        };
    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        return (
            <View style={{marginBottom: VARS.spacer.small}}>
                 <VideoPlayer
                    video={{ uri: this.props.part?.structure?.video_url }}
                    poster={`${CONFIG.assets.host.learn[CONFIG.env.learn]}/${this.props.part?.structure?.video_image_url}`}
                    posterResizeMode={'cover'}
                    videoWidth={1600}
                    videoHeight={900}
                    onEnd={() => this.props.enableNext()}
                />
            </View>
        );
    }
}

LearnModulePartVideo.contextType = LearnContext;

const styles = StyleSheet.create({

});

export default function( props ) {

    const navigation = useNavigation();

    return <LearnModulePartVideo {...props} navigation={navigation} />;
}
