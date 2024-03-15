import React from 'react';
// https://reactnavigation.org/
// import analytics from '@react-native-firebase/analytics';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// contexts
import AuthContextProvider, { AuthContext } from './src/context/AuthContext';
import UserContextProvider from './src/context/UserContext';
import NewsContextProvider from './src/context/NewsContext';
import LearnContextProvider from './src/context/LearnContext';
import OnboardingContextProvider, { OnboardingContext } from './src/context/OnboardingContext';

// routes
import * as Routes from './src/Routes';

// https://docs.sentry.io/platforms/react-native/
/*
import * as Sentry from '@sentry/react-native';
Sentry.init({ 
    dsn: 'https://6d1ff56bb44f465fa19253dbdcb2838f@o61524.ingest.sentry.io/6080627',
    tracesSampleRate: 1.0, 
});
*/


/**
 * Base Stack
 */
const BaseStack = createStackNavigator();

const getAppStack = ( isAuthenticated, isOnboarded, has3DSChallenge ) => {

    // foremost, return the auth stack if the user is unauthenticated.
    if( !isAuthenticated ) {
        return Routes.Auth;
    }
    // user is authenticated ->

    // if we're not onboarded, return the onboarding
    if( !isOnboarded ) {
        return Routes.Onboarding;
    }
    // user is onboarded ->

    // if the user has a 3DS challenge, we need to deal with that above all else
    // so we force it in place of the main route - user can't then do anything else until 3DS is dealt with
    // (and also they can't accidentally navigate away from it)
    if( has3DSChallenge === true ) {
        // NOTE: hidden in phase 1 release
        return Routes.Challenge;
    }

    return Routes.Main;
}

function App() {

    const routeNameRef = React.useRef();
    const navigationRef = React.useRef();

    return (
        <AuthContextProvider>
            <AuthContext.Consumer>{( authContext ) => {
                return (
                    <UserContextProvider>
                        <LearnContextProvider>
                            <OnboardingContextProvider>
                                <OnboardingContext.Consumer>{( onboardingContext ) => {
                                    return (
                                        <NewsContextProvider>
                                            <NavigationContainer 
                                                linking={Routes.Linking}
                                                ref={navigationRef}
                                                onReady={() => {
                                                    routeNameRef.current = navigationRef.current.getCurrentRoute().name;
                                                }}
                                                onStateChange={async () => {
                                                    const previousRouteName = routeNameRef.current;
                                                    const currentRouteName = navigationRef.current.getCurrentRoute().name;

                                                    if (previousRouteName !== currentRouteName) {
                                                        // await analytics().logScreenView({
                                                        //     screen_name: currentRouteName,
                                                        //     screen_class: currentRouteName,
                                                        // });
                                                    }
                                                    routeNameRef.current = currentRouteName;
                                                }}
                                            >
                                                <BaseStack.Navigator
                                                    initialRouteName={'app'}
                                                    headerMode="none"
                                                >
                                                    <BaseStack.Screen
                                                        name="app"
                                                        component={ getAppStack( authContext.isAuthenticated, onboardingContext.isOnboarded, authContext.has3DSChallenge )}
                                                    />
                                                    <BaseStack.Screen
                                                        name="register"
                                                        component={ Routes.Register }
                                                    />
                                                </BaseStack.Navigator>
                                            </NavigationContainer>
                                        </NewsContextProvider>
                                    );
                                }}</OnboardingContext.Consumer>
                            </OnboardingContextProvider>
                        </LearnContextProvider>
                    </UserContextProvider>
                );
            }}</AuthContext.Consumer>
        </AuthContextProvider>
    );
}

//export default Sentry.wrap(App);

export default App;