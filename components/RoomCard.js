import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";

import { Rating, AirbnbRating } from "react-native-ratings";

import { useNavigation } from "@react-navigation/native";

const RoomCard = ({
  title,
  price,
  roomPic,
  profilePic,
  rating,
  numOfRating,
  id,
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.roomCard}
      onPress={() => {
        navigation.navigate("Room", { id });
      }}
    >
      <View>
        <Image
          source={{
            uri: roomPic,
          }}
          style={styles.roomPic}
        />
        <Text style={styles.price}>{price} €</Text>
      </View>
      <Text>{title}</Text>
      <View style={styles.rating}>
        <AirbnbRating
          count={5}
          defaultRating={rating}
          size={20}
          reviews={[]}
          style={styles.stars}
        />
        <Text>{numOfRating} reviews</Text>
        <Image source={{ uri: profilePic }} style={styles.profilePic} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  roomCard: {
    margin: 20,
  },
  roomPic: {
    height: 200,
    width: Dimensions.get("window").width - 40,
    position: "relative",
  },
  price: {
    position: "absolute",
    bottom: 10,
    left: 0,
    backgroundColor: "black",
    color: "white",
    padding: 10,
  },
  rating: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  stars: {
    margin: 0,
    padding: 0,
  },
  profilePic: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
});

export default RoomCard;
