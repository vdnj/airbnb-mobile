import {
  Button,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignUpScreen({ setToken, setId }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [passwordOne, setPasswordOne] = useState("");
  const [passwordTwo, setPasswordTwo] = useState("");

  const [isVisible, setIsVisible] = useState(false);
  const [requestProcessing, setRequestProcessing] = useState(false);

  const handleSignUpSubmit = async () => {
    if (
      passwordOne &&
      email &&
      username &&
      description &&
      passwordOne === passwordTwo
    ) {
      try {
        setRequestProcessing(true);
        const response = await axios.post(
          "https://express-airbnb-api.herokuapp.com/user/sign_up",
          { email, username, description, password: passwordOne }
        );
        console.log(response.data);
        const token = response.data.token;
        await setToken(token);
        const id = response.data.id;
        await setId(id);
      } catch (error) {
        console.log(error.message);
        Alert.alert(
          "Email or Username already taken",
          "Please change it to sign up"
        );
      }
      setRequestProcessing(false);
    } else if (passwordOne && passwordOne !== passwordTwo) {
      Alert.alert("Passwords are different", "Please type again");
    } else {
      Alert.alert("Element missing", "Add it and try again");
    }
  };

  return requestProcessing ? (
    <View style={styles.waitScreen}>
      <Text>Request in process</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <View>
      <View>
        <Text>Email: </Text>
        <TextInput
          placeholder="Email"
          onChangeText={(mail) => setEmail(mail)}
        />
        <Text>Username: </Text>
        <TextInput
          placeholder="Username"
          onChangeText={(name) => setUsername(name)}
        />
        <Text>Description: </Text>
        <TextInput
          placeholder="Describe yourself in a few words..."
          multiline={true}
          numberOfLines={4}
          onChangeText={(desc) => setDescription(desc)}
        />
        <Text>Password: </Text>
        <View style={styles.passInput}>
          <TextInput
            placeholder="Password"
            secureTextEntry={isVisible ? false : true}
            onChangeText={(passOne) => setPasswordOne(passOne)}
          />
          <TouchableOpacity
            onPress={() =>
              isVisible ? setIsVisible(false) : setIsVisible(true)
            }
          >
            <Text>👁 </Text>
          </TouchableOpacity>
        </View>
        <Text>Password: </Text>
        <View style={styles.passInput}>
          <TextInput
            placeholder="Confirm password"
            secureTextEntry={isVisible ? false : true}
            onChangeText={(passTwo) => setPasswordTwo(passTwo)}
          />
          <TouchableOpacity
            onPress={() =>
              isVisible ? setIsVisible(false) : setIsVisible(true)
            }
          >
            <Text>👁 </Text>
          </TouchableOpacity>
        </View>
        <Button title="Sign up" onPress={handleSignUpSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  passInput: {
    flexDirection: "row",
  },
  waitScreen: {
    justifyContent: "center",
    alignItems: "center",
  },
});
