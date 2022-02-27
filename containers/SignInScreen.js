import { useNavigation } from "@react-navigation/core";
import {
  Button,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import axios from "axios";

export default function SignInScreen({ setToken, setId }) {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [requestProcessing, setRequestProcessing] = useState(false);

  const handleSignInSubmit = async () => {
    if (email && password) {
      try {
        setRequestProcessing(true);
        const response = await axios.post(
          "https://express-airbnb-api.herokuapp.com/user/log_in",
          { email, password }
        );
        const id = response.data.id;
        const token = response.data.token;
        await setId(id);
        await setToken(token);
      } catch (error) {
        Alert.alert("Utilisateur non reconnu", "Veuillez vous inscrire");
      }
      setRequestProcessing(false);
    } else if (email && !password) {
      Alert.alert("Veuillez renseigner un mot de passe");
    } else if (!email && password) {
      Alert.alert("Veuillez renseigner une adresse email");
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
          onChangeText={(mail) => {
            setEmail(mail);
          }}
        />
        <Text>Password: </Text>
        <View style={styles.passInput}>
          <TextInput
            placeholder="Password"
            secureTextEntry={isVisible ? false : true}
            onChangeText={(pass) => setPassword(pass)}
          />
          <TouchableOpacity
            onPress={() =>
              isVisible ? setIsVisible(false) : setIsVisible(true)
            }
          >
            <Text>👁 </Text>
          </TouchableOpacity>
        </View>
        <Button title="Sign in" onPress={handleSignInSubmit} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <Text>Create an account</Text>
        </TouchableOpacity>
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

// const userToken = "secret-token";
// setToken(userToken);
