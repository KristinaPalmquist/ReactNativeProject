import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import ReactLoading from "react-loading";
import { StyleSheet, View, StatusBar, Platform } from "react-native";
import { ToastProvider } from "react-native-toast-notifications";
import Icon from "react-native-vector-icons/fontisto";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import colors from "./assets/theme/colors";
import { PostForm } from "./src/screens/PostForm/PostForm";
import { PostInfo } from "./src/screens/PostInfo/PostInfo";
import { PostList } from "./src/screens/PostList/PostList";
import { UserForm } from "./src/screens/UserForm/UserForm";
import { UserInfo } from "./src/screens/UserInfo/UserInfo";
import UserList from "./src/screens/UserList/UserList";
import { persistor, store } from "./src/store/store";
import "./assets/theme/fonts/Raleway-Italic-VariableFont_wght.ttf";
import "./assets/theme/fonts/Raleway-VariableFont_wght.ttf";

const UserListStack = createNativeStackNavigator();

const UserListStackScreen = () => {
  // const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  const userFormOptions = {
    title: "back",
    headerStyle: {
      backgroundColor: colors.almostBlack2,
      height: 40,
      borderBottomColor: colors.black,
    },
    headerTintColor: colors.white,
  };

  return (
    <UserListStack.Navigator>
      <UserListStack.Screen
        name="user list"
        component={UserList}
        options={{ headerShown: false }}
      />
      <UserListStack.Screen
        name="user info"
        component={UserInfo}
        options={{ title: "back" }}
      />
      <UserListStack.Screen
        name="user form"
        component={UserForm}
        options={userFormOptions}
      />
    </UserListStack.Navigator>
  );
};

const PostListStack = createNativeStackNavigator();
const PostListStackScreen = () => {
  // const postFormOptions = {
  //   title: "back",
  //   headerStyle: {
  //     backgroundColor: colors.almostBlack2,
  //     height: 40,
  //     borderBottomColor: colors.black,
  //   },
  //   headerTintColor: colors.white,
  // };

  return (
    <PostListStack.Navigator initialRouteName="PostList">
      <PostListStack.Screen
        name="posts"
        component={PostList}
        options={{ headerShown: false }}
      />
      <PostListStack.Screen
        name="post info"
        component={PostInfo}
        options={{ title: "back" }}
      />
      {/* <PostListStack.Screen
        name="create post"
        component={PostForm}
        // params={post}
        options={
          postFormOptions
          //     { title: 'back'
          //   // , headerShown: false
          // }
        }
      /> */}
    </PostListStack.Navigator>
  );
};
const NavigationWrapper = () => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);

  const screenOptions = {
    // top bar:
    headerStyle: {
      backgroundColor: colors.almostBlack,
      height: 90,
      borderBottomColor: colors.black,
    },
    headerTintColor: colors.secondary,
    headerTitleStyle: {
      fontFamily: "Raleway",
      fontSize: 32,
      margin: 16,
    },
    // bottom bar:
    tabBarStyle: {
      backgroundColor: colors.almostBlack,
      color: colors.white,
      borderTopColor: colors.black,
      height: 70,
    },
    tabBarLabelStyle: {
      margin: 8,
      marginTop: 0,
      fontFamily: "Raleway",
      fontSize: 14,
    },
    // bottom tabs:
    tabBarItemStyle: {
      backgroundColor: colors.almostBlack,
      color: colors.white,
    },
  };

  const options = {
    tabBarIcon: ({ color, focused }) => (
      <Icon
        name={focused ? "day-sunny" : "umbrella"}
        color={focused ? colors.yellow : color}
        size={20}
      />
    ),
    tabBarActiveTintColor: colors.white,
    tabBarActiveBackgroundColor: colors.almostBlack2,
    tabBarInactiveTintColor: colors.almostBlack4,
  };

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="UserList"
          backBehavior="initialRoute"
          screenOptions={screenOptions}
        >
          <Tab.Screen
            name="users"
            component={UserListStackScreen}
            options={options}
          />
          <Tab.Screen
            name="create user"
            component={UserForm}
            options={options}
          />
          <Tab.Screen
            name="posts"
            component={PostListStackScreen}
            options={options}
          />
          {loggedInAs && (
            <Tab.Screen
              name="create post"
              component={PostForm}
              options={options}
            />
          )}
          {loggedInAs && (
            <Tab.Screen
              name="user info"
              component={UserInfo}
              options={{
                title: `${loggedInAs.firstName}`,
                tabBarIcon: ({ color, focused }) => (
                  <Icon
                    name={focused ? "day-sunny" : "umbrella"}
                    color={focused ? colors.yellow : color}
                    size={20}
                  />
                ),
                tabBarActiveTintColor: colors.white,
                tabBarActiveBackgroundColor: colors.almostBlack2,
                tabBarInactiveTintColor: colors.almostBlack4,
              }}
            />
          )}
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
};

const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Raleway: require("./assets/theme/fonts/Raleway-VariableFont_wght.ttf"),
    RalewayItalic: require("./assets/theme/fonts/Raleway-Italic-VariableFont_wght.ttf"),
  });

  return (
    <ToastProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {fontsLoaded === false ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ReactLoading
                type="spinningBubbles"
                color={colors.secondary}
                height={200}
                width={200}
              />
            </View>
          ) : (
            <NavigationWrapper />
          )}
        </PersistGate>
      </Provider>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.almostBlack,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    color: colors.white,
  },
  labelStyle: {
    padding: 4,
  },
});
