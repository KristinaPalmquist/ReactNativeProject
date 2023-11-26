import { Text } from "@rneui/themed";
import { View, StyleSheet } from "react-native";

export const PostInfo = ({ route }) => {
  const post = route?.params?.post;

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text h4>{post.title}</Text>
        <Text>{post.createdDate}</Text>
        <Text>{post.text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 24,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 36,
  },
  infoContainer: {
    marginBottom: 24,
  },
});
