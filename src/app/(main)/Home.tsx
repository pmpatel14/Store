import Images from "@/src/constants/imageParth";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const originalBanners = [
  Images.slide_1,
  Images.slide_2,
  Images.slide_3,
  Images.slide_4,
  Images.slide_2,
  Images.slide_1,
  Images.slide_3,
];

const categories_1 = [
  Images.makeup,
  Images.rain,
  Images.ring,
  Images.shoes,
  Images.summer,
  Images.watch,
  Images.winter,
  Images.rain,
  Images.ring,
  Images.shoes,
  Images.summer,
  Images.watch,
];

const categoriesTextTitle = [
  "Makeup",
  "Rain",
  "Ring",
  "Shoes",
  "Summer",
  "Watch",
  "Winter",
  "Rain",
  "Ring",
  "Shoes",
  "Summer",
  "Watch",
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Function to start auto-scroll
  const startAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      if (!isScrollingRef.current && scrollRef.current) {
        const nextIndex = (activeIndex + 1) % originalBanners.length;
        scrollRef.current.scrollTo({
          x: (nextIndex + 1) * width,
          animated: true,
        });
      }
    }, 3000);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: width, animated: false });
    }
    startAutoScroll();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    startAutoScroll();
  }, [activeIndex]);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    let contentOffsetX = event.nativeEvent.contentOffset.x;
    let index = Math.round(contentOffsetX / width);

    if (index === 0) {
      scrollRef.current?.scrollTo({
        x: originalBanners.length * width,
        animated: false,
      });
      setActiveIndex(originalBanners.length - 1);
    } else if (index === bannerImages.length - 1) {
      scrollRef.current?.scrollTo({ x: width, animated: false });
      setActiveIndex(0);
    } else {
      setActiveIndex(index - 1);
    }

    isScrollingRef.current = false;

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleScrollBegin = () => {
    isScrollingRef.current = true;
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const goToSlide = (index: number) => {
    if (scrollRef.current) {
      isScrollingRef.current = true;
      scrollRef.current.scrollTo({
        x: (index + 1) * width,
        animated: true,
      });
      setActiveIndex(index);
    }
  };

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <StatusBar barStyle="light-content" backgroundColor="#140D2B" />

      {/* Top Bar */}
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
          onScrollBeginDrag={handleScrollBegin}
          scrollEventThrottle={16}
        >
          {bannerImages.map((img, index) => (
            <View key={index} style={styles.slideWrapper}>
              <Image source={img} style={styles.slide} />
            </View>
          ))}
        </ScrollView>

        {/* Dots Indicator */}
        <Animated.View
          style={[styles.indicatorContainer, { opacity: fadeAnim }]}
        >
          {originalBanners.map((_, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => goToSlide(index)}
            >
              <View
                style={[
                  styles.indicator,
                  index === activeIndex && styles.activeIndicator,
                ]}
              />
            </TouchableWithoutFeedback>
          ))}
        </Animated.View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesWrapper}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories_1.map((image, index) => (
            <View key={index} style={styles.categoryItem}>
              <View style={styles.categoryImageWrapper}>
                <Image source={image} style={styles.categoryImage} />
              </View>
              <Text style={styles.categoryText}>
                {categoriesTextTitle[index]}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Promo Banner */}
      <View style={styles.bannerContainer}>
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>30% Off Discount</Text>
          <Text style={styles.bannerSubTitle}>
            Started several mistake joy say painful reached end
          </Text>
          <Text style={styles.bannerButton}>Shop now!</Text>
        </View>
        <View style={styles.bannerImageMain}>
          <Image source={Images.banner} style={styles.bannerImage} />
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#140D2B" },
  statusBaar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  logo: { width: 80, height: 80, resizeMode: "contain" },
  icon: { color: "#fff" },
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
  searchIcon: { marginRight: 8, color: "#aaa" },
  searchInput: { flex: 1, color: "#fff", fontSize: 16 },

  bannerWrapper: { marginTop: 15, position: "relative" },
  slideWrapper: {
    width: width - 40,
    height: 200,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  slide: { width: "100%", height: "100%", resizeMode: "cover" },

  indicatorContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 4,
  },
  activeIndicator: { backgroundColor: "#fff", width: 20 },

  categoriesWrapper: { marginTop: 20, paddingHorizontal: 20 },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  categoryItem: { alignItems: "center", marginRight: 15 },
  categoryImageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#1f1f2e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 30,
    borderColor: "#d8d8e2ff",
    borderWidth: 2,
  },
  categoryText: { color: "#fff", fontSize: 12 },

  bannerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  bannerText: {
    flex: 1,
    backgroundColor: "#ffff",
    height: 200,
    borderBottomLeftRadius: 12,
    borderTopLeftRadius: 12,
  },
  bannerTitle: {
    color: "#001C7E",
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    textTransform: "uppercase",
  },
  bannerSubTitle: {
    color: "#001C7E",
    fontSize: 16,
    marginBottom: 5,
    textAlign: "center",
  },
  bannerImageMain: { width: 150, height: 200 },
  bannerImage: {
    width: "100%",
    height: "100%",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  bannerButton: {
    color: "#ffffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    backgroundColor: "#001C7E",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    alignSelf: "center",
  },
});
