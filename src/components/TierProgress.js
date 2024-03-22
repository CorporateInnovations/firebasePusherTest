/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/

// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { StyleSheet, View, Text, FlatList, Dimensions, TouchableOpacity } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
// https://github.com/vivaxy/react-native-auto-height-image
import AutoHeightImage from 'react-native-auto-height-image';

// local components


// context
import { LearnContext } from '../context/LearnContext';

import { STYLES, VARS } from '../Styles';
import { formatDate } from '../Helpers';
import { _i } from '../Translations';
import AnimatedView from './AnimatedView';
import ButtonBlock from './ButtonBlock';

const DIMENSIONS = Dimensions.get('screen');

import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon(icoMoonConfig, 'icomoon', 'icomoon.ttf' );

/*******************************************************************************
 * TierProgress Class
 ******************************************************************************/
class TierProgress extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {
            activeTab: 'GBP'
        };
    }

    _isMounted = false;

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    _gotoAccredidation = ( accreditation ) => {
        this.context.setAccreditationQuestionIndex(0);
        this.context.setIsAccreditation(true);
        this.props.navigation.navigate('learn.module.part.show.accreditation', { moduleId: accreditation.eligibilities[0].module.id, moduleTitle: accreditation.eligibilities[0].module.title, partIndex: 0});
    }

    render() {

        const { navigate } = this.props.navigation;

        return (
            <LearnContext.Consumer>{( learnContext ) => {
                const { level, level_icon, accreditationLoaded,  accreditationAvailable, accreditationGained, accreditation } = learnContext;

                return (
                    <>
                        <View style={{flexDirection: 'row',
                            marginLeft: VARS.spacer.large,
                            marginRight: VARS.spacer.large,
                            marginTop: VARS.spacer.small,
                            marginBottom: VARS.spacer.small,
                            backgroundColor: '#FFFFFF50',
                            borderRadius: VARS.borderRadius.small,
                            alignItems: 'center',
                            justifyContent: 'space-around'
                        }}>
                            <View style={{flexDirection: 'row', alignItems: 'center' }}>
                                <Icon
                                    name={ level_icon }
                                    size={ 32 }
                                    color={ STYLES.colors.white }
                                    style={{ paddingTop: VARS.spacer.small, paddingBottom: VARS.spacer.small, textAlign: 'center' }}
                                />
                                <Text style={{...STYLES.text.legal_heading, color: STYLES.colors.white, marginLeft: VARS.spacer.xsmall}}>{level}</Text>
                            </View>
                            {
                                (accreditationGained) &&
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Icon
                                        name={ `rc-icon-reward-status-approved` }
                                        size={ 32 }
                                        color={ STYLES.colors.white }
                                        style={{ paddingTop: VARS.spacer.small, paddingBottom: VARS.spacer.small, textAlign: 'center' }}
                                    />
                                    <View>
                                        <Text style={{...STYLES.text.legal_heading, color: STYLES.colors.white, marginLeft: VARS.spacer.xsmall}}>Accredited Achieved</Text>
                                        <Text style={{...STYLES.text.legal_light, color: STYLES.colors.white, marginLeft: VARS.spacer.xsmall}}>Expires {formatDate(accreditation.expiry, 'DD/MM/YYYY')}</Text>
                                    </View>
                                </View>
                            }
                            {
                                (!accreditationGained && !accreditationAvailable) &&
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <Icon
                                        name={ `rc-icon-reward-status-approved` }
                                        size={ 32 }
                                        color={ STYLES.colors.white }
                                        style={{ paddingTop: VARS.spacer.small, paddingBottom: VARS.spacer.small, textAlign: 'center' }}
                                    />
                                    <Text style={{...STYLES.text.small_bold, color: STYLES.colors.white, marginLeft: VARS.spacer.xsmall}}>Not Accredited</Text>
                                </View>
                            }
                            {
                                (!accreditationGained && accreditationAvailable) &&
                                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                    <AnimatedView animationName={'fade-in'}>
                                        <ButtonBlock
                                            color={ 'yellow' }
                                            label={_i('Gain Accreditation')}
                                            xAdjust={120}
                                            customStyle={{ marginTop: 0 }}
                                            onPressEvent={ () => this._gotoAccredidation( accreditation ) }
                                        />
                                    </AnimatedView>
                                </View>
                            }
                        </View>
                    </>
                );
            }}</LearnContext.Consumer>
        );
    }
}

TierProgress.contextType = LearnContext;

const styles = StyleSheet.create({

});

export default function( props ) {
    const navigation = useNavigation();
    return <TierProgress {...props} navigation={navigation} />;
}
