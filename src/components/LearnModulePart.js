/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/
// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, ScrollView, Text, Dimensions, StyleSheet, ImageBackground, Alert } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// Google Analytics
// import firebase from '@react-native-firebase/app';
// import analytics from '@react-native-firebase/analytics'
// local components
import LearnModulePartVideo from '../components/LearnModulePartVideo';
import LearnModulePartFacts from '../components/LearnModulePartFacts';
import LearnModulePartQuestions from '../components/LearnModulePartQuestions';
import LearnModulePartAccordion from '../components/LearnModulePartAccordion';
import LearnModulePartSummary from '../components/LearnModulePartSummary';
import LearnModulePartPage from '../components/LearnModulePartPage';
import LearnModulePartDownload from '../components/LearnModulePartDownload';
import LearnModulePartCustom from '../components/LearnModulePartCustom';
import ButtonBlock from '../components/ButtonBlock';
import GeneralHTML from '../components/GeneralHTML';
// context
import { LearnContext } from '../context/LearnContext';
// config
import { STYLES, VARS, CSS } from '../Styles';
import {_i} from '../Translations';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * LearnModulePart Class
 ******************************************************************************/
class LearnModulePart extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            enable_next: false,
            tempQuizPayload: null,
            showPartHeader: true
        };
    }

    async completedLearnModuleEvent(title, userId) {
        // await analytics().logEvent('module_complete', {
        //     module_name: title,
        //     uid: userId
        // });
    }

    _enableNext = () => {
        if( this._isMounted ) {
            this.setState({enable_next: true});
        }
    }

    _disableNext = () => {
        if( this._isMounted ) this.setState({enable_next: false});
    }

    _submit = () => {


        if( !this.state.enable_next) {
            Alert.alert('Whoops!', 'Complete the task to proceed to the next step');
            return;
        }

        //if(!this.context.isAccreditation) {
            this.props.onSubmitEvent(this.state.tempQuizPayload);
        //}


        if(this._isMounted) this.setState({tempQuizPayload: null});

    }

    _outputPart = () => {
        switch(this.props.part?.type) {
            case 'watch':
                return ( <LearnModulePartVideo part={this.props.part} enableNext={this._enableNext} disableNext={this._disableNext} /> );
            case 'facts':
                return ( <LearnModulePartFacts part={this.props.part} enableNext={this._enableNext} disableNext={this._disableNext} /> );
            case 'quiz':
                    return ( <LearnModulePartQuestions part={this.props.part} quizComplete={this._quizComplete} enableNext={this._enableNext} disableNext={this._disableNext} onQuestionAnswered={this.props.onQuestionAnswered} /> );
            case 'accordian':
                return ( <LearnModulePartAccordion part={this.props.part} enableNext={this._enableNext} disableNext={this._disableNext} /> );
            case 'summary':
                return ( <LearnModulePartSummary part={this.props.part} enableNext={this._enableNext} disableNext={this._disableNext} /> );
            case 'page':
                return ( <LearnModulePartPage part={this.props.part} enableNext={this._enableNext} disableNext={this._disableNext} /> );
            case 'custom':
                return ( <LearnModulePartCustom part={this.props.part} enableNext={this._enableNext} disableNext={this._disableNext} /> );
            case 'download':
                return ( <LearnModulePartDownload part={this.props.part} enableNext={this._enableNext} disableNext={this._disableNext} /> );
            default:
                return (<></>);
        }
    }

    _quizComplete = payload => {
        if(this._isMounted)  {
            this.setState({tempQuizPayload: payload});
            this.props.onSubmitEvent(this.state.tempQuizPayload);
            if(this._isMounted) {
                this.setState({tempQuizPayload: null});
            }
        }
    }

    _finalPart = () => {
        return ( this.props.partIndex + 1 ) === this.context.currentModule?.parts?.length;
    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    _IsAccreditation() {
        return this.context.isAccreditation;
    }

    render() {

        const {navigate} = this.props.navigation;

        return (
            <View style={{...STYLES.container.default, flex: 1}}>
                <ScrollView style={{flex:1}}>
                    <View style={{...STYLES.section.large, flex: 1, paddingBottom: 100}}>
                        <View style={{marginBottom: VARS.spacer.small}}>
                            <Text style={{...STYLES.text.heading4, color: VARS.colors.pink.default }}>{this.props.part?.title}</Text>
                        </View>
                        <GeneralHTML html={this.props.part?.structure?.top_text} />
                        {this._outputPart()}
                        <GeneralHTML html={this.props.part?.structure?.side_text} />
                    </View>
                </ScrollView>
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', padding: VARS.spacer.large, backgroundColor: VARS.colors.white}}>
                    {
                        !this._finalPart() &&
                        <ButtonBlock
                            color={ this.state.enable_next ? 'yellow' : 'disabled' }
                            label={ this.state.enable_next ? _i('Next') : _i('Complete to Proceed') }
                            xAdjust={36}
                            onPressEvent={ () => this._submit() }
                            disabled={!this.state.enable_next}
                        />
                    }
                    {
                        this._finalPart() && !this._IsAccreditation() &&
                        <ButtonBlock
                            color={ 'pink' }
                            label={ _i('Back to Learn') }
                            xAdjust={36}
                            onPressEvent={ () => {this.completedLearnModuleEvent(this.props.moduleSlug, this.props.userId), this._submit()} }
                        />
                    }
                </View>
            </View>
        );
    }
}

LearnModulePart.contextType = LearnContext;

const styles = StyleSheet.create({

});

export default function( props ) {
    const navigation = useNavigation();
    return <LearnModulePart {...props} navigation={navigation} />;
}
