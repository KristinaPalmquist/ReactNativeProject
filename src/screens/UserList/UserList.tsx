import React, { useMemo, useState } from "react";
import ReactLoading from "react-loading";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  Pressable,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import colors from "../../../assets/theme/colors";
import settings from "../../../assets/theme/settings";
import { UserItem } from "../../components/UserItem/UserItem";
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
import { logOut } from "../../store/slices/authSlice";
import { store } from "../../store/store";

const UserList = ({ navigation }) => {
  // const [createLike] = useCreateLikeMutation();
  const {
    data: likes,
    // , refetch: recollect
  } = useGetLikesQuery({});
  const [deleteLike] = useDeleteLikeMutation();
  const { data: users, isLoading, refetch } = useGetUsersQuery({});
  const { data: posts } = useGetPostsQuery({});
  const [deletePost] = useDeletePostMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [selectedUsers, setSelectedUsers] = useState([]);
  let loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  const dispatch = useDispatch();

  const sortedUsers = useMemo(() => {
    loggedInAs = store.getState().auth.loggedInAs;
    if (!users) {
      return [];
    }
    const usersCopy = [...users];
    return usersCopy.sort((a, b) => a.firstName.localeCompare(b.firstName));
  }, [users]);

  function handleCallback(userId) {
    loggedInAs = store.getState().auth.loggedInAs;
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  }

  const bulkDelete = (selectedUsers) => {
    loggedInAs = store.getState().auth.loggedInAs;
    Swal.fire({
      position: "top-end",
      title: `delete users?`,
      text: "think about it",
      showDenyButton: true,
      confirmButtonText: "ok",
      confirmButtonColor: colors.secondary,
      denyButtonText: "cancel",
      denyButtonColor: colors.primary,
    }).then((result) => {
      if (result.isConfirmed) {
        for (const selectedUserId of selectedUsers) {
          try {
            for (const post of posts) {
              if (post.createdBy === selectedUserId) {
                deletePost(post);
              }
              for (const like of likes) {
                if (like.postId === post.id) {
                  deleteLike(like);
                }
              }
            }
            for (const user of users) {
              if (user.id === selectedUserId) {
                if (loggedInAs && user.id === loggedInAs.id) {
                  dispatch(logOut(user));
                }
                deleteUser(user);
              }
            }
            setTimeout(() => {
              refetch();
            }, 2000);
            Swal.fire({
              position: "top-end",
              text: `users have been deleted`,
              showConfirmButton: false,
              timer: 1500,
            });
          } catch (error) {
            console.log("error: ", error);
          }
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
  };

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
        <>
          <FlatList
            data={sortedUsers}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
            renderItem={({ item }) => (
              <UserItem
                item={item}
                navigation={navigation}
                handleCallback={() => handleCallback(item.id)}
              />
            )}
          />
          {selectedUsers.length > 0 ? (
            <Pressable
              onPress={() => bulkDelete(selectedUsers)}
              style={styles.bulkDeleteButton}
              disabled={selectedUsers.length === 0}
            >
              <Text style={styles.buttonText}>delete selected users</Text>
            </Pressable>
          ) : undefined}
        </>
      )}
    </View>
  );
};

export default UserList;

const styles = StyleSheet.create({
  bulkDeleteButton: {
    height: 50,
    width: "80%",
    borderRadius: settings.borderRadius,
    backgroundColor: colors.pink,
    color: colors.white,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    margin: 8,
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
});
