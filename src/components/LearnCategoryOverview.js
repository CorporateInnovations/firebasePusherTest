/*******************************************************************************
 * Dependency Imports
 ******************************************************************************/
// react core - https://reactjs.org/
import React from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { View, Text, Dimensions, StyleSheet, FlatList } from 'react-native';
// react navigation - https://reactnavigation.org/docs/
import { useNavigation } from '@react-navigation/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
// local components
import LearnModuleOverview from '../components/LearnModuleOverview';
import GeneralMessage from '../components/GeneralMessage';
// context
import { LearnContext } from '../context/LearnContext';
// config
import { STYLES, VARS } from '../Styles';
import { _i } from '../Translations';

const DIMENSIONS = Dimensions.get('screen');

/*******************************************************************************
 * LearnCategoryOverview Class
 ******************************************************************************/
class LearnCategoryOverview extends React.Component {

    constructor( props ) {

        super( props );

        this.state = {

        };
    }

    _isMounted = false;

    _renderItem = ({ item, index }) => (
        <LearnModuleOverview module={ item } last={ ( index + 1 ) == this.props.category?.modules?.length } />
    );

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {

        return (
            <View style={{ paddingTop: VARS.spacer.large, marginBottom: 0 }}>
                <View style={{ paddingLeft: VARS.spacer.large, marginBottom: VARS.spacer.small }}>
                    <Text style={{...STYLES.text.heading4, color: STYLES.colors.white }}>{ this.props.category.name || _i('Category Name') } <Text style={{color: STYLES.colors.yellow.default}}>{ `${this.props.category.modulesCompleted}/${this.props.category.modulesTotal}` }</Text></Text>
                </View>
                <FlatList
                    data={this.props.category?.modules}
                    style={{ flex: 1, paddingLeft: VARS.spacer.large }}
                    contentContainerStyle={{ paddingRight: VARS.spacer.large }}
                    horizontal={true}
                    renderItem={this._renderItem}
                    keyExtractor={ item => item.id.toString() }
                    ListEmptyComponent={<GeneralMessage message={_i('No Learn Modules')} color={STYLES.colors.white} />}
                />
            </View>
        );
    }
}

LearnCategoryOverview.contextType = LearnContext;

const styles = StyleSheet.create({

});

export default function( props ) {

    const navigation = useNavigation();

    return <LearnCategoryOverview {...props} navigation={navigation} />;
}
