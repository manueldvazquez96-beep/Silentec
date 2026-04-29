import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet,
  ActivityIndicator, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { api, CartItem, formatARS } from '../services/api';
import { colors, fontSize, spacing, radius, shadow } from '../constants/tokens';

export default function CartScreen() {
  const insets   = useSafeAreaInsets();
  const { cliente } = useAuthStore();
  const { items, subtotal, setCart, clearCart } = useCartStore();
  const [loading, setLoading]    = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    api.cart.get()
      .then(c => setCart(c.items, c.subtotal))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleQtyChange(item: CartItem, delta: number) {
    const newQty = item.cantidad + delta;
    if (newQty < 1) {
      handleRemove(item);
      return;
    }
    try {
      const cart = await api.cart.updateItem(item.producto_id, newQty);
      setCart(cart.items, cart.subtotal);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    }
  }

  async function handleRemove(item: CartItem) {
    try {
      const cart = await api.cart.removeItem(item.producto_id);
      setCart(cart.items, cart.subtotal);
    } catch {}
  }

  async function handleConfirm() {
    Alert.alert(
      'Confirmar pedido',
      `Total: ${formatARS(total)}\n¿Confirmás el pedido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setConfirming(true);
            try {
              const pedido = await api.orders.confirm();
              clearCart();
              Alert.alert('¡Pedido confirmado!', `Pedido ${pedido.numero} creado correctamente.`);
            } catch (e: any) {
              Alert.alert('Error', e.message);
            } finally {
              setConfirming(false);
            }
          },
        },
      ],
    );
  }

  const descPct    = cliente?.descuento ?? 0;
  const descuento  = Math.round(subtotal * (descPct / 100));
  const baseConDesc = subtotal - descuento;
  const iva         = Math.round(baseConDesc * 0.21);
  const total       = baseConDesc + iva;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Pedido</Text>
        {items.length > 0 && (
          <View style={styles.itemsBadge}>
            <Text style={styles.itemsBadgeText}>{items.length} ÍTEMS</Text>
          </View>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      ) : items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>⊡</Text>
          <Text style={styles.emptyTitle}>Tu pedido está vacío</Text>
          <Text style={styles.emptyDesc}>Agregá productos desde el catálogo</Text>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {/* Entrega */}
            {cliente?.direccion && (
              <View style={styles.deliveryCard}>
                <Text style={styles.deliveryLabel}>ENTREGA EN</Text>
                <Text style={styles.deliveryAddr}>{cliente.direccion}, {cliente.ciudad}</Text>
              </View>
            )}

            {/* Items */}
            {items.map(item => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemCode}>{item.codigo_st}</Text>
                  <Text style={styles.itemName}>{item.descripcion}</Text>
                  <Text style={styles.itemMarca}>{item.marca}</Text>
                </View>
                <View style={styles.itemRight}>
                  <View style={styles.qtyRow}>
                    <Pressable onPress={() => handleQtyChange(item, -1)} style={styles.qtyBtn}>
                      <Text style={styles.qtyBtnText}>−</Text>
                    </Pressable>
                    <Text style={styles.qtyVal}>{item.cantidad}</Text>
                    <Pressable onPress={() => handleQtyChange(item, 1)} style={styles.qtyBtn}>
                      <Text style={styles.qtyBtnText}>+</Text>
                    </Pressable>
                  </View>
                  <Text style={styles.itemSubtotal}>{formatARS(item.subtotal)}</Text>
                </View>
              </View>
            ))}

            {/* Resumen */}
            <View style={styles.summaryCard}>
              <SummaryRow label="Subtotal"                    value={formatARS(subtotal)} />
              {descPct > 0 && (
                <SummaryRow
                  label={`Descuento mayorista (${descPct}%)`}
                  value={`−${formatARS(descuento)}`}
                  valueColor={colors.success}
                />
              )}
              <SummaryRow label="IVA 21%"                     value={formatARS(iva)} />
              <View style={styles.summaryDivider} />
              <SummaryRow label="TOTAL" value={formatARS(total)} bold />
            </View>

            <Text style={styles.nota}>Se descontará de cuenta corriente</Text>
          </ScrollView>

          {/* Botón confirmar */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
            <Pressable
              style={[styles.confirmBtn, confirming && { opacity: 0.7 }]}
              onPress={handleConfirm}
              disabled={confirming}
            >
              {confirming
                ? <ActivityIndicator color={colors.white} />
                : <Text style={styles.confirmBtnText}>Confirmar pedido · {formatARS(total)}</Text>
              }
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

function SummaryRow({ label, value, valueColor, bold }: {
  label: string; value: string; valueColor?: string; bold?: boolean;
}) {
  return (
    <View style={summaryStyles.row}>
      <Text style={[summaryStyles.label, bold && summaryStyles.bold]}>{label}</Text>
      <Text style={[summaryStyles.value, bold && summaryStyles.bold, valueColor ? { color: valueColor } : {}]}>
        {value}
      </Text>
    </View>
  );
}

const summaryStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 7,
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
  },
  bold: {
    fontSize: fontSize.h2 - 6,
    fontFamily: 'Montserrat_800ExtraBold',
    color: colors.text,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.px,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize.xl,
    fontFamily: 'Montserrat_800ExtraBold',
    color: colors.text,
  },
  itemsBadge: {
    backgroundColor: colors.accent,
    borderRadius: radius.xs,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  itemsBadgeText: {
    fontSize: fontSize.xxs,
    fontFamily: 'Montserrat_700Bold',
    color: colors.white,
    letterSpacing: 1,
  },
  list: {
    padding: spacing.px,
    paddingBottom: 120,
    gap: spacing.sm,
  },
  deliveryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  deliveryLabel: {
    fontSize: fontSize.xxs,
    fontFamily: 'Montserrat_700Bold',
    color: colors.textDim,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  deliveryAddr: {
    fontSize: fontSize.body,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
  },
  itemRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.md,
    ...shadow,
  },
  itemInfo: {
    flex: 1,
  },
  itemCode: {
    fontSize: fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    color: colors.accent,
  },
  itemName: {
    fontSize: fontSize.md,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    marginTop: 2,
  },
  itemMarca: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontFamily: 'Montserrat_400Regular',
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface3,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
  },
  qtyVal: {
    width: 28,
    textAlign: 'center',
    fontSize: fontSize.md,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
  },
  itemSubtotal: {
    fontSize: fontSize.md,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...shadow,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  nota: {
    fontSize: fontSize.xs,
    color: colors.textDim,
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.px,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmBtn: {
    height: 54,
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: colors.white,
    fontSize: fontSize.body,
    fontFamily: 'Montserrat_700Bold',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  emptyIcon: {
    fontSize: 80,
    opacity: 0.15,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontFamily: 'Montserrat_800ExtraBold',
    color: colors.text,
  },
  emptyDesc: {
    fontSize: fontSize.body,
    color: colors.textMuted,
    fontFamily: 'Montserrat_400Regular',
  },
});
