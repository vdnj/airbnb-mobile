import { useRoute } from "@react-navigation/core";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Image,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen({ id, token, setId, setToken }) {
  // const { params } = useRoute();

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");

  const [selectedPicture, setSelectedPicture] = useState(null);

  const getPermissionAndGetPicture = async () => {
    //Demander le droit d'accéder à la galerie
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status === "granted") {
      //ouvrir la galerie photo
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (result.cancelled === true) {
        alert("Pas de photo sélectionnée");
      } else {
        setSelectedPicture(result.uri);
      }
    } else {
      alert("Permission refusée");
    }
  };

  const getPermissionAndTakePicture = async () => {
    //Demander le droit d'accéder à l'appareil photo
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === "granted") {
      //ouvrir l'appareil photo
      const result = await ImagePicker.launchCameraAsync();
      setSelectedPicture(result.uri);
    } else {
      alert("Permission refusée");
    }
  };

  const handleUpdateClick = async () => {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    console.log("token ==> ", token);
    if ((email, username, description)) {
      console.log("config ===> ", config);
      const dataToSend = {};
      email ? (dataToSend.email = email) : null;
      username ? (dataToSend.username = username) : null;
      description ? (dataToSend.description = description) : null;
      console.log("dataToSend ===> ", dataToSend);

      try {
        const response = await axios.put(
          `https://express-airbnb-api.herokuapp.com/user/update`,
          dataToSend,
          config
        );

        console.log(response.data);
        alert("Profile Data Updated Succesfully");
      } catch (error) {
        console.log(error.message);
      }
    }
    if (selectedPicture) {
      const tab = selectedPicture.split(".");
      const formData = new FormData();
      formData.append("photo", {
        uri: selectedPicture,
        name: `my-pic.${tab[1]}`,
        type: `image/${tab[1]}`,
      });

      try {
        const response = await axios.put(
          `https://express-airbnb-api.herokuapp.com/user/upload_picture`,
          formData,
          config
        );

        console.log(response.data);
        alert("Profile Picture Updated Succesfully");
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/user/${id}`,
          config
        );
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  return isLoading ? (
    <View style={styles.waitScreen}>
      <Text>Request in process</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <View style={styles.container}>
      {/* <Text>user id : {params.userId}</Text> */}
      <Text>user id : {id}</Text>
      <Text>user name : {data.username}</Text>
      <View style={styles.profilePicBloc}>
        <Image
          source={
            selectedPicture
              ? { uri: selectedPicture }
              : data.photo
              ? { uri: data.photo }
              : require("../assets/defaultProfilePic.jpeg")
          }
          style={styles.profilePic}
        />
        <View>
          <TouchableOpacity onPress={getPermissionAndGetPicture}>
            <Ionicons
              name={"image-outline"}
              size={30}
              color={"grey"}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={getPermissionAndTakePicture}>
            <Ionicons
              name={"camera-outline"}
              size={30}
              color={"grey"}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={{
          height: 44,
          width: "70%",
          borderBottomColor: "tomato",
          borderBottomWidth: 1,
        }}
        onChangeText={(text) => {
          setEmail(text);
        }}
        defaultValue={data.email}
      />
      <TextInput
        style={{
          height: 44,
          width: "70%",
          borderBottomColor: "tomato",
          borderBottomWidth: 1,
        }}
        onChangeText={(text) => {
          setUsername(text);
        }}
        defaultValue={data.username}
      />
      <TextInput
        style={{
          height: 44,
          width: "70%",
          borderColor: "tomato",
          borderWidth: 1,
        }}
        multiline={true}
        numberOfLines={4}
        onChangeText={(desc) => setDescription(desc)}
        defaultValue={data.description}
      />
      <Button title="Update" onPress={handleUpdateClick} />
      <Button
        title="Log Out"
        onPress={() => {
          setToken(null);
          setId(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  waitScreen: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  profilePicBloc: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    height: 150,
    width: 150,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "tomato",
  },
  icon: {
    margin: 10,
  },
});
