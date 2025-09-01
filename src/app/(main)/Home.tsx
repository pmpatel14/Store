import Images from "@/src/constants/imageParth";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const originalBanners = [
  Images.slide_1,
  Images.slide_2,
  Images.slide_1,
  Images.slide_1,
];
// Duplicate first & last for seamless loop
const bannerImages = [
  originalBanners[originalBanners.length - 1],
  ...originalBanners,
  originalBanners[0],
];

const Home = () => {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Start from the first real image (index 1 in bannerImages)
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: width, animated: false });
    }

    const interval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          x: (activeIndex + 2) * width,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    let contentOffsetX = event.nativeEvent.contentOffset.x;
    let index = Math.round(contentOffsetX / width);

    if (index === 0) {
      // If at duplicate last, reset to last real image
      scrollRef.current?.scrollTo({
        x: originalBanners.length * width,
        animated: false,
      });
      setActiveIndex(originalBanners.length - 1);
    } else if (index === bannerImages.length - 1) {
      // If at duplicate first, reset to first real image
      scrollRef.current?.scrollTo({ x: width, animated: false });
      setActiveIndex(0);
    } else {
      setActiveIndex(index - 1); // Adjust because of duplicated slides
    }
  };

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="light-content" backgroundColor="#140D2B" />

      {/* Top Bar with logo and notification icon */}
      <View style={styles.statusBaar}>
        <Image source={Images.logo} style={styles.logo} />
        <Ionicons name="notifications-outline" size={24} style={styles.icon} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchBaar}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#ccc"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search here..."
          placeholderTextColor="#bbb"
          style={styles.searchInput}
        />
      </View>

      {/* Banner Slider */}
      <View style={styles.bannerWrapper}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {bannerImages.map((img, index) => (
            <View key={index} style={styles.slideWrapper}>
              <Image source={img} style={styles.slide} />
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#140D2B",
  },
  statusBaar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  icon: {
    color: "#fff",
  },
  searchBaar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1f1f2e",
    marginHorizontal: 20,
    marginVertical: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 8,
    color: "#aaa",
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  bannerWrapper: {
    marginTop: 15,
  },
  slideWrapper: {
    width: width - 40,
    height: 200,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  slide: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
