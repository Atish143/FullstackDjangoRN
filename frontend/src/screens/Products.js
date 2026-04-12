import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  Image, TextInput, ScrollView, RefreshControl,
  StatusBar, Dimensions,
} from 'react-native';
import API from '../services/api';

const { width } = Dimensions.get('window');
const CARD_W    = (width - 52) / 2;   // 16 left + 16 right + 12 gap + 8 extra

const C = {
  bg:      '#191818ff',   // light grey page bg so white cards pop
  card:    '#FFFFFF',
  border:  '#E0E0E0',
  accent:  '#2196F3',
  text:    '#1A1A1A',
  subtext: '#555555',
  muted:   '#999999',
  gold:    '#FFC107',
  white:   '#FFFFFF',
  chipBg:  '#E8E8E8',   // visible grey chip bg when inactive
  chipTxt: '#444444',   // dark chip text when inactive
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <View style={[styles.card, { width: CARD_W }]}>
      <View style={{ height: 150, backgroundColor: '#E8E8E8', borderRadius: 0 }} />
      <View style={styles.cardBody}>
        <View style={{ height: 10, backgroundColor: '#E8E8E8', borderRadius: 5, marginBottom: 8 }} />
        <View style={{ height: 10, backgroundColor: '#E8E8E8', borderRadius: 5, width: '60%' }} />
      </View>
    </View>
  );
}

// ─── Category chip ────────────────────────────────────────────────────────────
function CategoryChip({ item, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      {item.icon ? <Text style={styles.chipIcon}>{item.icon}</Text> : null}
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.name}</Text>
    </TouchableOpacity>
  );
}

// ─── Product card ─────────────────────────────────────────────────────────────
function ProductCard({ item, onPress }) {
  const [imgError, setImgError] = useState(false);

  return (
    <TouchableOpacity style={[styles.card, { width: CARD_W }]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageWrap}>
        {!imgError ? (
          <Image
            source={{ uri: item.display_image }}
            style={styles.cardImage}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={[styles.cardImage, styles.imgFallback]}>
            <Text style={{ fontSize: 36 }}>🛍️</Text>
          </View>
        )}
        {item.is_featured && (
          <View style={styles.featuredTag}>
            <Text style={styles.featuredTagText}>Featured</Text>
          </View>
        )}
        {item.rating > 0 && (
          <View style={styles.ratingTag}>
            <Text style={styles.ratingTagText}>⭐ {item.rating}</Text>
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.categoryLabel}>{item.category_name}</Text>
        <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.cardPrice}>₹{Number(item.price).toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProductsScreen({ navigation }) {
  const [products,       setProducts]       = useState([]);
  const [categories,     setCategories]     = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [refreshing,     setRefreshing]     = useState(false);
  const [search,         setSearch]         = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  const fetchAll = useCallback(async (searchQ = '', categoryId = null) => {
    try {
      const params = {};
      if (searchQ)    params.search   = searchQ;
      if (categoryId) params.category = categoryId;

      const [prodRes, catRes] = await Promise.all([
        API.get('products/', { params }),
        categories.length ? Promise.resolve(null) : API.get('products/categories/'),
      ]);

      setProducts(prodRes.data.results ?? prodRes.data);
      if (catRes) setCategories(catRes.data.results ?? catRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [categories.length]);

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchAll(search, activeCategory), 400);
    return () => clearTimeout(t);
  }, [search, activeCategory]);

  const onRefresh = () => { setRefreshing(true); fetchAll(search, activeCategory); };

  const allCategories = [{ id: null, name: 'All', icon: '🛍️', slug: 'all' }, ...categories];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── Header — reduced top padding ── */}
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Our Products</Text>
        <TouchableOpacity style={styles.cartBtn}>
          <Text style={styles.cartIcon}>🛒</Text>
        </TouchableOpacity>
      </View> */}

      {/* ── Search ── */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={C.muted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ color: C.muted, fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Category chips — visible dark text on grey bg ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}
        style={styles.chipScroll}
      >
        {allCategories.map(cat => (
          <CategoryChip
            key={String(cat.id)}
            item={cat}
            active={activeCategory === cat.id}
            onPress={() => setActiveCategory(cat.id)}
          />
        ))}
      </ScrollView>

      {/* ── Product grid ── */}
      {loading ? (
        <View style={styles.skeletonGrid}>
          {[1, 2, 3, 4].map(k => <SkeletonCard key={k} />)}
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={i => String(i.id)}
          numColumns={2}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}   // ← gap between columns
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.accent} />
          }
          renderItem={({ item }) => (
            <ProductCard
              item={item}
              onPress={() => navigation?.navigate('ProductDetail', { product: item })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No products found</Text>
              <Text style={styles.emptySub}>Try a different category or search</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  // ── Header — tight padding, no subtitle ──
  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { color: C.text, fontSize: 22, fontWeight: '800' },
  cartBtn:     { width: 40, height: 40, backgroundColor: C.card, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  cartIcon:    { fontSize: 18 },

  // ── Search ──
  searchWrap:  { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 10, marginHorizontal: 16, marginBottom: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: C.border , marginTop:10 },
  searchIcon:  { fontSize: 15, marginRight: 8 },
  searchInput: { flex: 1, color: C.text, fontSize: 14, paddingVertical: 11 },

  // ── Category chips — FIXED: visible grey bg + dark text ──
  chipScroll:     { height: 48, flexGrow: 0, flexShrink: 0, marginBottom: 12 },
  chipRow:        { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  chip:           { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: C.chipBg, borderWidth: 1, borderColor: C.border },
  chipActive:     { backgroundColor: C.accent, borderColor: C.accent },
  chipIcon:       { fontSize: 13 },
  chipText:       { color: C.chipTxt, fontSize: 13, fontWeight: '600' },   // dark text, always visible
  chipTextActive: { color: C.white },

  // ── Grid — FIXED: row gap + item gap ──
  grid:         { paddingHorizontal: 16, paddingBottom: 30 },
  row:          { justifyContent: 'space-between', marginBottom: 12 },   // ← vertical + horizontal gap
  skeletonGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 },

  // ── Card ──
  card:        { backgroundColor: C.card, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: C.border, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  imageWrap:   { position: 'relative' },
  cardImage:   { width: '100%', height: 150 },
  imgFallback: { backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' },

  featuredTag:     { position: 'absolute', top: 8, left: 8, backgroundColor: C.accent, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  featuredTagText: { color: C.white, fontSize: 10, fontWeight: '700' },
  ratingTag:       { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 },
  ratingTagText:   { color: C.white, fontSize: 11, fontWeight: '600' },

  cardBody:     { padding: 10 },
  categoryLabel:{ color: C.muted, fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 3 },
  cardName:     { color: C.text, fontSize: 13, fontWeight: '700', marginBottom: 6, lineHeight: 18 },
  cardPrice:    { color: C.accent, fontSize: 15, fontWeight: '900' },

  // ── Empty ──
  emptyWrap:  { alignItems: 'center', marginTop: 60 },
  emptyIcon:  { fontSize: 48, marginBottom: 12 },
  emptyTitle: { color: C.text, fontSize: 18, fontWeight: '800', marginBottom: 6 },
  emptySub:   { color: C.muted, fontSize: 13 },
});