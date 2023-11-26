import { Input } from "@rneui/themed";
import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  //  Keyboard,
  Pressable,
} from "react-native";
import { useToast } from "react-native-toast-notifications";

import colors from "../../../assets/theme/colors";
import {
  useCreateUserMutation,
  useEditUserMutation,
} from "../../store/api/usersApi";

export const UserForm = (props) => {
  const { route, navigation } = props;
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [firstName, setFirstName] = useState(
    // eslint-disable-next-line prettier/prettier
    route?.params?.user?.firstName || ""
  );
  const [lastName, setLastName] = useState(route?.params?.user?.lastName || "");
  const toast = useToast();
  const lastNameRef = useRef(null);
  const [editUser] = useEditUserMutation();

  const [oldFirstName] = useState(route?.params?.user?.firstName || "");
  const [oldLastName] = useState(route?.params?.user?.lastName || "");

  const newUser = () => {
    if (firstName === "" || lastName === "") {
      toast.show("please fill in all fields", {
        type: "warning",
        placement: "top",
        duration: 4000,
        animationType: "slide-in",
      });
      return;
    }
    createUser({
      user: {
        firstName,
        lastName,
      },
    })
      .then(() => {
        navigation.navigate("user list");
        toast.show(`the user ${firstName} ${lastName} was created`, {
          type: "success",
          placement: "top",
          duration: 4000,
          animationType: "slide-in",
        });
        setFirstName("");
        setLastName("");
      })
      .catch((error) => {
        toast.show(error, {
          type: "danger",
        });
      });
  };
  const oldUser = () => {
    if (firstName !== "" && lastName !== "") {
      editUser({
        id: route?.params?.user?.id,
        firstName,
        lastName,
      });
      toast.show(
        `${oldFirstName} ${oldLastName} \n was updated to \n ${firstName} ${lastName} `,
        {
          type: "success",
          placement: "top",
          duration: 3000,
          animationType: "slide-in",
        }
      );

      setTimeout(() => {
        navigation.navigate("user list");
      }, 5000);
    } else {
      toast.show("please fill in both fields", {
        type: "warning",
        placement: "top",
        duration: 3000,
        animationType: "slide-in",
      });
    }
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
            lastNameRef.current.focus();
          }}
          blurOnSubmit={false}
          disabled={isLoading}
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
          placeholder="first name"
          placeholderTextColor={colors.almostBlack3}
          style={styles.input}
          inputContainerStyle={styles.inputContainer}
        />
        <Input
          ref={lastNameRef}
          disabled={isLoading}
          returnKeyType="send"
          onSubmitEditing={() => newUser()}
          onChangeText={(text) => setLastName(text)}
          value={lastName}
          placeholder="last name"
          style={styles.input}
          inputContainerStyle={styles.inputContainer}
        />
        <Pressable
          disabled={isLoading}
          onPress={() => {
            // eslint-disable-next-line prettier/prettier
            route?.params?.user ? oldUser() : newUser();
          }}
          style={[styles.input, styles.createButton]}
        >
          <Text style={styles.createButtonText}>
            {route?.params?.user ? "update user" : "create user"}
          </Text>
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
    marginTop: 60,
    marginBottom: 80,
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
