import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet,
  ActivityIndicator, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { api, Product, formatARS } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { colors, fontSize, spacing, radius, shadow } from '../constants/tokens';
import type { RootStackParamList } from '../navigation';

type DetailRoute = RouteProp<RootStackParamList, 'Detail'>;

export default function DetailScreen() {
  const insets    = useSafeAreaInsets();
  const navigation = useNavigation();
  const route     = useRoute<DetailRoute>();
  const { setCart } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty]         = useState(1);
  const [adding, setAdding]   = useState(false);

  useEffect(() => {
    api.products.get(route.params.id)
      .then(setProduct)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [route.params.id]);

  async function handleAddToCart() {
    if (!product) return;
    setAdding(true);
    try {
      const cart = await api.cart.addItem(product.id, qty);
      setCart(cart.items, cart.subtotal);
      Alert.alert('Agregado', `${qty} × ${product.codigo_st} en tu pedido.`);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Producto no encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </Pressable>
          <Text style={styles.topTitle}>Detalle</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Imagen */}
        <View style={styles.imageBlock}>
          <Text style={styles.imageIcon}>⚙</Text>
        </View>

        {/* Info */}
        <View style={styles.body}>
          <Text style={styles.code}>{product.codigo_st}</Text>
          <Text style={styles.name}>{product.descripcion}</Text>
          <Text style={styles.meta}>{product.marca} · {product.modelo}</Text>

          {product.anio && (
            <Text style={styles.anio}>Compatibilidad: {product.anio}</Text>
          )}

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatARS(product.precio)}</Text>
            <View style={[styles.stockBadge, product.stock === 0 && styles.stockOut]}>
              <Text style={[styles.stockText, product.stock === 0 && styles.stockOutText]}>
                {product.stock > 0 ? `Stock: ${product.stock} u.` : 'Sin stock'}
              </Text>
            </View>
          </View>

          {/* Specs */}
          <View style={styles.specsCard}>
            <Text style={styles.specsTitle}>ESPECIFICACIONES</Text>
            <SpecRow label="Código ST" value={product.codigo_st} mono />
            <SpecRow label="Código OE" value={product.codigo_oe} mono />
            <SpecRow label="Tipo"      value={product.tipo} />
            {product.tipo_detalle && <SpecRow label="Detalle" value={product.tipo_detalle} />}
            <SpecRow label="Rotación"  value={product.rotacion.charAt(0).toUpperCase() + product.rotacion.slice(1)} />
          </View>
        </View>
      </ScrollView>

      {/* Footer fijo */}
      {product.stock > 0 && (
        <View style={styles.footer}>
          <View style={styles.qtySelector}>
            <Pressable
              onPress={() => setQty(q => Math.max(1, q - 1))}
              style={styles.qtyBtn}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </Pressable>
            <Text style={styles.qtyValue}>{qty}</Text>
            <Pressable
              onPress={() => setQty(q => Math.min(product.stock, q + 1))}
              style={styles.qtyBtn}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </Pressable>
          </View>
          <Pressable
            style={[styles.addBtn, adding && { opacity: 0.7 }]}
            onPress={handleAddToCart}
            disabled={adding}
          >
            {adding
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.addBtnText}>Agregar · {formatARS(product.precio * qty)}</Text>
            }
          </Pressable>
        </View>
      )}
    </View>
  );
}

function SpecRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <View style={specStyles.row}>
      <Text style={specStyles.label}>{label}</Text>
      <Text style={[specStyles.value, mono && specStyles.mono]}>{value}</Text>
    </View>
  );
}

const specStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    fontFamily: 'Montserrat_400Regular',
  },
  value: {
    fontSize: fontSize.md,
    color: colors.text,
    fontFamily: 'Montserrat_600SemiBold',
    maxWidth: '60%',
    textAlign: 'right',
  },
  mono: {
    fontFamily: 'Montserrat_700Bold',
    color: colors.accent,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  errorText: {
    color: colors.textMuted,
    fontFamily: 'Montserrat_400Regular',
    fontSize: fontSize.body,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.px,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: colors.text,
  },
  topTitle: {
    fontSize: fontSize.body,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
  },
  imageBlock: {
    height: 280,
    backgroundColor: colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIcon: {
    fontSize: 100,
    opacity: 0.3,
  },
  body: {
    padding: spacing.px,
    paddingBottom: 120,
  },
  code: {
    fontSize: fontSize.xxl,
    fontFamily: 'Montserrat_700Bold',
    color: colors.accent,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  name: {
    fontSize: fontSize.xl,
    fontFamily: 'Montserrat_800ExtraBold',
    color: colors.text,
  },
  meta: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 4,
  },
  anio: {
    fontSize: fontSize.sm,
    color: colors.textDim,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
  },
  price: {
    fontSize: fontSize.h2,
    fontFamily: 'Montserrat_800ExtraBold',
    color: colors.text,
  },
  stockBadge: {
    backgroundColor: colors.chip,
    borderRadius: radius.xs,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stockOut: {
    backgroundColor: 'rgba(198,40,40,0.1)',
  },
  stockText: {
    fontSize: fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.textMuted,
  },
  stockOutText: {
    color: colors.danger,
  },
  specsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadow,
  },
  specsTitle: {
    fontSize: fontSize.xxs,
    fontFamily: 'Montserrat_700Bold',
    color: colors.textDim,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.px,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  qtySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface3,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 40,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 22,
    color: colors.text,
    fontFamily: 'Montserrat_700Bold',
  },
  qtyValue: {
    width: 36,
    textAlign: 'center',
    fontSize: fontSize.body,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
  },
  addBtn: {
    flex: 1,
    height: 52,
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: colors.white,
    fontSize: fontSize.body,
    fontFamily: 'Montserrat_700Bold',
  },
});
