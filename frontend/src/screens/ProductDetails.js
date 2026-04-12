import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Dimensions, Alert, ActivityIndicator,
} from 'react-native';
import { useCart } from '../context/CartContext';

const { width } = Dimensions.get('window');

const C = {
  bg:      '#FFFFFF',
  surface: '#F7F7F7',
  border:  '#E8E8E8',
  accent:  '#2196F3',
  text:    '#1A1A1A',
  subtext: '#666666',
  muted:   '#999999',
  gold:    '#FFC107',
  white:   '#FFFFFF',
};

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { addToCart, cart } = useCart();

  const [qty, setQty]           = useState(1);
  const [imgError, setImgError] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const [adding, setAdding]     = useState(false);

  const cartCount = cart?.item_count || 0;

  const handleAddToCart = async () => {
    setAdding(true);
    const success = await addToCart(product.id, qty);
    setAdding(false);
    if (success) {
      Alert.alert(
        '✅ Added to Cart',
        `${qty}x ${product.name} added successfully.`,
        [
          { text: 'Continue Shopping', style: 'cancel' },
          { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
        ]
      );
    } else {
      Alert.alert('Error', 'Could not add to cart. Please try again.');
    }
  };

  const renderStars = (rating) => {
    const full  = Math.floor(rating);
    const empty = 5 - full;
    return '★'.repeat(full) + '☆'.repeat(empty);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      {/* ── Hero Image ── */}
      <View style={styles.heroWrap}>
        {!imgError ? (
          <Image
            source={{ uri: product.display_image || product.image_url }}
            style={styles.heroImage}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={[styles.heroImage, styles.heroFallback]}>
            <Text style={{ fontSize: 80 }}>🛍️</Text>
          </View>
        )}

        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        {/* Cart button with badge */}
        <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate('Cart')}>
          <Text style={{ fontSize: 18 }}>🛒</Text>
          {cartCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Wishlist */}
        <TouchableOpacity style={styles.wishBtn} onPress={() => setWishlist(w => !w)}>
          <Text style={styles.wishIcon}>{wishlist ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>

        {product.is_featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>✦ Featured</Text>
          </View>
        )}
      </View>

      {/* ── Content ── */}
      <ScrollView
        style={styles.sheet}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Text style={styles.categoryLabel}>{product.category_name}</Text>

        <View style={styles.nameRow}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.price}>₹{Number(product.price).toLocaleString()}</Text>
        </View>

        <View style={styles.ratingRow}>
          <Text style={styles.stars}>{renderStars(Number(product.rating))}</Text>
          <Text style={styles.ratingNum}>{product.rating} rating</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.chipsRow}>
          <View style={styles.infoChip}>
            <Text style={styles.infoChipIcon}>📦</Text>
            <Text style={styles.infoChipText}>In Stock</Text>
          </View>
          <View style={styles.infoChip}>
            <Text style={styles.infoChipIcon}>🚚</Text>
            <Text style={styles.infoChipText}>Free Delivery</Text>
          </View>
          <View style={styles.infoChip}>
            <Text style={styles.infoChipIcon}>↩️</Text>
            <Text style={styles.infoChipText}>7-Day Return</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Quantity</Text>
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => Math.max(1, q - 1))}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{qty}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(q => q + 1)}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.qtyTotal}>
            Total: ₹{(Number(product.price) * qty).toLocaleString()}
          </Text>
        </View>
      </ScrollView>

      {/* ── Sticky Footer ── */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.wishlistFooterBtn} onPress={() => setWishlist(w => !w)}>
          <Text style={{ fontSize: 22 }}>{wishlist ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cartFooterBtn} onPress={handleAddToCart} disabled={adding}>
          {adding
            ? <ActivityIndicator color={C.white} />
            : <Text style={styles.cartFooterText}>Add to Cart</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

  heroWrap:     { width, height: 300, backgroundColor: C.surface },
  heroImage:    { width: '100%', height: '100%' },
  heroFallback: { alignItems: 'center', justifyContent: 'center' },
  backBtn:      { position: 'absolute', top: 48, left: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, elevation: 3 },
  backIcon:     { color: C.text, fontSize: 18, fontWeight: '700' },
  cartBtn:      { position: 'absolute', top: 48, right: 60, width: 38, height: 38, borderRadius: 19, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, elevation: 3 },
  cartBadge:    { position: 'absolute', top: -4, right: -4, backgroundColor: '#F44336', borderRadius: 9, width: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  cartBadgeText:{ color: C.white, fontSize: 10, fontWeight: '800' },
  wishBtn:      { position: 'absolute', top: 48, right: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, elevation: 3 },
  wishIcon:     { fontSize: 16 },
  featuredBadge:{ position: 'absolute', bottom: 12, left: 16, backgroundColor: C.accent, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  featuredText: { color: C.white, fontSize: 11, fontWeight: '700' },

  sheet:         { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20, paddingTop: 20 },
  categoryLabel: { color: C.muted, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  nameRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  productName:   { flex: 1, color: C.text, fontSize: 20, fontWeight: '800', lineHeight: 26 },
  price:         { color: C.accent, fontSize: 22, fontWeight: '900' },

  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stars:     { color: '#FFC107', fontSize: 15, letterSpacing: 1 },
  ratingNum: { color: C.muted, fontSize: 13 },

  divider:      { height: 1, backgroundColor: C.border, marginVertical: 18 },
  sectionTitle: { color: C.text, fontSize: 14, fontWeight: '700', marginBottom: 10 },
  description:  { color: C.subtext, fontSize: 14, lineHeight: 22 },

  chipsRow:     { flexDirection: 'row', gap: 10 },
  infoChip:     { flex: 1, backgroundColor: C.surface, borderRadius: 12, padding: 12, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: C.border },
  infoChipIcon: { fontSize: 18 },
  infoChipText: { color: C.subtext, fontSize: 11, fontWeight: '600', textAlign: 'center' },

  qtyRow:     { flexDirection: 'row', alignItems: 'center', gap: 14 , marginBottom: 50  },
  qtyBtn:     { width: 40, height: 40, borderRadius: 10, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  qtyBtnText: { color: C.text, fontSize: 20, fontWeight: '600' },
  qtyValue:   { color: C.text, fontSize: 20, fontWeight: '800', minWidth: 28, textAlign: 'center' },
  qtyTotal:   { color: C.subtext, fontSize: 14, fontWeight: '600', marginLeft: 'auto' },

  footer:           { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, paddingBottom: 30, backgroundColor: C.white, borderTopWidth: 1, borderTopColor: C.border },
  wishlistFooterBtn:{ width: 50, height: 50, borderRadius: 12, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  cartFooterBtn:    { flex: 1, backgroundColor: C.accent, borderRadius: 12, padding: 15, alignItems: 'center' },
  cartFooterText:   { color: C.white, fontWeight: '800', fontSize: 16 },
});