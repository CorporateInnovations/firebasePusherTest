/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/
// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Dimensions, StyleSheet, Alert, ImageBackground } from 'react-native';
// external imports
import LinearGradient from 'react-native-linear-gradient';
// local components
import ButtonBlock from '../components/ButtonBlock';
// context
import { LearnContext } from '../context/LearnContext';
// config
import { STYLES, VARS } from '../Styles';
import {_i} from '../Translations';
import CONFIG from '../Config';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LoadingSpinner from './LoadingSpinner';
import GeneralMessage from './GeneralMessage';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * LearnModulePartQuestions Class
 ******************************************************************************/
export default class LearnModulePartQuestions extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            currentQuestionIndex: 0,
            answerLabels: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            userAnswers: [],
            quizComplete: false,
            passScore: this.props.part?.question_pass_pct
        };
    }

    _isMounted = false;

    _resetQuiz = async () => {

        if(this._isMounted) {
            this.setState({
                currentQuestionIndex: 0,
                userAnswers: [],
                quizComplete: false,
            })
        }
    }

    _getMediaUrl = path => {

        if( typeof path !== 'string' ) return '';

        return path.includes('http') ? path : `${CONFIG.assets.host.learn[CONFIG.env.learn]}/${path}`;

    }

    _score = () => {
        let correct = 0;

        this.state.userAnswers.forEach(answer => {
            if(answer.isCorrect === 1) correct++;
        })

        if(correct === 0) return 0;

        if(correct === this.props.part.questions.length) return 100;

        const score = Math.round((correct / this.props.part.questions.length) * 100);

        return !isNaN(score) ? score : 0;
    }

    _resultMessage = () => {

        const score = this._score();

        if( score >= this.state.passScore ) return _i('Excellent score, well done!');

        if( score > (this.state.passScore * 0.5) && !this._isAccreditation()) return _i('Very close, have another try');

        if( score < (this.state.passScore) && this._isAccreditation()) return _i('Please try again in 24 hours.');
        if( score < (this.state.passScore * 0.5) && this._isAccreditation()) return _i('Very close, please try again in 24 hours.');

        return _i('Have another try');
    }

    _getAnswersPayload = () => {

        let payload = {};

        this.state.userAnswers.forEach(answer => {
            payload[answer.questionId.toString()] = answer.answerId;
        });

        console.log('payload', payload);
        return payload;
    }

    _submitAnswer = async ( questionId, answer ) => {

        const newIndex = this.state.currentQuestionIndex + 1;

        const userAnswers = this.state.userAnswers || [];

        userAnswers.push({
            questionId: questionId,
            answerId: answer.id,
            isCorrect: answer.is_correct
        })



        if( this._isMounted ) {
            await this.setState({
                currentQuestionIndex: newIndex,
                userAnswers: userAnswers,
                quizComplete: newIndex == this.props.part.questions.length
            })
        }


        if(this.props.onQuestionAnswered !== undefined && newIndex != this.props.part.questions.length) {
            const payload = this._getAnswersPayload();
            this.props.onQuestionAnswered(newIndex, payload);
        }

        if(newIndex == this.props.part.questions.length &&  this._score() >= this.state.passScore) {
            const quizAnswers = this._getAnswersPayload();
            this.props.quizComplete(quizAnswers);
        }

        if(newIndex == this.props.part.questions.length &&  this._isAccreditation()) {
            const quizAnswers = this._getAnswersPayload();
            this.props.quizComplete(quizAnswers);
        }

        if( this._score() >= this.state.passScore) {
            this.props.enableNext();
        }
    }

    _renderAnswers = question => {
        return question.answers.map((answer, index) => (

            <TouchableOpacity
                key={answer.id.toString()}
                onPress={() => this._submitAnswer(question.id, answer)}
                style={styles.answer}
            >
                {
                    answer?.image_url != null &&
                    <ImageBackground
                        source={{uri: this._getMediaUrl(answer.image_url)}}
                        style={styles.answerImage}
                        />
                }
                <View style={styles.answerContent}>
                    <Text style={STYLES.text.body_light}><Text style={STYLES.text.body_bold}>{`${this.state.answerLabels[index]}.`}</Text> {answer.title}</Text>
                </View>
            </TouchableOpacity>

        ));
    }

    _getQuestionContent = () => {
        const questions = Array.isArray(this.props.part?.questions) && this.props.part?.questions?.length > 0 ? this.props.part?.questions : [];
        const question = questions[this.state.currentQuestionIndex];

        if(!question || !question.answers) {
            return (<></>);
        }

        return (
            <View style={styles.question}>
                <View style={styles.questionContent}>
                    <Text style={{...STYLES.text.body_light, fontSize: 16, color: VARS.colors.purple.default }}><Text style={{...STYLES.text.body_bold, fontSize: 16, color: VARS.colors.purple.default }}>{`Question ${this.state.currentQuestionIndex + 1} of ${this.props.part.questions.length}:`}</Text> {question.title}</Text>
                </View>
                <View style={styles.answers}>
                    {this._renderAnswers(question)}
                </View>
            </View>
        );
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    _isAccreditation() {
        console.log(this.context.isAccreditation);
        return this.context.isAccreditation;
    }

    render() {

        if(!this.state.quizComplete) {
            return (
                <View style={{marginBottom: VARS.spacer.small, }}>
                    {this._getQuestionContent()}
                </View>
            )
        }

        if(!this._isAccreditation()) {
            return (
                <View style={{...STYLES.container.center, paddingTop: 100}}>
                    <View style={STYLES.text.paragraph}>
                        <Text style={{...STYLES.text.heading5, color: VARS.colors.purple.default, textAlign: 'center'}}>You
                            Scored...</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={{
                            ...STYLES.text.heading3,
                            fontSize: 60,
                            lineHeight: 60,
                            color: VARS.colors.purple.default,
                            textAlign: 'center'
                        }}>{`${this._score()}%`}</Text>
                    </View>
                    <View style={STYLES.text.paragraph}>
                        <Text style={{
                            ...STYLES.text.heading5,
                            color: VARS.colors.purple.default,
                            textAlign: 'center'
                        }}>{this._resultMessage()}</Text>
                    </View>
                    {
                        this._score() < this.state.passScore &&
                        <ButtonBlock
                            color={'navy'}
                            label={_i('Try Again')}
                            xAdjust={36}
                            customStyle={{marginBottom: 0}}
                            onPressEvent={() => this._resetQuiz()}
                        />
                    }
                </View>
            );
        } else {
            return(
                <View style={STYLES.container.center}>
                    <LoadingSpinner color={STYLES.colors.blue} size={60} />
                    <GeneralMessage message={_i('Analysing your answers, please wait..')} color={STYLES.colors.white} />
                </View>
            );
        }
    }
}

LearnModulePartQuestions.contextType = LearnContext;

const styles = StyleSheet.create({
    question: {

    },
    questionContent: {
        marginBottom: VARS.spacer.small
    },
    answers: {
        flex: 0,
        flexDirection: 'column',
        flexWrap: 'wrap',
    },
    answer: {
        flex: 0,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: DIMENSIONS.width - (2 * VARS.spacer.large),
        marginBottom: 10,
        backgroundColor: '#F0F0F0',
        borderRadius: 4,
    },
    answerImage: {
        flexGrow: 0,
        width: 100,
        height: 80,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        overflow: 'hidden'
    },
    answerContent: {
        flex: 1,
        flexGrow: 1,
        justifyContent: 'center',
        padding: VARS.spacer.small,
    }
});
