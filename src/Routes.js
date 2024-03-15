import React, { useContext, useState } from 'react';
import { Dimensions } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import RegistrationContextProvider from './context/RegistrationContext';

// icons
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../assets/icons/selection.json';
const Icon = createIconSetFromIcoMoon( icoMoonConfig, 'icomoon', 'icomoon.ttf' );

// https://www.npmjs.com/package/react-native-linear-gradient
import LinearGradient from 'react-native-linear-gradient';

// local vars
import { STYLES } from './Styles';
import { HELPERS } from './Helpers';

// Global Components
import HeaderMenuButton from './components/HeaderMenuButton';
import HeaderBackButton from './components/HeaderBackButton';
import HeaderBackAccreditationButton from './components/HeaderBackAccreditationButton';

/**
 * Auth Stack
 */
const AuthStack = createStackNavigator();
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import AuthLoginScreen from './screens/AuthLoginScreen';
import AuthLoginSecurityScreen from './screens/AuthLoginSecurityScreen';
import AuthLoginForgotPasswordScreen from './screens/AuthLoginForgotPasswordScreen';
import AuthLogin2FAScreen from './screens/AuthLogin2FAScreen';
import AuthLoginChangePasswordScreen from './screens/AuthLoginChangePasswordScreen';
import AuthLoginPasswordChangeConfirmScreen from './screens/AuthLoginPasswordChangeConfirmScreen';

const DIMENSIONS = Dimensions.get( 'window' );
const xlViewport = DIMENSIONS.width > 375;

export const Auth = () => {
    return (
        <RegistrationContextProvider>
            <AuthStack.Navigator
                initialRouteName="auth.loading"
                headerMode="none"
                screenOptions={{
                    gestureEnabled: false
                }}
            >
                <AuthStack.Screen
                    name="auth.loading"
                    component={AuthLoadingScreen}
                />
                <AuthStack.Screen
                    name="login.login"
                    component={AuthLoginScreen}
                />
                <AuthStack.Screen
                    name="login.security"
                    component={AuthLoginSecurityScreen}
                />
                <AuthStack.Screen
                    name="login.forgot_password"
                    component={AuthLoginForgotPasswordScreen}
                />
                <AuthStack.Screen
                    name="login.forgot_password_2FA"
                    component={AuthLogin2FAScreen}
                />
                <AuthStack.Screen
                    name="login.change_password"
                    component={AuthLoginChangePasswordScreen}
                />
                <AuthStack.Screen
                    name="login.password_change_confirm"
                    component={AuthLoginPasswordChangeConfirmScreen}
                />
            </AuthStack.Navigator>
        </RegistrationContextProvider>
    )
}

import RegistrationRegisterScreen from './screens/RegistrationRegisterScreen';
import RegistrationOutcomeScreen from './screens/RegistrationOutcomeScreen';
import RegistrationAccountScreen from './screens/RegistrationAccountScreen';
import RegistrationMarketingScreen from './screens/RegistrationMarketingScreen';
import RegistrationProfileScreen from './screens/RegistrationProfileScreen';
import RegistrationVerifyEmailScreen from './screens/RegistrationVerifyEmailScreen';
import RegistrationPasswordScreen from './screens/RegistrationPasswordScreen';
import RegistrationTermsScreen from './screens/RegistrationTermsScreen';

const RegisterStack = createStackNavigator();
export const Register = () => {
    return (
        <RegistrationContextProvider>
            <RegisterStack.Navigator
                initialRouteName="register.registration"
                headerMode="none"
                screenOptions={{
                    gestureEnabled: false
                }}
            >
                <RegisterStack.Screen
                    name="register.registration"
                    component={RegistrationRegisterScreen}
                />
                <RegisterStack.Screen
                    name="regsiter.outcome"
                    component={RegistrationOutcomeScreen}
                />
                <RegisterStack.Screen
                    name="register.account"
                    component={RegistrationAccountScreen}
                    options={{
                        headerShown: false
                    }}
                />
                <RegisterStack.Screen
                    name="register.profile"
                    component={RegistrationProfileScreen}
                    options={{
                        headerShown: false
                    }}
                />
                <RegisterStack.Screen
                    name="register.marketing"
                    component={RegistrationMarketingScreen}
                    options={{
                        headerShown: false
                    }}
                />
                <RegisterStack.Screen
                    name="register.verify_email"
                    component={RegistrationVerifyEmailScreen}
                    options={{
                        headerShown: false
                    }}
                />
                <RegisterStack.Screen
                    name="register.password"
                    component={RegistrationPasswordScreen}
                    options={{
                        headerShown: false
                    }}
                />
                <RegisterStack.Screen
                    name="register.terms"
                    component={RegistrationTermsScreen}
                    options={{
                        headerShown: false
                    }}
                />

            </RegisterStack.Navigator>
        </RegistrationContextProvider>
    )
}

/**
 * Onboarding Stack
 */
const OnboardingStack = createStackNavigator();
import OnboardingLoadingScreen from './screens/OnboardingLoadingScreen';

import OnboardingPasscodeScreen from './screens/OnboardingPasscodeScreen';
import OnboardingMemorableWordScreen from './screens/OnboardingMemorableWordScreen';
import OnboardingEnableBiometricScreen from './screens/OnboardingEnableBiometricScreen';
import OnboardingAppleWalletScreen from './screens/OnboardingAppleWalletScreen';

export const Onboarding = () => {
    return (
        <OnboardingStack.Navigator
            initialRouteName="onboarding.loading"
            screenOptions={{
                gestureEnabled: false
            }}
        >
            <OnboardingStack.Screen
                name="onboarding.loading"
                component={OnboardingLoadingScreen}
                options={{
                    headerShown: false
                }}
            />

            <OnboardingStack.Screen
                name="onboarding.passcode"
                component={OnboardingPasscodeScreen}
                options={{
                    title: 'Passcode',
                    headerLeft: () => null,
                    headerRight: () => null,
                    headerBackground: () => (
                        <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.blue } start={STYLES.gradients.left} end={STYLES.gradients.right} />
                    ),
                    headerStyle: STYLES.header.headerMenutyle,
                    headerTintColor: STYLES.header.headerTintColor,
                    headerTitleStyle: STYLES.header.headerTitleStyle,
                    cardStyle: { backgroundColor: '#FFFFFF' },
                }}
            />
            <OnboardingStack.Screen
                name="onboarding.memorable_word"
                component={OnboardingMemorableWordScreen}
                options={{
                    title: 'Memorable Word',
                    headerLeft: () => null,
                    headerRight: () => null,
                    headerBackground: () => (
                        <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.blue } start={STYLES.gradients.left} end={STYLES.gradients.right} />
                    ),
                    headerStyle: STYLES.header.headerMenutyle,
                    headerTintColor: STYLES.header.headerTintColor,
                    headerTitleStyle: STYLES.header.headerTitleStyle,
                    cardStyle: { backgroundColor: '#FFFFFF' },
                }}
            />
            <OnboardingStack.Screen
                name="onboarding.enable_biometric"
                component={OnboardingEnableBiometricScreen}
                options={{
                    title: 'Enable Biometric',
                    headerLeft: () => null,
                    headerRight: () => null,
                    headerBackground: () => (
                        <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.blue } start={STYLES.gradients.left} end={STYLES.gradients.right} />
                    ),
                    headerStyle: STYLES.header.headerMenutyle,
                    headerTintColor: STYLES.header.headerTintColor,
                    headerTitleStyle: STYLES.header.headerTitleStyle,
                    cardStyle: { backgroundColor: '#FFFFFF' },
                }}
            />
            <OnboardingStack.Screen
                name="onboarding.apple_wallet"
                component={OnboardingAppleWalletScreen}
                options={{
                    title: 'Apple Pay',
                    headerLeft: () => null,
                    headerRight: () => null,
                    headerBackground: () => (
                        <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.blue } start={STYLES.gradients.left} end={STYLES.gradients.right} />
                    ),
                    headerStyle: STYLES.header.headerMenutyle,
                    headerTintColor: STYLES.header.headerTintColor,
                    headerTitleStyle: STYLES.header.headerTitleStyle,
                    cardStyle: { backgroundColor: '#FFFFFF' },
                }}
            />
        </OnboardingStack.Navigator>
    )
}

/**
 * Account Stack
 */
const AccountStack = createStackNavigator();
import AccountIndexScreen from './screens/AccountIndexScreen';
import AccountPasswordUpdateScreen from './screens/AccountPasswordUpdateScreen';

export const Account = () => {
    return (
        <AccountStack.Navigator
            initialRouteName="account.index"
            screenOptions={{
                headerLeft: () => ( <HeaderMenuButton /> ),
                headerBackground: () => (
                    <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.purple } start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                ),
                headerStyle: STYLES.header.headerMenutyle,
                headerTintColor: STYLES.header.headerTintColor,
                headerTitleStyle: STYLES.header.headerTitleStyle,
            }}
        >
            <AccountStack.Screen
                name="account.index"
                component={AccountIndexScreen}
                options={{
                    title: 'Welcome',
                }}
            />
            <AccountStack.Screen
                name="account.password_update"
                component={AccountPasswordUpdateScreen}
            />
        </AccountStack.Navigator>
    )
}

/**
 * Rewards Stack
 */
const RewardsStack = createStackNavigator();
import RewardsIndexScreen from './screens/RewardsIndexScreen';
import RewardsShowScreen from './screens/RewardsShowScreen';

export const Rewards = () => {
    return (
        <RewardsStack.Navigator
            initialRouteName="rewards.index"
            screenOptions={{
                headerLeft: () => ( <HeaderMenuButton /> ),
                headerBackground: () => (
                    <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.navy } start={STYLES.gradients.left} end={STYLES.gradients.right} />
                ),
                headerStyle: STYLES.header.headerMenutyle,
                headerTintColor: STYLES.header.headerTintColor,
                headerTitleStyle: STYLES.header.headerTitleStyle,
            }}
        >
            <RewardsStack.Screen
                name="rewards.index"
                component={RewardsIndexScreen}
                options={{
                    headerLeft: () => ( <HeaderMenuButton /> ),
                    title: 'Rewards',
                }}
            />
            <RewardsStack.Screen
                name="rewards.show"
                component={RewardsShowScreen}
                options={{
                    headerLeft: () => ( <HeaderBackButton /> ),
                    title: 'Reward History',
                }}
            />
        </RewardsStack.Navigator>
    )
}

/**
 * Mastercard Stack
 */
const MastercardStack = createStackNavigator();
import MastercardIndexScreen from './screens/MastercardIndexScreen';

export const Mastercard = () => {
    return (
        <MastercardStack.Navigator
            initialRouteName="mastercard.index"
            screenOptions={{
                headerLeft: () => ( <HeaderMenuButton /> ),
                headerBackground: () => (
                    <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.navy } start={STYLES.gradients.left} end={STYLES.gradients.right} />
                ),
                headerStyle: STYLES.header.headerMenutyle,
                headerTintColor: STYLES.header.headerTintColor,
                headerTitleStyle: STYLES.header.headerTitleStyle,
            }}
        >
            <MastercardStack.Screen
                name="mastercard.index"
                component={MastercardIndexScreen}
                options={{
                    headerLeft: () => ( <HeaderMenuButton /> ),
                    title: 'Mastercard',
                }}
            />
        </MastercardStack.Navigator>
    )
}

/**
 * News Stack
 */
const NewsStack = createStackNavigator();
import NewsIndexScreen from './screens/NewsIndexScreen';
import NewsShowScreen from './screens/NewsShowScreen';

export const News = () => {
    return (
        <NewsStack.Navigator
            initialRouteName="news.index"
            screenOptions={{
                headerLeft: () => ( <HeaderMenuButton /> ),
                headerBackground: () => (
                    <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.orange } start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }} />
                ),
                headerStyle: STYLES.header.headerMenutyle,
                headerTintColor: STYLES.header.headerTintColor,
                headerTitleStyle: STYLES.header.headerTitleStyle,
            }}
        >
            <NewsStack.Screen
                name="news.index"
                component={NewsIndexScreen}
                options={{
                    headerLeft: () => ( <HeaderMenuButton /> ),
                    title: 'News',
                }}
            />
            <NewsStack.Screen
                name="news.show"
                component={NewsShowScreen}
                options={{
                    headerLeft: () => ( <HeaderBackButton /> ),
                    title: 'News',
                }}
            />
        </NewsStack.Navigator>
    )
}

/**
 * Learn Stack
 */
 const LearnStack = createStackNavigator();
 import LearnLoadingScreen from './screens/LearnLoadingScreen';
 import LearnIndexScreen from './screens/LearnIndexScreen';
 import LearnCategoryShowScreen from './screens/LearnCategoryShowScreen';
 import LearnModuleShowScreen from './screens/LearnModuleShowScreen';
 import LearnModulePartShowScreen from './screens/LearnModulePartShowScreen';
 import LearnAccreditationPartShowScreen from './screens/LearnAccreditationPartShowScreen';
 import LearnAccreditationResultShowScreen from './screens/LearnAccreditationResultShowScreen';

 export const Learn = () => {
     return (
         <LearnStack.Navigator
             initialRouteName="learn.loading"
             screenOptions={{
                 headerLeft: () => ( <HeaderMenuButton /> ),
                 headerBackground: () => (
                     <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.purple } start={{ x: 1, y: 1 }} end={{ x: 0, y: 0 }} />
                 ),
                 headerStyle: STYLES.header.headerMenutyle,
                 headerTintColor: STYLES.header.headerTintColor,
                 headerTitleStyle: STYLES.header.headerTitleStyle,
             }}
         >
             <LearnStack.Screen
                 name="learn.loading"
                 component={LearnLoadingScreen}
                 options={{
                     headerLeft: () => ( <HeaderMenuButton /> ),
                     title: 'Learn',
                 }}
             />
             <LearnStack.Screen
                 name="learn.index"
                 component={LearnIndexScreen}
                 options={{
                     headerLeft: () => ( <HeaderMenuButton /> ),
                     title: 'Learn',
                 }}
             />
             <LearnStack.Screen
                 name="learn.category.show"
                 component={LearnCategoryShowScreen}
                 options={{
                     headerLeft: () => ( <HeaderBackButton /> ),
                     title: 'Learn',
                 }}
             />
             <LearnStack.Screen
                 name="learn.module.show"
                 component={LearnModuleShowScreen}
                 options={{
                     headerLeft: () => ( <HeaderBackButton /> ),
                     title: 'Learn',
                 }}
             />
             <LearnStack.Screen
                 name="learn.module.part.show"
                 component={LearnModulePartShowScreen}
                 options={{
                     headerLeft: () => ( <HeaderBackButton /> ),
                     title: 'Learn',
                 }}
             />
             <LearnStack.Screen
                 name="learn.module.part.show.accreditation"
                 component={LearnAccreditationPartShowScreen}
                 options={{
                     headerLeft: () => ( <HeaderBackAccreditationButton /> ),
                     title: 'Learn',
                 }}
             />
             <LearnStack.Screen
                 name="learn.accreditation.result.show"
                 component={LearnAccreditationResultShowScreen}
                 options={{
                     headerLeft: () => ( <HeaderMenuButton /> ),
                     title: 'Accreditation',
                 }}
             />
         </LearnStack.Navigator>
     )
 }

/**
 * Challenge Stack
 */
 const ChallengeStack = createStackNavigator();
 import ChallengeIndexScreen from './screens/ChallengeIndexScreen';

 export const Challenge = () => {
     return (
         <ChallengeStack.Navigator
             initialRouteName="challenge.index"
             screenOptions={{
                 headerBackground: () => (
                     <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.navy } start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
                 ),
                 headerStyle: STYLES.header.headerMenutyle,
                 headerTintColor: STYLES.header.headerTintColor,
                 headerTitleStyle: STYLES.header.headerTitleStyle,
             }}
         >
             <ChallengeStack.Screen
                 name="challenge.index"
                 component={ChallengeIndexScreen}
                 options={{
                     title: '3D Secure',
                 }}
             />
         </ChallengeStack.Navigator>
     )
 }

/**
 * Menu Stack
 */
const MenuStack = createStackNavigator();
import MenuIndexScreen from './screens/MenuIndexScreen';
import MenuTermsScreen from './screens/MenuTermsScreen';
import MenuDeveloperToolsScreen from './screens/MenuDeveloperToolsScreen';
import MenuDeveloperErrorLogsScreen from './screens/MenuDeveloperErrorLogsScreen';
// due to the way stack navigator works, these account screens behave more smoothly on navigation when parrt of the menu stack
import AccountShowScreen from './screens/AccountShowScreen';
import AccountEditScreen from './screens/AccountEditScreen';
import AccountPreferencesScreen from './screens/AccountPreferencesScreen';
import AccountSettingsScreen from './screens/AccountSettingsScreen';
import SampleScreen from './screens/SampleScreen';
import TopOffersScreen from './screens/TopOffersScreen';
import BallotsListScreen from './screens/BallotsListScreen';
import RewardsBallotShowScreen from './screens/RewardsBallotShowScreen';

export const Menu = () => {
    return (
        <MenuStack.Navigator
            initialRouteName="menu.index"
            >
            <MenuStack.Screen
                name="menu.index"
                component={MenuIndexScreen}
                options={{
                    headerShown: false
                }}
            />
            <MenuStack.Screen
                name="menu.terms"
                component={MenuTermsScreen}
                options={{
                    headerLeft: () => ( <HeaderBackButton /> ),
                    title: 'Terms & Conditions',
                    headerBackground: () => (
                        <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.pink } start={STYLES.gradients.left} end={STYLES.gradients.right} />
                    ),
                    headerStyle: STYLES.header.headerMenutyle,
                    headerTintColor: STYLES.header.headerTintColor,
                    headerTitleStyle: STYLES.header.headerTitleStyle,
                    cardStyle: { backgroundColor: '#FFFFFF' },
                }}
            />
            <MenuStack.Screen
                name="menu.developer"
                component={MenuDeveloperToolsScreen}
                options={{
                    headerLeft: () => ( <HeaderBackButton /> ),
                    title: 'Developer Tools',
                    headerBackground: () => (
                        <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.pink } start={STYLES.gradients.left} end={STYLES.gradients.right} />
                    ),
                    headerStyle: STYLES.header.headerMenutyle,
                    headerTintColor: STYLES.header.headerTintColor,
                    headerTitleStyle: STYLES.header.headerTitleStyle,
                    cardStyle: { backgroundColor: '#FFFFFF' },
                }}
            />
            <MenuStack.Screen
                name="menu.error_logs"
                component={MenuDeveloperErrorLogsScreen}
                options={{
                    headerLeft: () => ( <HeaderBackButton /> ),
                    title: 'Error Logs',
                    headerBackground: () => (
                        <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.pink } start={STYLES.gradients.left} end={STYLES.gradients.right} />
                    ),
                    headerStyle: STYLES.header.headerMenutyle,
                    headerTintColor: STYLES.header.headerTintColor,
                    headerTitleStyle: STYLES.header.headerTitleStyle,
                    cardStyle: { backgroundColor: '#FFFFFF' },
                }}
            />
            {
            // due to the way stack navigator works, these account screens behave more smoothly on navigation when parrt of the menu stack
            }
            <AccountStack.Screen
                name="account.settings"
                component={AccountSettingsScreen}
                options={{
                    headerLeft: () => ( <HeaderBackButton /> ),
                    title: 'Settings',
                    headerBackground: () => (
                        <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.pink } start={STYLES.gradients.left} end={STYLES.gradients.right} />
                    ),
                    headerStyle: STYLES.header.headerMenutyle,
                    headerTintColor: STYLES.header.headerTintColor,
                    headerTitleStyle: STYLES.header.headerTitleStyle,
                    cardStyle: { backgroundColor: '#FFFFFF' },
                }}
            />
            <AccountStack.Screen
                name="account.show"
                component={AccountShowScreen}
                options={{
                    headerLeft: () => ( <HeaderBackButton /> ),
                    title: 'Account',
                    headerBackground: () => (
                        <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.pink } start={STYLES.gradients.left} end={STYLES.gradients.right} />
                    ),
                    headerStyle: STYLES.header.headerMenutyle,
                    headerTintColor: STYLES.header.headerTintColor,
                    headerTitleStyle: STYLES.header.headerTitleStyle,
                    cardStyle: { backgroundColor: '#FFFFFF' },
                }}
            />
            <AccountStack.Screen
                name="account.edit"
                component={AccountEditScreen}
                options={{
                    headerLeft: () => ( <HeaderBackButton /> ),
                    title: 'Edit Account',
                    headerBackground: () => (
                        <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.pink } start={STYLES.gradients.left} end={STYLES.gradients.right} />
                    ),
                    headerStyle: STYLES.header.headerMenutyle,
                    headerTintColor: STYLES.header.headerTintColor,
                    headerTitleStyle: STYLES.header.headerTitleStyle,
                    cardStyle: { backgroundColor: '#FFFFFF' },
                }}
            />
            <AccountStack.Screen
                name="account.preferences"
                component={AccountPreferencesScreen}
                options={{
                    headerLeft: () => ( <HeaderBackButton /> ),
                    title: 'Preferences',
                    headerBackground: () => (
                        <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.pink } start={STYLES.gradients.left} end={STYLES.gradients.right} />
                    ),
                    headerStyle: STYLES.header.headerMenutyle,
                    headerTintColor: STYLES.header.headerTintColor,
                    headerTitleStyle: STYLES.header.headerTitleStyle,
                    cardStyle: { backgroundColor: '#FFFFFF' },
                }}
            />
            <AccountStack.Screen
                name="menu.top_offers"
                component={TopOffersScreen}
                options={{
                    headerLeft: () => ( <HeaderBackButton /> ),
                    title: 'Top Offers',
                    headerBackground: () => (
                        <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.green } start={STYLES.gradients.left} end={STYLES.gradients.right} />
                    ),
                    headerStyle: STYLES.header.headerMenutyle,
                    headerTintColor: STYLES.header.headerTintColor,
                    headerTitleStyle: STYLES.header.headerTitleStyle,
                    cardStyle: { backgroundColor: '#FFFFFF' },
                }}
            />
            <AccountStack.Screen
                name="ballots.index"
                component={BallotsListScreen}
                options={{
                    headerLeft: () => ( <HeaderBackButton /> ),
                    title: 'Ballots',
                    headerBackground: () => (
                        <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.navy } start={STYLES.gradients.left} end={STYLES.gradients.right} />
                    ),
                    headerStyle: STYLES.header.headerMenutyle,
                    headerTintColor: STYLES.header.headerTintColor,
                    headerTitleStyle: STYLES.header.headerTitleStyle,
                    cardStyle: { backgroundColor: '#FFFFFF' },
                }}
            />
            <RewardsStack.Screen
                name="ballots.show"
                component={RewardsBallotShowScreen}
                options={{
                    headerLeft: () => ( <HeaderBackButton /> ),
                    title: 'Ballot',
                    headerBackground: () => (
                        <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.navy } start={STYLES.gradients.left} end={STYLES.gradients.right} />
                    ),
                    headerStyle: STYLES.header.headerMenutyle,
                    headerTintColor: STYLES.header.headerTintColor,
                    headerTitleStyle: STYLES.header.headerTitleStyle,
                    cardStyle: { backgroundColor: '#FFFFFF' },
                }}
            />
            <AccountStack.Screen
                name="sample"
                component={SampleScreen}
                options={{
                    headerLeft: () => ( <HeaderBackButton /> ),
                    title: 'Example',
                    headerBackground: () => (
                        <LinearGradient style={STYLES.header.container} colors={ STYLES.gradients.pink } start={STYLES.gradients.left} end={STYLES.gradients.right} />
                    ),
                    headerStyle: STYLES.header.headerMenutyle,
                    headerTintColor: STYLES.header.headerTintColor,
                    headerTitleStyle: STYLES.header.headerTitleStyle,
                    cardStyle: { backgroundColor: '#FFFFFF' },
                }}
            />
        </MenuStack.Navigator>
    )
}

/**
 * specify routes on which to hide the bottom tab navigator
 * @param {obj} route
 * @returns {bool} default true
 */
const getTabBarVisibility = route => {

    const routeName = getFocusedRouteNameFromRoute( route );

    const noBarRoutes = [
        'learn.loading',
        'rewards.show',
        'rewards.ballot',
        'news.show',
        'learn.category.show',
        'learn.module.show',
        'learn.module.part.show',
    ];

    return !noBarRoutes.includes( routeName );
}

/**
 *
 */
const TabsNavigator = createBottomTabNavigator();

export const Tabs = () => {
    return (
        <TabsNavigator.Navigator
            headerMode="none"
            backBehavior={'initialRoute'}
            screenOptions={({ route }) => ({
                tabBarStyle: { paddingBottom: 5, paddingTop: 5},
                tabBarIcon: ({ focused, color, size }) => {

                    let iconName;

                    switch( route.name ) {
                        case 'tab.account':
                            iconName = `rp-icon-club-royal`;
                            break;
                        case 'tab.rewards':
                            iconName = `rp-icon-rewards-gift`;
                            break;
                        case 'tab.mastercard':
                            iconName = `rp-icon-mastercard-default`;
                            break;
                        case 'tab.news':
                            iconName = `rp-icon-news`;
                            break;
                        case 'tab.learn':
                            iconName = `rp-icon-learn`;
                            break;
                        case 'tab.menu':
                            iconName = `rp-icon-menu-more`;
                            break;
                    }

                    return <Icon name={ iconName } size={27} color={ color } style={{ marginTop: 6 }} />;
                },
            })}
            tabBarOptions={{
                style: { height: xlViewport ? STYLES.tab_bar.height.large : STYLES.tab_bar.height.small },
                labelStyle: { paddingBottom: 5 },
                activeTintColor: STYLES.colors.navy.default,
                inactiveTintColor: STYLES.colors.gray.light,
            }}
        >
            <TabsNavigator.Screen
                name="tab.account"
                options={({ route }) => ({
                    tabBarLabel: 'Dashboard',
                    tabBarVisible: getTabBarVisibility( route )
                })}
                component={Account}
            />
            <TabsNavigator.Screen
                name="tab.rewards"
                options={({ route }) => ({
                    tabBarLabel: 'Rewards',
                    tabBarVisible: getTabBarVisibility( route )
                })}
                component={Rewards}
            />
            <TabsNavigator.Screen
                name="tab.mastercard"
                options={({ route }) => ({
                    tabBarLabel: 'Mastercard',
                    tabBarVisible: getTabBarVisibility( route )
                })}
                component={Mastercard}
            />
            <TabsNavigator.Screen
                name="tab.learn"
                options={({ route }) => ({
                    tabBarLabel: 'Learn',
                    tabBarVisible: getTabBarVisibility( route )
                })}
                component={Learn}
            />
            <TabsNavigator.Screen
                name="tab.news"
                options={({ route }) => ({
                    tabBarLabel: 'News',
                    tabBarVisible: getTabBarVisibility( route )
                })}
                component={News}
            />
            {/*
            <TabsNavigator.Screen
                name="tab.menu"
                options={{ tabBarLabel: 'More' }}
                component={Menu}
            />
            */}
        </TabsNavigator.Navigator>
    )
}

/**
 * Main Stack
 */
const MainStack = createStackNavigator();
import MainLoadingScreen from './screens/MainLoadingScreen';

export const Main = () => {
    return (
        <MainStack.Navigator
            headerMode="none"
            initialRouteName="main.loading"
        >
            <MainStack.Screen
                name="main.loading"
                component={MainLoadingScreen}
            />
            <MainStack.Screen
                name="main.tabs"
                component={Tabs}
            />
            <MainStack.Screen
                name="main.menu"
                component={Menu}
            />
        </MainStack.Navigator>
    )
}

/**
 * deep linking
 */

 export const Linking = {
    prefixes: ['https://rcclhub.phoenixcms.co.uk','https://www.myclubroyal.co.uk', 'clubrewards://'],
    //prefixes: ['clubrewards://'],
    config: {
        screens: {
            app: 'mastercard',
            register: {
                screens: {
                    // first work email verification following the POST /register/pre-verify request
                    //'register.account': 'register/account/:regTag',
                    'register.account': '#/register/:regTag',
                    // second verification following the POST /register request
                    //'register.password': 'register/verify-email/:regTag'
                    'register.password': '#/register/activate/:regTag'
                }
            },
        },
    },
};

// https://rcclhub.phoenixcms.co.uk/#/register/activate/PZCkVXKrZFFH1nfzOqDgTjNgaKRWFqdUhMmIxHIM1X63DGucTVm4QZopnrHe
// clubrewards://register/verify-email/PZCkVXKrZFFH1nfzOqDgTjNgaKRWFqdUhMmIxHIM1X63DGucTVm4QZopnrHe

// https://rcclhub.phoenixcms.co.uk/apple-app-site-association

// adb shell am start -W -a android.intent.action.VIEW -d "https://www.myclubroyal.co.uk/#/register/D9Z95AeBGTDfhXmwfmzHcLYMR6SjIRxJzNabtO42NkJZlL09dRXyXcCNuhvY" com.rclmastercard

// https://www.myclubroyal.co.uk/#/register/VoWAj5oIx7TL3jwQL2rooR12TuOx6BCRO6aMeFR7LF2SYI5V02K4Y5X5NEl4
// clubrewards://register/account/VoWAj5oIx7TL3jwQL2rooR12TuOx6BCRO6aMeFR7LF2SYI5V02K4Y5X5NEl4

// https://www.myclubroyal.co.uk/#/register/6l2lxEFG6ZydvzduwwgdgbWNpJW7gOhWBAUXJ4J0MQvTbZKIF7Am7IwMitXv
// clubrewards://register/account/6l2lxEFG6ZydvzduwwgdgbWNpJW7gOhWBAUXJ4J0MQvTbZKIF7Am7IwMitXv

// https://www.myclubroyal.co.uk/#/register/activate/LNqlg5bYoMEfQP7rHQH1lb9WC8evTjArIPKQTqDxw5DrWxiyRNAWb1758N8h
// clubrewards://register/verify-email/LNqlg5bYoMEfQP7rHQH1lb9WC8evTjArIPKQTqDxw5DrWxiyRNAWb1758N8h

// https://www.myclubroyal.co.uk/#/register/QyrulLgQFNOX07NQyKhzYgaKEgt5nlyJIjVGfCwXEKTq0pvcn3EP7iNdopZg
// clubrewards://register/account/QyrulLgQFNOX07NQyKhzYgaKEgt5nlyJIjVGfCwXEKTq0pvcn3EP7iNdopZg

// https://www.myclubroyal.co.uk/#/register/activate/5feRtvykVBQoYJxLClCR1qzgL4iLl0P1yutEbvhfFqg6xDJyIcJziH4Ag25H
// clubrewards://register/verify-email/5feRtvykVBQoYJxLClCR1qzgL4iLl0P1yutEbvhfFqg6xDJyIcJziH4Ag25H
