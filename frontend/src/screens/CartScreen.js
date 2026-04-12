import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, StatusBar,
} from 'react-native';
import { useCart } from '../context/CartContext';

const C = {
  bg:      '#F4F4F4',
  card:    '#FFFFFF',
  border:  '#E0E0E0',
  accent:  '#2196F3',
  danger:  '#F44336',
  text:    '#1A1A1A',
  subtext: '#666666',
  muted:   '#999999',
  white:   '#FFFFFF',
  green:   '#4CAF50',
};

function CartItemRow({ item, onIncrease, onDecrease, onRemove }) {
  const [imgError, setImgError] = useState(false);
  const product = item.product;

  return (
    <View style={styles.itemRow}>
      {/* Product image */}
      {!imgError ? (
        <Image
          source={{ uri: product.display_image }}
          style={styles.itemImage}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <View style={[styles.itemImage, styles.imgFallback]}>
          <Text style={{ fontSize: 28 }}>🛍️</Text>
        </View>
      )}

      {/* Details */}
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.itemPrice}>₹{Number(product.price).toLocaleString()}</Text>

        {/* Qty controls */}
        <View style={styles.qtyRow}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => onDecrease(item)}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => onIncrease(item)}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.subtotal}>₹{Number(item.subtotal).toLocaleString()}</Text>
        </View>
      </View>

      {/* Remove */}
      <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove(item)}>
        <Text style={styles.removeBtnText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function CartScreen({ navigation }) {
  const { cart, loading, fetchCart, updateItem, removeItem, clearCart } = useCart();

  useEffect(() => { fetchCart(); }, []);

  const handleIncrease = (item) => updateItem(item.id, item.quantity + 1);

  const handleDecrease = (item) => {
    if (item.quantity === 1) {
      handleRemove(item);
    } else {
      updateItem(item.id, item.quantity - 1);
    }
  };

  const handleRemove = (item) => {
    Alert.alert('Remove Item', `Remove "${item.product.name}" from cart?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeItem(item.id) },
    ]);
  };

  const handleClear = () => {
    Alert.alert('Clear Cart', 'Remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearCart },
    ]);
  };

  if (loading && !cart) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={C.accent} />
      </View>
    );
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        {!isEmpty && (
          <TouchableOpacity onPress={handleClear}>
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      {isEmpty ? (
        /* ── Empty State ── */
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add products to get started</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Product')}>
            <Text style={styles.shopBtnText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* ── Cart Items ── */}
          <FlatList
            data={items}
            keyExtractor={i => String(i.id)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <CartItemRow
                item={item}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />

          {/* ── Order Summary ── */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Subtotal ({cart.item_count} item{cart.item_count !== 1 ? 's' : ''})
              </Text>
              <Text style={styles.summaryValue}>₹{Number(cart.total).toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={[styles.summaryValue, { color: C.green }]}>FREE</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{Number(cart.total).toLocaleString()}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.checkoutBtnText}>Proceed to Checkout →</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  centered:  { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, backgroundColor: C.bg },
  headerTitle: { fontSize: 22, fontWeight: '800', color: C.text },
  clearText:   { fontSize: 13, color: C.danger, fontWeight: '600' },

  list: { padding: 16, paddingBottom: 8 },

  itemRow:     { flexDirection: 'row', backgroundColor: C.card, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  itemImage:   { width: 80, height: 80, borderRadius: 10, backgroundColor: '#F0F0F0' },
  imgFallback: { alignItems: 'center', justifyContent: 'center' },
  itemDetails: { flex: 1, marginLeft: 12 },
  itemName:    { fontSize: 14, fontWeight: '700', color: C.text, marginBottom: 4 },
  itemPrice:   { fontSize: 13, color: C.muted, marginBottom: 8 },

  qtyRow:     { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn:     { width: 30, height: 30, borderRadius: 8, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  qtyBtnText: { fontSize: 16, color: C.text, fontWeight: '600' },
  qtyValue:   { fontSize: 15, fontWeight: '800', color: C.text, minWidth: 22, textAlign: 'center' },
  subtotal:   { fontSize: 14, fontWeight: '800', color: C.accent, marginLeft: 'auto' },

  removeBtn:     { padding: 6, marginLeft: 8 },
  removeBtnText: { fontSize: 16, color: C.muted },

  separator: { height: 10 },

  summary:      { backgroundColor: C.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 32, borderWidth: 1, borderColor: C.border, borderBottomWidth: 0 },
  summaryRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 14, color: C.subtext },
  summaryValue: { fontSize: 14, fontWeight: '600', color: C.text },
  divider:      { height: 1, backgroundColor: C.border, marginVertical: 10 },
  totalLabel:   { fontSize: 17, fontWeight: '800', color: C.text },
  totalValue:   { fontSize: 20, fontWeight: '900', color: C.accent },

  checkoutBtn:     { backgroundColor: C.accent, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 14 },
  checkoutBtnText: { color: C.white, fontWeight: '800', fontSize: 16 },

  emptyWrap:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  emptyIcon:  { fontSize: 72, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: '800', color: C.text, marginBottom: 8 },
  emptySub:   { fontSize: 14, color: C.muted, marginBottom: 28 },
  shopBtn:    { backgroundColor: C.accent, borderRadius: 12, paddingHorizontal: 32, paddingVertical: 14 },
  shopBtnText:{ color: C.white, fontWeight: '700', fontSize: 15 },
});