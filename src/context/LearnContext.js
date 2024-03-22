import React, { Component, createContext } from 'react';
// react native core - https://facebook.github.io/react-native/docs/getting-started.html
import { Alert } from 'react-native';
// https://react-native-async-storage.github.io/async-storage/docs/usage
import AsyncStorage from '@react-native-async-storage/async-storage';
// lodash
import { _ } from 'lodash';
// components
import FormField from '../components/FormField';
// styles
import { STYLES } from '../Styles';
// configs
import { _i } from '../Translations';
import { logError } from '../Helpers';
import CONFIG from '../Config';
// services
import * as LearnService from '../services/learn';
import * as UserService from '../services/user';

export const LearnContext = createContext();

class LearnContextProvider extends Component {

    // mounted flag
    _isMounted = false;

    state = {
        phoenixUser: null,
        // some users may not have access to Learn - this is determnined by their phoenix user object's 'applications' array
        canAccessLearn: false,
        // categories
        categories: [],
        // next category
        nextUp: [],
        // user level
        level: null,
        // currently scoped module
        currentModule: null,
        // a currently running module part timer
        currentTimer: null,
        // current module for accreditation
        isAccreditation: false,
        // question Index
        questionIndex: 0,
    };

    /**
     * get the authenticated user's phoenix user object
     * @returns
     */
    getPhoenixUser = async () => {

        try {

            const phoenixUser = await UserService.getPhoenixUser();

            if( this._isMounted ) {
                await this.setState({
                    phoenixUser,
                    canAccessLearn: phoenixUser && Array.isArray( phoenixUser.applications ) ? phoenixUser.applications.includes('club-learning') : this.state.canAccessLearn,
                });
            }

            return;

        } catch( error ) {
            logError( 'Failed to get the phoenix user data', 'LearnContext->getPhoenixUser', error );
        }
    }

    /**
     * get the authenticated user's learrn modules
     * @depends phoenix user id
     * @returns
     */
    getUserLearnModules = async () => {

        try {

            this.state.nextUp = [];

            const userModulesData = await LearnService.userModules( this.state.phoenixUser?.user?.id );
            const userTierStatsData = await LearnService.userTierStats( this.state.phoenixUser?.user?.id );
            const userAccreditationData = await UserService.getUserAccreditation( this.state.phoenixUser?.user?.id );
            const userModulesCategories = await this.transformCategories( userModulesData?.categories );


            if( this._isMounted ) {
                await this.setState({
                    categories: userModulesCategories,
                    tiers: userModulesData?.stats,
                    booking_stats: userTierStatsData,
                    time_spent: this.getTimeSpent(userModulesData?.stats?.time_spent),
                    level: this._getLevel(userModulesData?.user_level_data?.module_tier?.name),
                    level_icon: this._getLevelIcon(userModulesData?.user_level_data?.module_tier?.name),
                    accreditation: userAccreditationData?.accreditations_available[0],
                    accreditation_certificate: userAccreditationData?.accreditations_available[0].certificate_path,
                    accreditationAvailable: (userAccreditationData?.accreditations_available[0].available),
                    accreditationGained: (userAccreditationData?.accreditations_available[0].achieved)
                });
            }

            return;

        } catch( error ) {
            logError( 'Failed to get the user learn data', 'LearnContext->getUserLearnModules', error );
        }
    }

    _getLevel = (level) => {
        console.log(level.toLowerCase());
        switch(level.toLowerCase()){
            case "learner":
                return "Learner Tier";
            case "expert":
                return "Expert Tier";
            case "guru+":
                return "Guru Tier";
            case "guru":
                return "Guru Tier";
            case "royal guru":
                return "Royal Guru";
            default:
                return "Learner Tier";
        }
    }

    _getLevelIcon = (level) => {
        switch(level.toLowerCase()){
            case "learner":
                return "rp-icon-pencil";
            case "expert":
                return "rc-icon-search";
            case "guru":
                return "rc-icon-trophy";
            case "royal guru":
                return "rc-icon-mortarboard";
            default:
                return "rp-icon-pencil";
        }
    }

    resetAccreditationStatus = async () => {
        const userAccreditationData = await UserService.getUserAccreditation( this.state.phoenixUser?.user?.id );

        if( this._isMounted ) {
            await this.setState({
                accreditation: userAccreditationData?.accreditations_available[0],
                accreditation_certificate: userAccreditationData?.accreditations_available[0].certificate_path,
                accreditationAvailable: (userAccreditationData?.accreditations_available[0].available),
                accreditationGained: (userAccreditationData?.accreditations_available[0].achieved)
            });
        }
    }
    /**
     * Get the time spend on learn this year, this will return minutes if no hours have been completed
     * @param data
     * @returns {Promise<void>}
     */
    getTimeSpent = time => {
        const h = Math.floor(time.all_time / 3600);
        const m = Math.floor(time.all_time % 3600 / 60);

        return this._getHours(h) + ' ' + this._getMinutes(m);
    }

    _getHours = hours => {
        let text = (hours > 1) ? ' hours' : ' hour';
        return (hours > 0) ? hours + text : '';
    }
    _getMinutes = mins => {
        let text =  (mins == 1) ? ' min' : ' mins';
        return (mins > 0) ? mins + text : '';
    }
    /**
     * get a single module by id from the perspective of the currently authenticated user
     * @depends phoenix user id
     * @param {*} moduleId
     * @returns
     */
    getUserLearnModule = async moduleId => {

        try {

            const userModuleData = await LearnService.userModule( this.state.phoenixUser?.user?.id, moduleId );

            if( this._isMounted ) {
                await this.setState({
                    currentModule: this.transformModule( userModuleData )
                });
            }

            return;

        } catch( error ) {
            logError( 'Failed to get the user learn data', 'LearnContext->getUserLearnModules', error );
        }
    }

    resetCurrentModule = async () => {
        if( this._isMounted ) {
            await this.setState({
                currentModule: null
            });

            return;
        }
    }

    /**
     * determine this user's current level
     * @param {*} userLevelData
     * @returns
     */
    userLevel = userLevelData => {
        if( !userLevelData ) return null;
    }

    /**
     * transform a raw array of categroies from the learn api into sanitized category objects
     * @param {arr} categories_data
     * @returns
     */
    transformCategories = categories_data => {

        if( !categories_data || !Array.isArray( categories_data ) ) return [];

        let categories = [],
            category;

        categories_data.forEach( category_data => {
            // active and correctly formed categories only.
            if( category_data?.active === 1 && ( category = this.transformCategory( category_data ) ) ) categories.push( category );
        })

        return categories;
    }

    /**
     * transform an individual category object from the learn api into sanitized category object
     * @param {obj} category_data
     * @returns
     */
    transformCategory = category_data => {

        if( !category_data ) return null;

        const modules = this.transformModules( category_data?.modules );
        // if the category has no modules best for now just to exclude it unless told otherwise.
        if( !modules || modules.total === 0 ) return null;

        const category = {
            id: category_data?.id,
            name: category_data?.name,
            slug: category_data?.slug,
            order: category_data?.order,
            modules: modules?.modules || [],
            modulesTotal: modules?.total || 0,
            modulesCompleted: modules?.completed || 0,
        };

        return category;

    }

    /**
     * transform a collection of modules supplied by the learn api in sanitized modules
     * @param {arr} modules_data
     * @returns
     */
    transformModules = modules_data => {
        // correctly formed and present or nothing
        if( !modules_data || !Array.isArray( modules_data ) ) return null;

        let module,
            modules = {
                modules: [],
                total: 0,
                completed: 0,
            };


        modules_data.forEach( module_data => {
            // correctly formed modules only.
            if( module = this.transformModule( module_data ) ) {
                // iterate the completed total if required
                if( module.completed ) modules.completed++;
                // the first incomplete but available module goes into nextUp
                if( this.state.nextUp.length === 0 && !module.completed && !module.locked ) this.state.nextUp.push( module );
                // push into the return array
                modules.modules.push( module );
            }
        });

        modules.total = modules.modules.length;

        return modules;

    }

    /**
     * transform an individual
     * @param {obj} module_data
     * @returns
     */
    transformModule = module_data => {
        try {
            if( !module_data ) return null;

            let thumbnail = module_data?.details?.image_thumb_url || null;

            if( 'string' === typeof thumbnail ) {
                // thumbnails arrive in all manner of formats ... some absolute, some relative. Stupid.
                thumbnail = thumbnail.includes('http') ? thumbnail : CONFIG.assets.host.learn[CONFIG.env.learn] + thumbnail;
            }

            const parts = this.transformParts( module_data?.parts );


            const module = {
                id: module_data?.id,
                order: module_data?.order,
                categoryId: module_data?.module_category_id,
                locked: !module_data?.viewable,
                completed: this.getModuleComplete(module_data?.timetrack),
                title: module_data?.title,
                slug: module_data?.slug,
                thumbnail: thumbnail,
                description: module_data?.details?.description,
                subtitle: module_data?.details?.subtitle,
                tierId: module_data?.tier?.id,
                tierName: module_data?.tier?.name,
                parts: parts?.parts || [],
                partsTaskStepsCount: parts?.taskStepsCount || null,
                duration: module_data?.duration
            };

            return module;
        } catch(ex) {
            console.log('error', ex)
        }

    }

    getModuleComplete = timetrack => {
        if(!timetrack || !Array.isArray(timetrack) || timetrack.length === 0) return false

        let complete = false

        timetrack.forEach(entry => {
            if(entry?.completed === 1) complete = true
        });

        return complete
    }

    /**
     * transform parts
     * @param {*} parts_data
     * @returns
     */
    transformParts = parts_data => {

        if( !parts_data ) return [];

        let part,
            index = 0,
            parts = {
                parts: [],
                taskStepsCount: 0,
            };

        parts_data.forEach( part_data => {
            // correctly formed parts only.
            if( part = this.transformPart( part_data, index ) ) {
                // push into the return array
                parts.parts.push( part );
                // we count the steps that contain tasks (basically all non-summary parts) for use by the parts progress bar
                parts.taskStepsCount++;
                // providing an index for the FlatList component's key
                index++;
            }
        });


        return parts;

    }

    /**
     * transform a single module part
     */
    transformPart = ( part_data, index ) => {

        if( !part_data ) return null;

        const part = {
            ...part_data,
            activityLabel: this.getActivity( part_data.type ),
            key: ( index + 1 ).toString(),
        };

        return part;
    }

    /**
     * discerns a friendly user facing activity label based on a 'part' object's type.
     */
    getActivity = type => {

        switch( type ) {
            case 'watch':
                return 'Video';
            case 'accordian':
                return 'Information';
            default:
                return typeof type === 'string' ? ( type.charAt(0).toUpperCase() + type.slice(1) ) : 'Task';
        }
    }

    getTimerName = (  moduleId, partId ) => {
        return CONFIG.storage.key.learnModulePartTimer + 'MID_' + moduleId + '_PID_' + partId;
    }

    getTimer = async (  moduleId, partId ) => {
        const timerName = this.getTimerName( moduleId, partId );
        const timer = await AsyncStorage.getItem( timerName );
        return !timer ? [] : JSON.parse( timer );
    }

    getTotalTime = async (  moduleId, partId ) => {
        const timer = await this.getTimer( moduleId, partId );
        if( !timer || !Array.isArray( timer ) ) return false;

        let milliseconds = 0;

        timer.forEach( time => {
            if( !isNaN( time?.start ) && !isNaN( time?.end ) ) {
                milliseconds = milliseconds + ( time.end - time.start );
            }
        });

        return milliseconds > 0 ? ( milliseconds / 1000 ) : 0;
    }

    removeTimer = async (  moduleId, partId ) => {
        const timerName = this.getTimerName( moduleId, partId );
        await AsyncStorage.removeItem( timerName );
        return;
    }

    storeTimerSession = async (  moduleId, partId, session ) => {
        const timerName = this.getTimerName( moduleId, partId );
        const timer = await this.getTimer( moduleId, partId );
        timer.push( session );
        await AsyncStorage.setItem( timerName, JSON.stringify( timer ) );
        return;
    }

    startTimer = async ( moduleId, partId ) => {

        const startTime = Date.now();

        if( this.state.currentTimer ) await this.endCurrentTimer();
        // if it's malformed we wont start a new one
        if( !moduleId || !partId ) return;

        const currentTimer = {
            moduleId: moduleId,
            partId: partId,
            start: startTime,
            end: null,
        }

        if( this._isMounted ) this.setState({ currentTimer })
    }

    setIsAccreditation = async bool => {
        return this.state.isAccreditation = bool;
    }

    endCurrentTimer = async () => {

        if( !this.state.currentTimer ) return;

        const timer = {
            start: this.state.currentTimer.start,
            end: this.state.currentTimer.end || Date.now()
        };

        await this.storeTimerSession( this.state.currentTimer.moduleId, this.state.currentTimer.partId, timer );

        if( this._isMounted ) await this.setState({ currentTimer: null });

        return;
    }

    getYourJourney= async (data) => {
        try {

            //const yourJourney = await UserService.getYourJourney( this.state.phoenixUser?.user?.id );
            const yourJourney = 'getYourJourney';

            if( this._isMounted ) {
                await this.setState({
                    yourJourneyLoaded: true
                });
            }

        } catch( error ) {
            logError( 'Failed to get the user learn data', 'LearnContext->getYourJourney', error );
        }
    }

    getAccreditations = async () => {
        try {
            const accreditations = await UserService.getUserAccreditation( this.state.phoenixUser?.user?.id );
            if( this._isMounted ) {
                await this.setState({
                    accreditations: accreditations,
                    accreditationLoaded: true
                });
            }

        } catch( error ) {
            logError( 'Failed to get the user learn data', 'LearnContext->getAccreditations', error );
        }
    }

    checkIfAccreditation = () => {
        return this.state?.isAccreditation;
    }

    getQuestionPayload = () => {
        return this.state?.questionPayload;
    }

    setQuestionPayload = questionPayload=> {
        if( this._isMounted ) {
            this.setState({questionPayload: questionPayload})
        }
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    getAccreditationQuestionIndex = () => {
        if( this._isMounted ) {
            return this.state?.questionIndex;
        }
    }
    setAccreditationQuestionIndex = questionIndex => {
        if( this._isMounted ) {
            this.setState({questionIndex: questionIndex})
        }
    }

    render () {
        return (
            <LearnContext.Provider value={{
                ...this.state,
                getPhoenixUser: this.getPhoenixUser,
                getUserLearnModules: this.getUserLearnModules,
                getUserLearnModule: this.getUserLearnModule,
                resetCurrentModule: this.resetCurrentModule,
                startTimer: this.startTimer,
                endCurrentTimer: this.endCurrentTimer,
                getTotalTime: this.getTotalTime,
                removeTimer: this.removeTimer,
                getYourJourney: this.getYourJourney,
                getAccreditations: this.getAccreditations,
                setIsAccreditation: this.setIsAccreditation,
                checkIfAccreditation: this.checkIfAccreditation,
                getAccreditationQuestionIndex: this.getAccreditationQuestionIndex,
                setAccreditationQuestionIndex: this.setAccreditationQuestionIndex,
                resetAccreditationStatus: this.resetAccreditationStatus,
                getQuestionPayload: this.getQuestionPayload,
                setQuestionPayload: this.setQuestionPayload
            }}>
                {this.props.children}
            </LearnContext.Provider>
        )
    }
}

export default LearnContextProvider;
