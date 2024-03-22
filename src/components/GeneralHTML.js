/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Dimensions } from 'react-native';
// https://meliorence.github.io/react-native-render-html/docs/intro
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
const systemFonts = [...defaultSystemFonts, 'DarwinW00-Light', 'Darwin-Bold'];

// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

// config
import { CSS, VARS } from '../Styles';
const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * GeneralHTML Class
 ******************************************************************************/
export default class GeneralHTML extends React.Component {

    render() {

        if( !this.props.html ) return (<></>);

        return (
            <View style={{marginBottom: VARS.spacer.small}}>
                <RenderHtml
                    contentWidth={DIMENSIONS.width - 72}
                    source={{ html: this.props.html }}
                    enableExperimentalMarginCollapsing={true}
                    tagsStyles={CSS}
                    systemFonts={systemFonts}
                />
            </View>
        );
    }
}
