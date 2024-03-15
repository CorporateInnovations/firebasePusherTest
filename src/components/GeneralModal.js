/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { StyleSheet, Modal, View, Text, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

import AnimatedView from '../components/AnimatedView';

import { STYLES, VARS } from '../Styles';

/*******************************************************************************
 * GeneralModal Class
 ******************************************************************************/
export default class GeneralModal extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            
        };
    }

    _isMounted = false;

    _renderActions = () => {
        return this.props.actions.map( action => {
            return (
                <TouchableOpacity
                    key={action.key}
                    onPress={ () => action.onPressEvent() }
                    style={{...STYLES.modal.button }}
                >
                    <Text style={{ ...STYLES.modal.button_text, color: action.color }}>{action.label}</Text>
                </TouchableOpacity>
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
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.active}
            >
                <ScrollView contentContainerStyle={STYLES.modal.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{flex:1}}
                >
                    <AnimatedView
                        duration={400}
                        animationName={'fade-in-up'}
                        customStyle={STYLES.modal.panel}
                    >
                        <View style={this.props.style ? {...STYLES.modal.body, ...this.props.style} : STYLES.modal.body}>
                            { this.props.children }
                        </View>
                        <View>
                            { this._renderActions() }
                        </View>
                    </AnimatedView>
                </KeyboardAvoidingView>
                </ScrollView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({

});
