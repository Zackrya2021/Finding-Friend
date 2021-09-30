import React from "react";
import {
  createAppContainer,
  createSwitchNavigator,
  StackActions,
  NavigationActions,
} from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Feather, Fontisto } from "@expo/vector-icons";

import {
  ChooseProfilePicture,
  ForgotPassword,
  LogIn,
  SignUp,
  ChatList,
  FriendList,
  Room,
  Loading,
  MapDetail,
  ChangeEmail,
  ChangePassword,
  EditProfile,
  FriendProfile,
  Setting,
  UserProfile,
  Search,
} from "./src/screens";

const AuthStack = createStackNavigator(
  {
    LogIn: LogIn,
    SignUp: SignUp,
    ForgotPassword: ForgotPassword,
    ChooseProfilePicture: ChooseProfilePicture,
  },
  {
    headerMode: "none",
    initialRouteName: "LogIn",
  }
);

const MapStack = createStackNavigator(
  {
    MapDetail: MapDetail,
  },
  {
    headerMode: "none",
    initialRouteName: "MapDetail",
    navigationOptions: {
      title: "Map",
      tabBarIcon: <Feather name="map-pin" size={22} color="#1EA362" />,
      tabBarOptions: {
        activeTintColor: "#1EA362",
        style: {
          backgroundColor: "black",
        },
      },
    },
  }
);

const ChatStack = createStackNavigator(
  {
    ChatList: ChatList,
    FriendList: FriendList,
    Room: Room,
  },
  {
    headerMode: "none",
    initialRouteName: "ChatList",
    navigationOptions: {
      title: "Chat",
      tabBarIcon: <Fontisto name="hipchat" size={22} color="#FFFC00" />,
      tabBarOptions: {
        keyboardHidesTabBar: false,
        activeTintColor: "#FFFC00",
        style: {
          backgroundColor: "black",
        },
      },
    },
  }
);

const SearchStack = createStackNavigator(
  {
    Search: Search,
    FriendProfile: FriendProfile,
  },
  {
    headerMode: "none",
    initialRouteName: "Search",
    navigationOptions: {
      title: "Discover",
      tabBarIcon: <Fontisto name="search" size={22} color="#de5246" />,
      tabBarOptions: {
        activeTintColor: "#de5246",
        style: {
          backgroundColor: "black",
        },
      },
    },
  }
);

const ProfileStack = createStackNavigator(
  {
    UserProfile: UserProfile,
    Setting: Setting,
    EditProfile: EditProfile,
    ChangeEmail: ChangeEmail,
    ChangePassword: ChangePassword,
  },
  {
    headerMode: "none",
    navigationOptions: {
      title: "Profile",
      tabBarIcon: <Feather name="user" size={24} color="#4A89F3" />,
      tabBarOptions: {
        activeTintColor: "#4A89F3",
        style: {
          backgroundColor: "black",
        },
      },
    },
  }
);

const mainFlow = createBottomTabNavigator(
  {
    MapStack,
    ChatStack,
    SearchStack,
    ProfileStack,
  },
  {
    headerMode: "none",
    backBehavior: "none",
    defaultNavigationOptions: {
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        defaultHandler();
        if (navigation.state.index > 0) {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: navigation.state.routes[0].routeName,
              }),
            ],
          });
          navigation.dispatch(resetAction);
        }
      },
    },
  }
);

const switchNavigator = createSwitchNavigator(
  {
    Loading: Loading,
    AuthStack,
    mainFlow,
  },
  {
    initialRouteName: "Loading",
  }
);

const Apps = createAppContainer(switchNavigator);

export default () => {
  return <Apps />;
};
