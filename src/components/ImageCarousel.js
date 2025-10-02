import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Text,
  Dimensions,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { RFValue } from "react-native-responsive-fontsize";

const { width } = Dimensions.get("window");

export default function ImageCarousel({ data, autoScrollInterval = 4000 }) {
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const textAnims = useRef(data.map(() => new Animated.Value(0))).current;

  // Auto-scroll
  useEffect(() => {
    if (isScrolling) return;
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= data.length) nextIndex = 0;
      flatListRef.current?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, autoScrollInterval);
    return () => clearInterval(interval);
  }, [currentIndex, isScrolling]);

  // Animate text
  useEffect(() => {
    textAnims.forEach((anim, index) => {
      if (index === currentIndex) {
        Animated.timing(anim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start();
      } else {
        anim.setValue(0);
      }
    });
  }, [currentIndex]);

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.95, 1, 0.95],
      extrapolate: "clamp",
    });
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: "clamp",
    });

    const textOpacity = textAnims[index];
    const textTranslateY = textAnims[index].interpolate({
      inputRange: [0, 1],
      outputRange: [responsiveHeight(3), 0],
    });

    return (
      <Animated.View
        style={[styles.itemContainer, { transform: [{ scale }], opacity }]}
      >
        <Image source={item.image} style={styles.image} />
        <View style={styles.darkOverlay} />
        <Animated.View
          style={[
            styles.textOverlay,
            { opacity: textOpacity, transform: [{ translateY: textTranslateY }] },
          ]}
        >
          {item.title && <Text style={styles.title}>{item.title}</Text>}
          {item.description && (
            <Text style={styles.description}>{item.description}</Text>
          )}
        </Animated.View>
      </Animated.View>
    );
  };

  return (
    <View>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        snapToInterval={width}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScrollBeginDrag={() => setIsScrolling(true)}
        onScrollEndDrag={() => setIsScrolling(false)}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
      />

      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {data.map((_, i) => {
          const dotOpacity = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          const dotScale = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={i.toString()}
              style={[
                styles.dot,
                { opacity: dotOpacity, transform: [{ scale: dotScale }] },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    width: width,
    height: responsiveHeight(30),
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  darkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  textOverlay: {
    position: "absolute",
    bottom: responsiveHeight(2),
    left: responsiveWidth(5),
    right: responsiveWidth(5),
  },
  title: {
    color: "#FFD700",
    fontSize: RFValue(22),
    fontWeight: "bold",
    marginBottom: responsiveHeight(1),
  },
  description: {
    color: "#fff",
    fontSize: RFValue(14),
    lineHeight: RFValue(22),
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: responsiveHeight(1.5),
  },
  dot: {
    width: responsiveWidth(2.5),
    height: responsiveWidth(2.5),
    borderRadius: responsiveWidth(1.25),
    backgroundColor: "#fff",
    marginHorizontal: responsiveWidth(1),
  },
});
