import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ImageBackground,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { images } from '@/constants';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Trade Your <Crypto> With Ease',
    background: images.first,
  },
  {
    id: '2',
    title: 'Send And Receive All Crypto',
    background: images.second,
  },
  {
    id: '3',
    title: 'Swap All Your <Crypto> To Naira',
    background: images.third,
  },
];

const Onboarding = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const checkIfViewed = async () => {
      const viewed = await SecureStore.getItemAsync('onboardingViewed');
      if (viewed) {
        router.replace('/login');
      }
    };
    checkIfViewed();
  }, []);

  const handleProceed = async () => {
    if (currentSlide === slides.length - 1) {
      await SecureStore.setItemAsync('onboardingViewed', 'true');
      router.replace('/login');
    } else {
      flatListRef.current?.scrollToIndex({ index: currentSlide + 1 });
    }
  };

  const handleSkip = () => {
    if (currentSlide < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentSlide + 1 });
    }
  };

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  return (
    <>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={flatListRef}
        onScroll={handleScroll}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ImageBackground
            source={item.background}
            style={styles.container}
            resizeMode="cover"
          >
            {/* TOP Pagination Bar */}
            <View style={styles.topPagination}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[styles.dot, currentSlide === index && styles.activeDot]}
                />
              ))}
            </View>

            {/* Content */}
            <View style={styles.overlay}>
              <Text style={styles.title}>
                {item.title.split('<')[0]}
                <Text style={styles.greenText}>
                  {item.title.split('<')[1]?.split('>')[0]}
                </Text>
                {item.title.split('>')[1]}
              </Text>

              <Image source={item.image} style={styles.walletImage} resizeMode="contain" />

              {/* Bottom Buttons */}
              <View style={styles.buttons}>
                {currentSlide < slides.length - 1 && (
                  <TouchableOpacity onPress={handleSkip}>
                    <Text style={styles.skip}>Skip</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.proceedButton} onPress={handleProceed}>
                  <Text style={styles.proceedText}>Proceed</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        )}
      />
    </>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    width,
    height: height+50,
  },
  topPagination: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
  },
  dot: {
    height: 6,
    width: width * 0.2,
    borderRadius: 6,
    backgroundColor: '#194d32',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#25AE7A',
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  title: {
    fontSize: 35,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 40,
    fontFamily: 'Caprasimo',
  },
  greenText: {
    color: '#25AE7A',
  },
  walletImage: {
    width: 240,
    height: 240,
    marginBottom: 30,
  },
  buttons: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  skip: {
    color: '#25AE7A',
    fontSize: 16,
    marginBottom: 14,
    fontWeight: '600',
  },
  proceedButton: {
    backgroundColor: '#25AE7A',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  proceedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
