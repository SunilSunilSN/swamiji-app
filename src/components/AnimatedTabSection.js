import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { InView } from "react-native-intersection-observer";
import { RFValue } from "react-native-responsive-fontsize"; // ✅ responsive sizing

const { width: screenWidth } = Dimensions.get("window");

export default function AnimatedTabSection({ tabs }) {
  const [activeTab, setActiveTab] = useState(0);
  const [containerWidth, setContainerWidth] = useState(screenWidth);
  const underlineAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef(null);
  const fadeAnim = useRef(tabs.map(() => new Animated.Value(0))).current;
  const sectionRef = useRef(null);

  const animationIn = "fadeInUp";
  const animationOut = "fadeOutDown";

  const animateTabContent = (index) => {
    fadeAnim.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === index ? 1 : 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleTabPress = (index) => {
    setActiveTab(index);
    Animated.spring(underlineAnim, {
      toValue: (containerWidth / tabs.length) * index,
      useNativeDriver: true,
    }).start();
    scrollRef.current.scrollTo({ x: containerWidth * index, animated: true });
    animateTabContent(index);
  };

  const handleScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    underlineAnim.setValue(
      (scrollX / containerWidth) * (containerWidth / tabs.length)
    );
    const currentIndex = Math.round(scrollX / containerWidth);
    if (currentIndex !== activeTab) {
      setActiveTab(currentIndex);
      animateTabContent(currentIndex);
    }
  };

  useEffect(() => {
    animateTabContent(activeTab);
  }, [containerWidth]);

  return (
    <InView
      onChange={(inView) => {
        if (inView) sectionRef.current?.[animationIn]?.(800);
        else sectionRef.current?.[animationOut]?.(400);
      }}
    >
      <Animatable.View ref={sectionRef} style={styles.wrapper}>
        <View
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setContainerWidth(width);
          }}
        >
          {/* Tabs Header */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsRow}
          >
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  activeTab === index && styles.activeTab,
                ]}
                onPress={() => handleTabPress(index)}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabText,
                    activeTab === index && styles.activeTabText,
                  ]}
                >
                  {tab.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Underline */}
          <Animated.View
            style={[
              styles.underline,
              {
                width: containerWidth / tabs.length,
                transform: [{ translateX: underlineAnim }],
              },
            ]}
          />

          {/* Tab Content */}
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {tabs.map((tab, index) => (
              <Animated.View
                key={tab.id}
                style={[
                  styles.tabContent,
                  {
                    width: containerWidth,
                    opacity: fadeAnim[index],
                    transform: [
                      {
                        translateY: fadeAnim[index].interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.contentText}>{tab.content}</Text>
              </Animated.View>
            ))}
          </ScrollView>
        </View>
      </Animatable.View>
    </InView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    opacity: 0,
    marginTop: 20,
  },
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 8,
  },
  tabButton: {
    paddingVertical: RFValue(6), // responsive
    paddingHorizontal: RFValue(10),
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginRight: 6,
    backgroundColor: "transparent",
  },
  activeTab: {
    backgroundColor: "#800000",
    borderColor: "#800000",
  },
  tabText: {
    fontWeight: "500",
    color: "#fff",
    fontSize: RFValue(13), // responsive
  },
  activeTabText: {
    fontWeight: "bold",
    color: "#fff",
  },
  underline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 2,
    backgroundColor: "black",
    borderRadius: 2,
  },
  tabContent: {
    padding: RFValue(16),
  },
  contentText: {
    fontSize: RFValue(14), // responsive
    color: "#fff",
    lineHeight: RFValue(20),
    textAlign: "left",
  },
});
