import { CheckBox, Input } from "@rneui/themed";
import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  //  Keyboard,
  Pressable,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import Icon from "react-native-vector-icons/fontisto";

import colors from "../../../assets/theme/colors";
import { useCreatePostMutation } from "../../store/api/postsApi";
import { store } from "../../store/store";

export const PostForm = (props) => {
  const { navigation } = props;
  const [createPost, { isLoading }] = useCreatePostMutation();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const toast = useToast();

  const textRef = useRef(null);

  const [isPrivate, setIsPrivate] = useState(false);

  const newPost = () => {
    if (text === "" || title === "") {
      toast.show("please fill in all fields", {
        type: "warning",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
      return;
    }

    createPost({
      post: {
        createdBy: store.getState().auth.loggedInAs.id,
        createdDate: new Date().toLocaleDateString(),
        private: isPrivate,
        title,
        text,
      },
    })
      .then((data) => {
        navigation.navigate("posts");
        toast.show(`post ${title} was created`, {
          type: "success",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
        setTitle("");
        setText("");
        setIsPrivate(false);
      })
      .catch((error) => {
        toast.show(error, {
          type: "danger",
        });
      });
  };

  return (
    <View style={styles.parentContainer}>
      {/* // <Pressable
    //   onPress={() => Keyboard.dismiss()}
    //   style={styles.parentContainer}
    // > */}
      <View style={styles.container}>
        <Input
          returnKeyType="next"
          onSubmitEditing={() => {
            textRef.current.focus();
          }}
          blurOnSubmit={false}
          disabled={isLoading}
          onChangeText={(title) => setTitle(title)}
          value={title}
          placeholder="title"
          placeholderTextColor={colors.almostBlack3}
          style={styles.input}
          inputContainerStyle={styles.inputContainer}
        />
        <Input
          ref={textRef}
          disabled={isLoading}
          returnKeyType="send"
          onSubmitEditing={() => newPost()}
          onChangeText={(text) => setText(text)}
          value={text}
          placeholder="post"
          style={styles.inputText}
          inputContainerStyle={styles.inputContainer}
          multiline
          numberOfLines={5}
        />
        <CheckBox
          title="make this post private"
          textStyle={{ fontWeight: "normal", fontFamily: "RalewayItalic" }}
          checked={isPrivate}
          onPress={() => setIsPrivate(!isPrivate)}
          iconType="material"
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
        <Pressable
          disabled={isLoading}
          onPress={() => newPost()}
          style={[styles.input, styles.createButton]}
        >
          <Text style={styles.createButtonText}>create post</Text>
        </Pressable>
      </View>
      {/* // </Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    borderColor: colors.almostBlack3,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.almostBlack3,
  },
  container: {
    flex: 1,
    width: "90%",
    marginTop: 40,
    marginBottom: 60,
    padding: 16,
    borderRadius: 6,
    justifyContent: "center",
    backgroundColor: colors.lightPink,
  },
  input: {
    height: 50,
    borderRadius: 6,
    backgroundColor: colors.white,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Raleway",
  },
  inputContainer: {
    borderBottomWidth: 0,
  },
  inputText: {
    height: 120,
    borderRadius: 6,
    backgroundColor: colors.white,
    fontSize: 18,
    textAlign: "center",
    fontFamily: "Raleway",
  },
  checkboxActive: {
    fontSize: 18,
  },
  checkboxPassive: {
    fontSize: 18,
  },
  checkboxContainer: {
    marginTop: 0,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  createButton: {
    height: 50,
    marginLeft: 10,
    marginRight: 10,
    paddingLeft: 0,
    backgroundColor: colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonText: {
    color: colors.white,
    fontFamily: "Raleway",
    fontSize: 18,
  },
});
