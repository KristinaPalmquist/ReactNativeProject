import { ListItem, CheckBox } from "@rneui/themed";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/fontisto";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

import colors from "../../../assets/theme/colors";
import settings from "../../../assets/theme/settings";
import {
  useDeleteLikeMutation,
  useGetLikesQuery,
} from "../../store/api/likesApi";
import {
  useDeletePostMutation,
  useGetPostsQuery,
} from "../../store/api/postsApi";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../store/api/usersApi";
import "../../../assets/theme/fonts/Raleway-Italic-VariableFont_wght.ttf";
import "../../../assets/theme/fonts/Raleway-VariableFont_wght.ttf";
import { logOut } from "../../store/slices/authSlice";
import { store } from "../../store/store";

export const UserItem = ({ navigation, item, handleCallback }) => {
  const { refetch } = useGetUsersQuery({});
  const [deleteUser] = useDeleteUserMutation();
  const { data: posts } = useGetPostsQuery({});
  const [deletePost] = useDeletePostMutation();
  const {
    data: likes,
    // , refetch: recollect
  } = useGetLikesQuery({});
  const [deleteLike] = useDeleteLikeMutation();
  const [isSelected, setIsSelected] = useState(false);

  let loggedInAs = store.getState().auth.loggedInAs;
  const dispatch = useDispatch();

  function onEdit(item) {
    navigation.navigate("user form", { user: item });
  }

  function indDelete(user) {
    Swal.fire({
      position: "top-end",
      title: `delete user ${user.firstName} ${user.lastName}?`,
      text: "think about it",
      showDenyButton: true,
      confirmButtonText: "ok",
      confirmButtonColor: colors.secondary,
      denyButtonText: "cancel",
      denyButtonColor: colors.primary,
    }).then((result) => {
      loggedInAs = store.getState().auth.loggedInAs;
      if (result.isConfirmed) {
        try {
          Swal.fire({
            position: "top-end",
            text: `user ${user.firstName} ${user.lastName} has been deleted`,
            showConfirmButton: false,
            timer: 1500,
          });
          console.log(`delete user ${user.firstName} ${user.lastName}`);
          for (const like of likes) {
            if (like.userId === user.id) {
              deleteLike(like);
            }
          }
          for (const post of posts) {
            if (post.createdBy === user.id) {
              deletePost(post);
              for (const like of likes) {
                if (like.postId === post.id) {
                  deleteLike(like);
                }
              }
            }
          }
          if (user.id === loggedInAs.id) {
            dispatch(logOut(user));
          }
          deleteUser(user);
          setTimeout(() => {
            refetch();
          }, 2000);
        } catch (error) {
          console.log("could not delete user. error: ", error);
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

  const onChecked = (userId) => {
    setIsSelected(!isSelected);
    handleCallback(userId);
  };

  return (
    <ListItem
      key={item.id}
      onPress={() => {
        navigation.navigate("user info", { user: item });
      }}
    >
      <ListItem.Content style={styles.user}>
        <ListItem.Title style={styles.userName}>
          {`${item.firstName} ${item.lastName}`}
        </ListItem.Title>
        <Icon
          key={item.id + "edit"}
          name="file-1"
          style={styles.editButton}
          onPress={() => {
            onEdit(item);
          }}
        />

        <Icon
          key={item.id + "delete"}
          name="trash"
          style={styles.indDeleteButton}
          onPress={() => indDelete(item)}
        />
        <CheckBox
          checked={isSelected}
          onPress={() => onChecked(item.id)}
          checkedIcon={
            <Icon
              name="checkbox-active"
              color={colors.blue}
              style={styles.checkboxActive}
            />
          }
          uncheckedIcon={
            <Icon
              name="checkbox-passive"
              color={colors.almostBlack8}
              style={styles.checkboxPassive}
            />
          }
          containerStyle={styles.checkboxContainer}
        />
      </ListItem.Content>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  swalText: {
    fontFamily: "Raleway",
  },

  loading: {},
  bulkDeleteButton: {
    height: 50,
    width: "80%",
    margin: "auto",
    borderRadius: settings.borderRadius,
    backgroundColor: colors.pink,
    color: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Raleway",
    fontSize: 21,
    color: colors.white,
  },

  container: {
    flex: 1,
    backgroundColor: colors.lightPink,
  },
  editButton: {
    margin: 5,
    fontSize: 18,
    padding: 2,
    color: colors.secondary,
  },
  indDeleteButton: {
    margin: 5,
    fontSize: 18,
    padding: 2,
    color: colors.primary,
  },
  checkboxActive: {
    fontSize: 18,
  },
  checkboxPassive: {
    fontSize: 18,
  },
  checkboxContainer: {
    margin: "auto",
    padding: 0,
  },
  user: {
    display: "flex",
    flexDirection: "row",
    margin: 4,
    alignItems: "center",
    padding: 4,
  },
  userName: {
    flexGrow: 1,
    textAlign: "left",
    fontSize: 16,
    fontFamily: "Raleway",
  },
});
