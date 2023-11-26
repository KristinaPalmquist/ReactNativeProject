import { Text } from "@rneui/themed";
import {
  View,
  StyleSheet,
  Pressable,
  FlatList,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import colors from "../../../assets/theme/colors";
import { PostItem } from "../../components/PostItem/PostItem";
import { useGetPostsQuery } from "../../store/api/postsApi";
import { logIn, logOut } from "../../store/slices/authSlice";
import { store } from "../../store/store";

export const UserInfo = ({ route, navigation }) => {
  let loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  const user = route?.params?.user || loggedInAs;
  const dispatch = useDispatch();
  const { data, isLoading, refetch } = useGetPostsQuery({});

  const logOutUser = (user) => {
    try {
      dispatch(logOut(user));
      loggedInAs = store.getState().auth.loggedInAs;
    } catch (e) {
      console.error(e);
    }
  };

  const logInUser = (user) => {
    try {
      dispatch(logIn(user));
      loggedInAs = store.getState().auth.loggedInAs;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text
          h4
          style={{ textAlign: "center" }}
        >{`${user.firstName} ${user.lastName}`}</Text>
      </View>
      <View style={styles.actionsContainer}>
        {loggedInAs?.id === user.id ? (
          <Pressable
            onPress={() => logOutUser(user)}
            style={styles.logOutButton}
          >
            <Text
              style={{
                color: colors.white,
                fontFamily: "Raleway",
                fontSize: 18,
              }}
            >
              log out
            </Text>
          </Pressable>
        ) : (
          <Pressable onPress={() => logInUser(user)} style={styles.logInButton}>
            <Text
              style={{
                color: colors.white,
                fontFamily: "Raleway",
                fontSize: 18,
              }}
            >
              log in
            </Text>
          </Pressable>
        )}
        <FlatList
          data={data}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          renderItem={({ item }) =>
            item.createdBy === user.id ? (
              <PostItem item={item} navigation={navigation} />
            ) : null
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 24,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
  },
  infoContainer: {
    marginBottom: 24,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  button: {
    borderRadius: 6,
  },
  logInButton: {
    borderRadius: 6,
    height: 50,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 0,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  logOutButton: {
    borderRadius: 6,
    height: 50,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 0,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
