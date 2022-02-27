import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

const RoomScreen = ({ route }) => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/${route.params.id}`
        );
        setData(response.data);
      } catch (error) {
        console.log(error.message);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return isLoading ? (
    <View style={styles.waitScreen}>
      <Text>Request in process</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <ScrollView style={styles.container}>
      <View>
        <Image
          source={{
            uri: data.photos[0].url,
          }}
          style={styles.roomPic}
        />
        <Text style={styles.price}>{data.price} €</Text>
      </View>
      <Text numberOfLines={showAll ? 0 : 3}>{data.description}</Text>
      {!showAll && (
        <TouchableOpacity
          onPress={() => {
            setShowAll(true);
          }}
        >
          <Text>Show More</Text>
        </TouchableOpacity>
      )}
      <MapView
        // provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: data.location[1],
          longitude: data.location[0],
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        // showsUserLocation={true}
        style={styles.map}
      >
        <MapView.Marker
          coordinate={{
            latitude: data.location[1],
            longitude: data.location[0],
          }}
        />
      </MapView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  waitScreen: {
    justifyContent: "center",
    alignItems: "center",
  },
  roomPic: {
    height: 200,
    width: Dimensions.get("window").width,
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
  container: {
    flex: 1,
  },
  map: {
    height: 500,
    width: "100%",
  },
});

export default RoomScreen;
