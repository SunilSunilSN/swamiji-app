import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  Alert,
  View,
  ScrollView,
  Animated,
  StyleSheet,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { IOScrollView, InView } from "react-native-intersection-observer";
import { auth } from "../../firebaseConfig";
import { signOut } from "firebase/auth";
import Loader from "../components/Loader";
import ImageCarousel from "../components/ImageCarousel";
import Footer from "../components/Footer";
// import { Video } from "expo-av";
import AnimatedTabSection from "../components/AnimatedTabSection";
import Counter from "../components/Counter";

import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { RFValue, RFPercentage } from "react-native-responsive-fontsize";

const carouselData = [
  {
    image: require("../assets/Images/img1.jpg"),
    title: "",
    description:
      "Swamiji addressed the gathering asking the audience, 'what upasana did Hanuman do? What made Hanuman great and powerful'",
  },
  {
    image: require("../assets/Images/img2.jpg"),
    title: "",
    description:
      "A magnanimous ninety feet statue of Hanuman is inaugurated as the Statue of Union at Ashtalakshmi Temple, Houston, TX, USA. This is the tallest statue of Hanuman outside India.",
  },
  {
    image: require("../assets/Images/img3.jpg"),
    title: "",
    description:
      "Blessings from HH TRIDANDI CHINNA SRIMANNARAYANA RAMANUJA JEEYAR SWAMIJI",
  },
  {
    image: require("../assets/Images/img4.jpg"),
    title: "",
    description:
      "Blessings from HH TRIDANDI CHINNA SRIMANNARAYANA RAMANUJA JEEYAR SWAMIJI",
  },
];
const tabs = [
  {
    id: 0,
    title: "SPIRITUAL BOOKS",
    content:
      "Transformative Spiritual Reads: Enlightenment, Inner Peace, and Self-Discovery Spiritual Books Spiritual books offer profound insights into the realms of inner growth, enlightenment, and the exploration of the human spirit. These books span various traditions, philosophies, and practices, providing readers with a wide range of perspectives on life, purpose, and the nature of existence.",
  },
  {
    id: 1,
    title: "SPIRITUAL MEDIA",
    content:
      "Spiritual Media: Films, Documentaries, and Podcasts for Mindful Exploration' Spiritual Media Spiritual media encompasses a rich tapestry of visual and auditory experiences that nourish the soul and expand the mind. From thought-provoking films and captivating documentaries to enlightening podcasts and mesmerizing art, spiritual media engages with the profound questions of existence, the interconnectedness of humanity, and the exploration of the divine.",
  },
  {
    id: 2,
    title: "BHAKTINIVEDANA",
    content:
      "Bhakti Nivedana: Devotional Practices in Hinduism' Bhaktinivedana 'Bhakti' is a Sanskrit term that signifies a deep and devotional connection to the divine, and 'Nivedana' refers to the act of offering or surrendering. In the context of Hinduism, 'Bhakti Nivedana' represents a heartfelt and complete surrender to the chosen deity, expressing profound love, devotion, and humility.",
  },
];

export default function HomeScreen({ navigation, route, navigateWithLoader }) {
  const [userName, setUserName] = useState(route.params?.userName || "Home");
  const [loading, setLoading] = useState(false);
  const scrollRef1 = useRef(null);
  const scrollRef2 = useRef(null);
  const [showScrollUp1, setShowScrollUp1] = useState(true);
  const [showScrollUp2, setShowScrollUp2] = useState(true);
  const aboutRef = useRef(null);
  const aboutVidRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);
  const scrollRef = useRef(null);

  const animationIn = "fadeInUp";
  const animationOut = "fadeOutDown";

  const handlePlaybackStatus = (status) => {
    if (status.didJustFinish) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        videoRef.current.replayAsync().then(() => {
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start();
        });
      });
    }
  };

  useEffect(() => {
    if (route.params?.userName) setUserName(route.params.userName);
  }, [route.params]);
useEffect(() => {
  const unsubscribe = navigation.addListener("focus", () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ y: 0, animated: true });
    }
  });

  return unsubscribe;
}, [navigation]);
  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setLoading(false);
      Alert.alert("Logged Out", "You have been successfully logged out.");
      navigateWithLoader(() => navigation.replace("Login"));
    } catch (error) {
      setLoading(false);
      Alert.alert("Logout Failed", error.message);
    }
  };

  return (
    <LinearGradient colors={[ "#800000", "#ff6f6fff"]} style={{ flex: 1 }}>
      <IOScrollView ref={scrollRef}>
        {/* Carousel */}
        <ImageCarousel
          data={carouselData}
          autoScrollInterval={4000}
          style={{ paddingHorizontal: responsiveWidth(5) }}
        />
        {/* About Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionBox}>
            {/* Background Image */}
            <Animatable.Image
              ref={aboutRef}
              animation="zoomIn"
              duration={2000}
              easing="ease-out"
              source={require("../assets/Images/Swamiji-3d-photo.jpg")}
              style={styles.bgImage}
              pointerEvents="none" // <-- Add this
            />
            {/* Dark Overlay */}
            <View style={[styles.overlay, { zIndex: 2 }]} pointerEvents="none" />
            <View style={{ flex: 1, zIndex: 3 }}>
            <InView
              onChange={(inView) => {
                if (inView) aboutRef.current?.zoomIn(800);
                else aboutRef.current?.zoomOut(400);
              }}
            >
              {/* Scrollable Text */}
              <ScrollView
                ref={scrollRef1}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                scrollEventThrottle={16}
                onScroll={(event) => {
                  const offsetY = event.nativeEvent.contentOffset.y;
                  setShowScrollUp1(offsetY < 50);
                }}
                nestedScrollEnabled={Platform.OS === "android"}
              >
                <Animatable.View animation="fadeInUp" duration={1200}>
                  <Text style={styles.title}>About Sri Ramanujavani</Text>
                  <Text style={styles.subTitle}>
                    Tridandi Srimannarayana Chinna Jeeyar Swamy
                  </Text>
                  <Text style={styles.bodyText}>
                    We have heard several stories and legends about God
                    incarnations, godmen, and acharyas in the past, but very
                    rarely can we come into the living presence of divinity like
                    His Holiness Tridandi Srimannarayana Chinna Jeeyar Swamy.
                  </Text>
                  <Text style={styles.bodyText}>
                    His Holiness Sri Sri Sri Tridandi Srimannarayana Ramanuja
                    Chinna Jeeyar Swamiji was born on Diwali day, the Festival
                    of Lights on 3rd November, 1956 at Arthamur Village near
                    Rajamundry in Andhra Pradesh, India. Born to pious parents
                    Sri VenkataChari and Srimathi Alivelumanga Thayaru. He had
                    his early education in the Oriental School, Gowthama Vidya
                    Peetham, Rajamundry. Swamiji is one of the youngest of all
                    Indian Acharyas today, affiliated to different branches of
                    the Vedic Dharma.
                  </Text>
                </Animatable.View>
              </ScrollView>

              {/* Scroll Up Button */}
              {showScrollUp1 && (
                <Animatable.View
                  animation="fadeIn"
                  duration={500}
                  style={styles.scrollUpBtn}
                >
                  <TouchableOpacity
                    onPress={() => {
                      scrollRef1.current?.scrollToEnd({
                      });
                    }}
                  >
                    <Animatable.Text
                      animation="bounce"
                      iterationCount="infinite"
                      style={styles.scrollUpIcon}
                    >
                      ↑
                    </Animatable.Text>
                  </TouchableOpacity>
                </Animatable.View>
              )}
            </InView>
          </View>
        </View>
        </View>
        {/* Video Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionBox}>
            <Animatable.Image
              ref={aboutVidRef}
              animation="zoomIn"
              duration={2000}
              easing="ease-out"
              source={require("../assets/Images/back.jpg")}
              style={styles.bgImage}
              pointerEvents="none" // <-- Add this
            />
            {/* Dark Overlay */}
            <View style={[styles.overlay, { zIndex: 2 }]} pointerEvents="none" />
            <View style={{ flex: 1, zIndex: 3 }}>
            <InView
              onChange={(inView) => {
                if (inView) aboutVidRef.current?.zoomIn(800);
                else aboutVidRef.current?.zoomOut(400);
              }}
            >

              <ScrollView
                ref={scrollRef2}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={(event) => {
                  const offsetY = event.nativeEvent.contentOffset.y;
                  setShowScrollUp2(offsetY < 50);
                }}
                nestedScrollEnabled={Platform.OS === "android"}
              >
              <Animatable.View animation="fadeInUp" duration={1200}>
                  <Text style={styles.title}>Our Future Goal</Text>
                  <Text style={styles.subTitle}>
                    Towards spiritual prosperity and peace
                  </Text>
                  <Text style={styles.bodyText}>
                    His ultimate objective was to inculcate vedic way of life
                    into society. He was a saint who propagated universal
                    brotherhood. He embraced the untouchables and treated them
                    on par with the elite. Seeing His compassion towards the
                    oppressed, His delighted guru honoured him with the coveted
                    title “ Em-perum- anar” you are ahead of us. Sri Ramanuja
                    named subjugated classes Thirukkulathar-Born Divine.
                  </Text>
                </Animatable.View>
              </ScrollView>

              {showScrollUp2 && (
                <Animatable.View
                  animation="fadeIn"
                  duration={500}
                  style={styles.scrollUpBtn}
                >
                  <TouchableOpacity
                    onPress={() => {
                      scrollRef2.current?.scrollToEnd({
                      });
                    }}
                  >
                    <Animatable.Text
                      animation="bounce"
                      iterationCount="infinite"
                      style={styles.scrollUpIcon}
                    >
                      ↑
                    </Animatable.Text>
                  </TouchableOpacity>
                </Animatable.View>
              )}
              </InView>
              </View>
          </View>
        </View>
        
        {/* Tabs */}

        <AnimatedTabSection tabs={tabs} />

        <Counter />
        <Footer navigation={navigation} route ={route} navigateWithLoader={navigateWithLoader} />
      </IOScrollView>

      <Loader visible={loading} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: responsiveWidth(5),
  },
  sectionBox: {
    height: responsiveHeight(55),
    marginTop: responsiveHeight(3),
        position: "relative", // <-- Add this
    overflow: "hidden", 
  },
  bgImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.35,
    zIndex: 1
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 5,
  },
  scrollContent: {
    paddingTop: responsiveHeight(30),
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: responsiveHeight(3),
    zIndex: 2
  },
  title: {
    fontSize: RFPercentage(3),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: RFPercentage(1.5),
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subTitle: {
    fontSize: RFValue(15),
    fontWeight: "bold",
    color: "#fff",
    marginBottom: responsiveHeight(1.5),
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  bodyText: {
    fontSize: RFValue(16),
    color: "#fff",
    lineHeight: RFValue(24),
    marginBottom: responsiveHeight(1.5),
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  videoWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 5,
  },
  video: {
    width: "110%",
    height: "100%",
    marginLeft: "-5%",
    borderRadius: 5,
  },
  scrollUpBtn: {
    position: "absolute",
    bottom: responsiveHeight(2),
    right: responsiveWidth(5),
    backgroundColor: "#800000",
    borderRadius: 30,
    padding: responsiveHeight(1.5),
    elevation: 5,
    zIndex: 100,
  },
  scrollUpIcon: {
    color: "#fff",
    fontSize: RFValue(22),
  },
});
