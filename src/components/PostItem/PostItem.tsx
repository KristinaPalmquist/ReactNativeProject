import { ListItem } from "@rneui/themed";
import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useToast } from "react-native-toast-notifications";
import Icon from "react-native-vector-icons/fontisto";
import Swal from "sweetalert2";

import colors from "../../../assets/theme/colors";
import {
  useCreateLikeMutation,
  useDeleteLikeMutation,
  useGetLikesQuery,
} from "../../store/api/likesApi";
import {
  // useGetPostsQuery,
  useDeletePostMutation,
} from "../../store/api/postsApi";
import { store } from "../../store/store";

export const PostItem = ({ navigation, item }) => {
  // const { refetch } = useGetPostsQuery({});
  const [deletePost] = useDeletePostMutation();
  let loggedInAs = store.getState().auth.loggedInAs;
  const toast = useToast();

  const [createLike] = useCreateLikeMutation();
  const { data: likes, refetch: recollect } = useGetLikesQuery({});
  const [deleteLike] = useDeleteLikeMutation();

  const [userLike, setUserLike] = useState(false);

  const nbrOfLikes = useMemo(() => {
    loggedInAs = store.getState().auth.loggedInAs;
    let count = 0;
    if (!likes) {
      return 0;
    }
    for (const like of likes) {
      if (like.postId === item.id) {
        count += 1;
        if (loggedInAs && like.userId === loggedInAs.id) {
          setUserLike(true);
        } else {
          setUserLike(false);
        }
      }
    }
    return count;
  }, [likes]);

  function onDelete(item) {
    Swal.fire({
      position: "top-end",
      title: `delete post ${item.title}?`,
      text: "think about it",
      showDenyButton: true,
      confirmButtonText: "ok",
      confirmButtonColor: colors.secondary,
      denyButtonText: "cancel",
      denyButtonColor: colors.primary,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: "top-end",
          text: `post ${item.title} has been deleted`,
          showConfirmButton: false,
          timer: 1500,
        });
        try {
          deletePost(item);
          for (const like of likes) {
            if (like.postId === item.id) {
              deleteLike(like);
            }
          }
          // setTimeout(() => {
          //   refetch();
          // }, 5000);
        } catch (error) {
          console.log("could not delete post. error: ", error);
        }
      } else if (result.isDenied) {
        Swal.fire({
          position: "top-end",
          text: "deletion canceled",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  }

  function onLike(item) {
    loggedInAs = store.getState().auth.loggedInAs;
    if (loggedInAs) {
      if (userLike) {
        for (const like of likes) {
          if (like.postId === item.id && like.userId === loggedInAs.id) {
            deleteLike(like);
          }
        }
        setUserLike(false);
      } else {
        console.log("user not like");
        createLike({
          like: { userId: loggedInAs.id, postId: item.id },
        });
      }
      setTimeout(() => {
        recollect();
      }, 2000);
    } else {
      toast.show(`log in to like`, {
        type: "warning",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
    }
  }
  return (
    <ListItem
      onPress={() => {
        navigation.navigate("post info", { post: item });
      }}
    >
      <ListItem.Content style={styles.post}>
        <View style={styles.postInfo}>
          <ListItem.Title style={styles.postTitle} numberOfLines={1}>
            {item.title} ({item.createdDate})
          </ListItem.Title>

          <Text numberOfLines={1}>{item.text}</Text>
        </View>
        {loggedInAs && loggedInAs.id === item.createdBy ? (
          <Icon
            name="trash"
            style={styles.deleteBtn}
            onPress={() => {
              onDelete(item);
            }}
          />
        ) : (
          <View style={{ width: 26.5, height: 28 }} />
        )}

        {loggedInAs ? (
          <Icon
            name={userLike ? "heart" : "rains"}
            style={userLike ? styles.likeBtn : styles.notLikeBtn}
            onPress={() => {
              onLike(item);
            }}
          />
        ) : (
          <View style={{ width: 26.5, height: 28 }} />
        )}
        <Text style={{ padding: 5 }}>({nbrOfLikes})</Text>
      </ListItem.Content>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightPink,
  },
  deleteBtn: {
    fontSize: 18,
    padding: 5,
    color: colors.primary,
  },
  likeBtn: {
    fontSize: 18,
    padding: 2,
    color: colors.primary,
  },
  notLikeBtn: {
    fontSize: 18,
    padding: 2,
    color: colors.secondary,
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
    alignItems: "center",
  },
  postInfo: {
    flexGrow: 1,
    // flexShrink: 0,
    flexDirection: "column",
    width: "80%",
  },
  postTitle: {
    flexGrow: 1,
    textAlign: "left",
    fontSize: 16,
    fontFamily: "Raleway",
  },
});
