// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, SafeAreaView, Alert, AppState } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
// external imports
import LinearGradient from 'react-native-linear-gradient';
// local components
import LoadingSpinner from '../components/LoadingSpinner';
import GeneralMessage from '../components/GeneralMessage';
import LearnModulePart from '../components/LearnModulePart';
import LearnProgressBar from '../components/LearnProgressBar';
import LearnProgressBarTimed from '../components/LearnProgressBarTimed';
// context
import { LearnContext } from '../context/LearnContext';
// services
import * as LearnService from '../services/learn';
// styles
import { STYLES } from '../Styles';
import { _i } from '../Translations';

class LearnAccreditationPartShowScreen extends React.Component {

    constructor( props ) {

        super( props );

        const { moduleId, moduleTitle, partIndex } = props.route.params;

        this.state = {
            moduleId,
            moduleTitle,
            partIndex,
            nextPartIndex: null,
            initiated: false,
            questionPayload: {}
        };
    }

    _init = async () => {
        await this.context.resetCurrentModule();
        await this.context.getUserLearnModule( this.state.moduleId );
        this.context.setIsAccreditation(true);


        if(
            isNaN(this.state.partIndex) ||
            !Array.isArray(this.context.currentModule.parts) ||
            this.context.currentModule.parts.length < this.state.partIndex
        ) {
            console.log('error');
            // error
            // TODO: deal with malformed part
            await this.setState({ initiated: true });
            return;
        }

        const part = this.context.currentModule.parts[this.state.partIndex];

        const nextPartIndex = this.state.partIndex + 1;

        const nextPart = nextPartIndex < this.context.currentModule.parts.length ? this.context.currentModule.parts[nextPartIndex] : null;
        const isFinalPart = nextPartIndex === this.context.currentModule.parts.length;

        const hasQuestions = Array.isArray(part?.questions) && part.questions.length > 0;

        if( !part ) {
            // god only knows
            await this.setState({ initiated: true });
            return;
        }

        if( this._isMounted ) {
            this.setState({
                part: part,
                nextPart: nextPart,
                nextPartIndex: nextPartIndex,
                isFinalPart: isFinalPart,
                initiated: true,
                hasQuestions: hasQuestions,
                questionIndex: 0
            })
        }

        // starts a timer that keeps a record of user activity on this part
        this.context.startTimer( part.module_id, part.id );

    }

    _completePart = async (quizPayload, timeUp) => {
console.log('_completedPart');
        await this.context.endCurrentTimer();
        const totalTime = await this.context.getTotalTime( this.state.part?.module_id, this.state.part?.id );
        await this.context.removeTimer( this.state.part?.module_id, this.state.part?.id );

        const payload = {
            has_questions: this.state.hasQuestions,
            time_spent: !isNaN( totalTime ) ? totalTime : 0,
            final_part: this.state.isFinalPart
        };

        if( quizPayload && payload.has_questions ) {
            payload.question_responses = quizPayload;
        }

        payload.time_up = (timeUp) ? true : false;

        try {
            const partUpdate = await LearnService.submitModulePart( this.context.phoenixUser?.user?.id, this.state.part?.module_id, this.state.part?.id, payload )
            this.props.navigation.replace('learn.accreditation.result.show', { accreditationResponse : partUpdate});
            //this.state.isFinalPart ? this.props.navigation.push('learn.index') : this.props.navigation.push('learn.module.part.show', { moduleId: this.context.currentModule.id, moduleTitle: this.context.currentModule.title, partIndex: this.state.nextPartIndex })
        } catch( error ) {
            console.error( 'LearnContext.submitModulePart error', error );
            Alert.alert(_i('Sorry!'), _i('There was an error saving your progress, please try again later.'))
        }
    }

    // fires on an app state change
    _handleAppStateChange = async nextAppState => {
        // basically, end a timer if the app goes to background and start it again if the app comes back to foreground.
        nextAppState == 'active' ? this.context.startTimer( this.state.part?.module_id, this.state.part?.id ) : this.context.endCurrentTimer();
    }

    _isMounted = false;
    _isLoading = false;
    _appState = null;

    componentDidMount() {
        this._isMounted = true;

        if( this.state.moduleTitle ) this.props.navigation.setOptions({ headerTitle: this.state.moduleTitle, });

        this._init();

        this._appState = AppState.addEventListener( 'change', this._handleAppStateChange );

    }


    componentWillUnmount() {
        this._isMounted = false;
        if( this._appState ) this._appState.remove()
    }

    _onAnsweredQuestion = (questionIndex, payload) => {
        this.context.setAccreditationQuestionIndex(questionIndex);
        if(this._isMounted){
            this.context.setQuestionPayload(payload)
        }
    }

    _timeUp = () => {
        this._completePart(this.context.getQuestionPayload(), true);
    }

    render() {

        const { push } = this.props.navigation;

        return (
            <LearnContext.Consumer>{( learnContext ) => {

                const { currentModule } = learnContext;

                return (
                    <SafeAreaView style={{...STYLES.container.default, backgroundColor: 'white'}}>
                        {
                            !this.state.part &&
                            <View style={STYLES.container.center}>
                                {
                                    !this.state.initiated &&
                                    <LoadingSpinner color={STYLES.colors.white} size={60} />
                                }
                                {
                                    this.state.initiated &&
                                    <GeneralMessage message={_i('There was an error, please try again later')} color={STYLES.colors.white} />
                                }
                            </View>
                        }
                        {
                            this.state.part &&
                            <View style={STYLES.container.default}>
                                <LearnProgressBarTimed part={this.state.part} partIndex={this.state.partIndex} questionIndex={this.state.questionIndex} timeUp={this._timeUp} />
                                <LearnModulePart
                                    part={this.state.part}
                                    isFinalPart={this.state.isFinalPart}
                                    onSubmitEvent={ quizPayload => this._completePart(quizPayload) }
                                    partIndex={this.state.partIndex}
                                    onQuestionAnswered={ (questionIndex, payload) => this._onAnsweredQuestion(questionIndex, payload) }
                                />
                            </View>
                        }
                    </SafeAreaView>
                );
            }}</LearnContext.Consumer>
        );
    };

};

LearnAccreditationPartShowScreen.contextType = LearnContext;

// Wrap and export
export default function( props ) {

    const navigation = useNavigation();

    return <LearnAccreditationPartShowScreen {...props} navigation={navigation} />;
}
