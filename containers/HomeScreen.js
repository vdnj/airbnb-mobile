import { useNavigation } from "@react-navigation/core";
import {
  Button,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";

import RoomCard from "../components/RoomCard";

export default function HomeScreen() {
  const navigation = useNavigation();

  const [rooms, setRooms] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://express-airbnb-api.herokuapp.com/rooms"
        );
        setRooms(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <RoomCard
        title={item.title}
        roomPic={item.photos[0].url}
        price={item.price}
        rating={item.ratingValue}
        numOfRating={item.reviews}
        profilePic={item.user.account.photo.url}
        id={item._id}
      />
    );
  };

  return isLoading ? (
    <View style={styles.waitScreen}>
      <Text>Request in process</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <View>
      <FlatList
        data={rooms}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
      {/* <Button
        title="Go to Profile"
        onPress={() => {
          navigation.navigate("Profile", { userId: 123 });
        }}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  waitScreen: {
    justifyContent: "center",
    alignItems: "center",
  },
});
