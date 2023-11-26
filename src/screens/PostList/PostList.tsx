import React from "react";
import ReactLoading from "react-loading";
import { View, FlatList, RefreshControl, StyleSheet } from "react-native";

import colors from "../../../assets/theme/colors";
import { PostItem } from "../../components/PostItem/PostItem";
import { useGetPostsQuery } from "../../store/api/postsApi";
import { store } from "../../store/store";

export const PostList = (props) => {
  const { navigation } = props;
  const { data, isLoading, refetch } = useGetPostsQuery({});
  const loggedInAs = store.getState().auth.loggedInAs;
  const visibleItems = data
    ? data.filter(
        (item) =>
          !(item.private && loggedInAs && item.createdBy !== loggedInAs.id)
      )
    : [];

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ReactLoading
            type="spinningBubbles"
            color={colors.secondary}
            height={200}
            width={200}
          />
        </View>
      ) : (
        <FlatList
          data={visibleItems}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          renderItem={({ item }) => (
            <PostItem item={item} navigation={navigation} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightPink,
  },
  deleteBtn: {
    fontSize: 18,
    padding: 2,
    color: colors.primary,
  },
  editBtn: {
    fontSize: 21,
    padding: 2,
    color: colors.secondary,
  },
  post: {
    display: "flex",
    flexDirection: "row",
    margin: 4,
  },
  postInfo: {
    flexDirection: "column",
    width: "100%",
  },
  postTitle: {
    flexGrow: 1,
    textAlign: "left",
    fontSize: 16,
    fontFamily: "Raleway",
  },
  line: {
    height: 20,
    borderBottomColor: colors.almostBlack3,
    borderBottomWidth: 1,
  },
});
