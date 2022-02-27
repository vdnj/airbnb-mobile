import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

const AroundMeScreen = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //   function sleep(ms) {
  //     return new Promise((resolve) => setTimeout(resolve, ms));
  //   }

  useEffect(async () => {
    console.log("Entering useEffect on AroundMeScreen");
    const fetchData = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync();

          setLatitude(location.coords.latitude);
          setLongitude(location.coords.longitude);
        } else {
          alert("Permission Refusée !");
        }
        console.log(latitude, longitude);
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/around?latitude=${latitude}&longitude=${longitude}`
        );
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, [latitude, longitude]);

  return isLoading ? (
    <View style={styles.waitScreen}>
      <Text>Request in process</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <View style={styles.container}>
      <MapView
        // provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        showsUserLocation={true}
        style={styles.map}
      >
        {data.map((item, index) => {
          return (
            <MapView.Marker
              key={index}
              coordinate={{
                latitude: item.location[1],
                longitude: item.location[0],
              }}
            />
          );
        })}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  waitScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    height: 500,
    width: "100%",
  },
});

export default AroundMeScreen;
