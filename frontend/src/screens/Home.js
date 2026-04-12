import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  StatusBar, Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const C = {
  bg:      '#0e0f0fff',
  card:    '#FFFFFF',
  border:  '#EEEEEE',
  accent:  '#2196F3',
  text:    '#d8a1a1ff',
  subtext: '#666666',
  muted:   '#AAAAAA',
  white:   '#FFFFFF',
};

const QUICK_ACTIONS = [
  { icon: '🛍️', label: 'Browse',   screen: 'Products', color: '#EBF5FF' },
  { icon: '🛒', label: 'Cart',     screen: 'Cart',     color: '#FFF3EE' },
  { icon: '❤️', label: 'Wishlist', screen: 'Wishlist', color: '#FFF0F0' },
  { icon: '📦', label: 'Orders',   screen: 'Orders',   color: '#F0FFF4' },
];

const BANNERS = [
  { emoji: '⚡', title: 'Flash Sale',   sub: 'Up to 60% off today',   color: '#2196F3', bg: '#EBF5FF' },
  { emoji: '🚀', title: 'New Arrivals', sub: 'Fresh drops every week', color: '#FF6B35', bg: '#FFF3EE' },
];

export default function HomeScreen({ navigation }) {
  const fadeHeader  = useRef(new Animated.Value(0)).current;
  const slideHeader = useRef(new Animated.Value(-20)).current;
  const fadeCards   = useRef(new Animated.Value(0)).current;
  const slideCards  = useRef(new Animated.Value(24)).current;
  const fadeBanners = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeHeader,  { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(slideHeader, { toValue: 0, duration: 450, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(fadeCards,  { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(slideCards, { toValue: 0, duration: 380, useNativeDriver: true }),
      ]),
      Animated.timing(fadeBanners, { toValue: 1, duration: 320, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'refreshToken']);
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── Header ── */}
      <Animated.View style={[styles.header, { opacity: fadeHeader, transform: [{ translateY: slideHeader }] }]}>
        <View>
          <Text style={styles.greeting}>Good day 👋</Text>
          <Text style={styles.headline}>What are you{'\n'}shopping for?</Text>
        </View>
        <TouchableOpacity style={styles.avatarBtn} onPress={handleLogout}>
          <Text style={styles.avatarText}>👤</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* ── Quick Actions ── */}
      <Animated.View style={[styles.section, { opacity: fadeCards, transform: [{ translateY: slideCards }] }]}>
        <Text style={styles.sectionLabel}>EXPLORE</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.label}
              style={[styles.actionCard, { backgroundColor: a.color }]}
              onPress={() => navigation.navigate(a.screen)}
              activeOpacity={0.75}
            >
              <Text style={styles.actionIcon}>{a.icon}</Text>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* ── Banners ── */}
      <Animated.View style={[styles.section, { opacity: fadeBanners }]}>
        <Text style={styles.sectionLabel}>OFFERS</Text>
        {BANNERS.map((b) => (
          <TouchableOpacity
            key={b.title}
            style={[styles.banner, { backgroundColor: b.bg, borderLeftColor: b.color }]}
            onPress={() => navigation.navigate('Product')}
            activeOpacity={0.8}
          >
            <Text style={styles.bannerEmoji}>{b.emoji}</Text>
            <View style={styles.bannerText}>
              <Text style={[styles.bannerTitle, { color: b.color }]}>{b.title}</Text>
              <Text style={styles.bannerSub}>{b.sub}</Text>
            </View>
            <Text style={[styles.bannerArrow, { color: b.color }]}>→</Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* ── Footer ── */}
      <Animated.View style={[styles.footer, { opacity: fadeBanners }]}>
        <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Product')}>
          <Text style={styles.shopBtnText}>Shop Now  →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 22 },

  header:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingTop: 60, paddingBottom: 28 },
  greeting:  { color: C.muted, fontSize: 13, fontWeight: '600', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6 },
  headline:  { color: C.text, fontSize: 28, fontWeight: '900', lineHeight: 34 },
  avatarBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  avatarText:{ fontSize: 20 },

  section:      { marginBottom: 26 },
  sectionLabel: { color: C.muted, fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 12 },

  actionsGrid: { flexDirection: 'row', gap: 10 },
  actionCard:  { flex: 1, borderRadius: 16, paddingVertical: 18, alignItems: 'center', gap: 8 },
  actionIcon:  { fontSize: 26 },
  actionLabel: { color: C.text, fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },

  banner:      { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 16, marginBottom: 10, borderLeftWidth: 4 },
  bannerEmoji: { fontSize: 26, marginRight: 14 },
  bannerText:  { flex: 1 },
  bannerTitle: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  bannerSub:   { color: C.subtext, fontSize: 12 },
  bannerArrow: { fontSize: 18, fontWeight: '700' },

  footer:      { position: 'absolute', bottom: 36, left: 22, right: 22, flexDirection: 'row', gap: 12 },
  shopBtn:     { flex: 1, backgroundColor: C.accent, borderRadius: 14, paddingVertical: 16, alignItems: 'center', shadowColor: C.accent, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 },
  shopBtnText: { color: C.white, fontSize: 15, fontWeight: '900' },
  logoutBtn:   { width: 54, height: 54, borderRadius: 14, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  logoutText:  { color: C.muted, fontSize: 10, fontWeight: '700' },
});