import { Foundation } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, Text, useWindowDimensions, View } from "react-native";
import { Callout, Marker } from "react-native-maps";
import {
  getCattery,
  userLikeACat,
  userUnLikeACat,
} from "../../firebaseUtils/user";
import { CatCard_map } from "../cards/CatCard_map";
import { Colors } from "../styles/Colors";

export function CatteryMarker({
  catsData,
  navigation,
  showCatList,
  setShowCatList,
  flatListRef,
  setMarkerRefList,
}) {
  const { height, width } = useWindowDimensions();
  const [cattery, setCattery] = useState(null);
  const [likeCats, setLikeCats] = useState([]);

  useEffect(() => {
    if (catsData.cattery) {
      getCattery(catsData.cattery).then((cattery) => setCattery(cattery));
    }
  }, [catsData]);

  const onClickLikeButton = () => {
    if (!likeCats.includes(catsData.id)) {
      userLikeACat(catsData.id);
    } else {
      userUnLikeACat(catsData.id);
    }
  };

  const HelperText = (cat) => {
    const catNumber = cat.catteryDoc.cats.length;

    if (catNumber === 1) {
      return "1 cat at this position.";
    } else {
      return catNumber + " cats at this position.";
    }
  };

  const markerOnPress = async (event) => {
    const idString = event._targetInst._debugOwner.memoizedProps.indentifier;
    const id = parseInt(idString, 10);
    if (!isNaN(id)) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      try {
        if (flatListRef.current)
          flatListRef.current.scrollToIndex({ index: id, animated: true });
        else console.log("flatListRef.current is null");
      } catch (e) {
        console.error(e);
      }
    }
  };

  const markerRefList = [];

  useEffect(() => {
    setMarkerRefList(markerRefList);
    console.debug(markerRefList.length);
  }, []);

  return (
    <View>
      {buildMarkers()}

      {showCatList === false ? (
        <View style={{ width: width + 20, alignItems: "center" }}>
          <View
            style={{
              height: 110,
              backgroundColor: "transparent",
              position: "absolute",
              top: height - 211,
              left: 30,
            }}
          >
            <FlatList
              data={catsData}
              renderItem={({ item }) => (
                <CatCard_map cat={item} navigation={navigation} />
              )}
              horizontal
            />
          </View>
        </View>
      ) : (
        <View />
      )}

      <View style={{}}></View>
    </View>
  );

  function buildMarkers() {
    const markersComponent = catsData.map((cat, index) => {
      const markerRef = React.useRef(null);
      markerRefList.push(markerRef);
      return (
        <Marker
          ref={markerRef}
          key={index}
          coordinate={{
            latitude: cat.geoLocation.lat,
            longitude: cat.geoLocation.lng,
          }}
          onPress={markerOnPress}
          indentifier={`${index}`}
        >
          <Foundation name="marker" size={40} color={Colors.orangeText} />

          <Callout>
            <View style={{ backgroundColor: "white", width: 90 }}>
              <Text>{HelperText(cat)}</Text>
            </View>
          </Callout>
        </Marker>
      );
    });

    return markersComponent;
  }
}
