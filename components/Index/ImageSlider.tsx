import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import images from '@/constants/images';



//Code related to the integration
import { useQuery } from '@tanstack/react-query';
import { getSlide } from '@/utils/queries/appQueries';
import { getFromStorage } from "@/utils/storage";




const { width } = Dimensions.get('window');
const CONTAINER_WIDTH = width - 32;
const ITEM_WIDTH = CONTAINER_WIDTH;
const SLIDER_DATA = [
  { id: '1', image: images.slider_bg, heading: 'Get the best', subheading: 'crypto deals' },
  { id: '2', image: images.slider_bg, heading: 'Buy and sell', subheading: 'and swap your tokens at the best rate' },
  { id: '3', image: images.slider_bg, heading: 'Slide 3', subheading: 'Subheading for slide 3' },
];

const ImageSlider: React.FC = () => {
  const [token, setToken] = useState<string | null>(null); // State to hold the token

  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch the token and user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        const fetchedToken = await getFromStorage("authToken");
        if (fetchedToken) {
          setToken(fetchedToken);
          console.log("🔹 Retrieved Token:", fetchedToken);
        }
      }
    };
  
    fetchUserData();
  }, []);
  

  const { data: slideResponse, error: slideError, isLoading: slideLoading } = useQuery<SlideResponse, Error>(
    {
      queryKey: ["slide"],

      queryFn: () => getSlide({ token }),
      enabled: !!token, // Only run the query when the token is available
    }
  );

  console.log("🔹 Slide Response:", slideResponse);



  const slideCount = slideResponse?.data?.length || 0;


  const moveToNextSlide = useCallback(() => {
    if (slideCount <= 1) return;

    const nextIndex = currentIndex < slideCount - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(nextIndex);

    flatListRef.current?.scrollToIndex({
      index: nextIndex,
      animated: true,
    });
  }, [currentIndex, slideCount]);

  useEffect(() => {
    if (slideCount <= 1) return;

    const interval = setInterval(() => {
      moveToNextSlide();
    }, 9000);

    return () => clearInterval(interval);
  }, [moveToNextSlide, slideCount]);


  useEffect(() => {
    if (slideCount <= 1) return; // 🛑 skip if only one slide

    const interval = setInterval(() => {
      moveToNextSlide();
    }, 9000);

    return () => clearInterval(interval);
  }, [moveToNextSlide, slideCount]);


  return (
    <View style={styles.container} >
      <FlatList
        ref={flatListRef}
        data={slideResponse?.data?.map(item => ({
          id: item.id.toString(),
          image: { uri: `https://earlybaze.hmstech.xyz/storage/${item.attachment}` },
          heading: item.title,
          // subheading: item.url
        })) ?? []} horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.image} resizeMode="cover" />
            {/* <Text style={styles.heading}>{item.heading}</Text> */}
            {/* <Text style={styles.subheading}>{item.subheading}</Text> */}
          </View>
        )}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / ITEM_WIDTH);
          setCurrentIndex(index);

        }}
      />

      <TouchableOpacity style={styles.rightArrow} onPress={moveToNextSlide}>
        {/* <Text style={styles.arrowText}>→</Text> */}
        <Image source={images.notyarrow} />
      </TouchableOpacity>

      <View style={styles.paginationContainer}>
        <Text style={styles.paginationText}>
          {currentIndex + 1}/{slideCount}

        </Text>
      </View>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    width: CONTAINER_WIDTH,
    height: 157,
    borderRadius: 20,
    backgroundColor: '#5E0C59',
    marginTop: 10,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  slide: {
    width: ITEM_WIDTH,
    height: 157,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heading: {
    position: 'absolute',
    top: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    left: 16,
    right: 16,
  },
  subheading: {
    position: 'absolute',
    top: 60,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    left: 16,
    right: 16,
  },
  rightArrow: {
    position: 'absolute',
    left: 10,
    bottom: 1,
    top: '80%',
    backgroundColor: '#FFFFFF', // White background
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50, // Full rounded
    transform: [{ translateY: -20 }],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3, // optional: gives subtle shadow on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  arrowText: {
    color: '#000000', // Black arrow
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },


});

export default ImageSlider;
