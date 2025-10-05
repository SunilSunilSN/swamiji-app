import React, { useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated, Dimensions, PanResponder } from 'react-native';

const { width, height } = Dimensions.get('window');

const cats = {
  'Tiger': { name: 'Panthera tigris', code: '1501705388883-4ed8a543392c', desc: 'tiger in the water' },
  'Lion': { name: 'Panthera leo', code: '1519066629447-267fffa62d4b', desc: 'lion and lioness resting on a rock in the sun' },
  'Leopard': { name: 'Panthera pardus', code: '1566489564594-f2163930c034', desc: 'blue-eyed leopard resting high up with its head on its front paws' },
  'Jaguar': { name: 'Panthera onca', code: '1601544359642-c76c4f7c3221', desc: 'jaguar closeup' },
  'Snow leopard': { name: 'Panthera uncia', code: '1689847190291-f8e0823f13ab', desc: 'snow leopard lying low on some rocks, its fur blending in perfecty' },
  'Cheetah': { name: 'Acinonyx jubatus', code: '1693702366986-cbfbd1cf0450', desc: 'cheetah in the grass at dusk' },
  'Cougar': { name: 'Puma concolor', code: '1661004527094-07d861089aed', desc: 'cougar walking through the snow' }
};

const CardStack = () => {
  const entries = Object.entries(cats);
  const n = entries.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dx) > 20,
      onPanResponderMove: Animated.event([null, { dx: position.x }], { useNativeDriver: false }),
      onPanResponderRelease: (_, { dx }) => {
        if (dx > 50) {
          swipeCard(-1); // swipe right
        } else if (dx < -50) {
          swipeCard(1); // swipe left
        } else {
          resetCard();
        }
      },
    })
  ).current;

  const swipeCard = (direction) => {
    Animated.timing(position, {
      toValue: { x: direction * width, y: 0 },
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      position.setValue({ x: 0, y: 0 });
      setCurrentIndex((currentIndex + direction + n) % n);
    });
  };

  const resetCard = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  return (
    <View style={styles.container}>
      {entries.map(([title, cat], i) => {
        const isTop = i === currentIndex;
        const rotate = position.x.interpolate({
          inputRange: [-width, 0, width],
          outputRange: ['-15deg', '0deg', '15deg'],
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.card,
              { zIndex: n - i },
              isTop && {
                transform: [{ translateX: position.x }, { rotate }],
              },
              !isTop && { opacity: 0.8 },
            ]}
            {...(isTop ? panResponder.panHandlers : {})}
          >
            <Image
              source={{ uri: `https://images.unsplash.com/photo-${cat.code}?w=400` }}
              style={styles.image}
            />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.name}>{cat.name}</Text>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070410',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: width * 0.7,
    height: height * 0.5,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 10,
    borderWidth: 2,
    borderColor: 'rgba(82,82,122,0.5)',
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  title: {
    color: '#f1f5f9',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  name: {
    color: 'rgba(241,245,249,0.6)',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CardStack;
