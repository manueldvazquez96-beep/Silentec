import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api, Order, formatARS } from '../services/api';
import { colors, fontSize, spacing, radius, shadow } from '../constants/tokens';

const RANGES = [
  { label: '30 días', days: 30 },
  { label: '90 días', days: 90 },
  { label: 'Año',    days: 365 },
  { label: 'Todo',   days: 9999 },
];

const ESTADO_COLOR: Record<string, string> = {
  'Pendiente':       colors.warn,
  'En preparación':  colors.accent,
  'Despachado':      '#7C3AED',
  'Entregado':       colors.success,
  'Cancelado':       colors.danger,
};

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const [range, setRange]       = useState(1);
  const [orders, setOrders]     = useState<Order[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    setLoading(true);
    api.orders.list({ limit: 50 } as any)
      .then(r => setOrders(r.items))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RANGES[range].days);
  const filtered = orders.filter(o => RANGES[range].days >= 9000 || new Date(o.created_at) >= cutoff);

  const totalComprado = filtered.reduce((s, o) => s + o.total, 0);
  const totalPedidos  = filtered.length;

  // Últimos 12 meses para el mini chart
  const chartData = buildChartData(orders);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: 110 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Text style={styles.title}>Reportes</Text>
        <Text style={styles.subtitle}>MIS COMPRAS Y PEDIDOS</Text>
      </View>

      {/* Range chips */}
      <View style={styles.rangeRow}>
        {RANGES.map((r, i) => (
          <Pressable
            key={r.label}
            style={[styles.rangeChip, range === i && styles.rangeChipActive]}
            onPress={() => setRange(i)}
          >
            <Text style={[styles.rangeText, range === i && styles.rangeTextActive]}>{r.label}</Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: 40 }} />
      ) : (
        <>
          {/* Hero card */}
          <View style={[styles.card, styles.heroCard]}>
            <Text style={styles.heroLabel}>TOTAL COMPRADO</Text>
            <Text style={styles.heroAmount}>{formatARS(totalComprado)}</Text>
            <View style={styles.heroMeta}>
              <Text style={styles.heroMetaText}>{totalPedidos} pedidos</Text>
            </View>

            {/* Mini bar chart */}
            <MiniBarChart data={chartData} />
          </View>

          {/* Historial */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>HISTORIAL DE PEDIDOS</Text>
            {filtered.length === 0 && (
              <Text style={styles.emptyText}>Sin pedidos en este período.</Text>
            )}
            {filtered.map(order => (
              <View key={order.id} style={[styles.card, styles.orderCard]}>
                <View style={styles.orderTop}>
                  <Text style={styles.orderNum}>{order.numero}</Text>
                  <View style={[styles.estadoBadge, { backgroundColor: ESTADO_COLOR[order.estado] + '22' }]}>
                    <Text style={[styles.estadoText, { color: ESTADO_COLOR[order.estado] }]}>
                      {order.estado}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderBottom}>
                  <Text style={styles.orderDate}>
                    {new Date(order.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </Text>
                  <Text style={styles.orderTotal}>{formatARS(order.total)}</Text>
                </View>
              </View>
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

function buildChartData(orders: Order[]) {
  const now   = new Date();
  const months: { label: string; value: number }[] = [];
  for (let i = 3; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString('es-AR', { month: 'short' }).toUpperCase().slice(0, 3);
    const value = orders
      .filter(o => {
        const od = new Date(o.created_at);
        return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth();
      })
      .reduce((s, o) => s + o.total, 0);
    months.push({ label, value });
  }
  return months;
}

function MiniBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <View style={chartStyles.wrap}>
      {data.map((d, i) => (
        <View key={d.label} style={chartStyles.col}>
          <View style={chartStyles.barWrap}>
            <View style={[
              chartStyles.bar,
              { height: Math.max(6, (d.value / max) * 56) },
              i >= data.length - 2 && chartStyles.barActive,
            ]} />
          </View>
          <Text style={chartStyles.label}>{d.label}</Text>
        </View>
      ))}
    </View>
  );
}

const chartStyles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginTop: spacing.lg,
    height: 72,
  },
  col: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  barWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    width: '100%',
    alignItems: 'center',
  },
  bar: {
    width: '80%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
  },
  barActive: {
    backgroundColor: colors.white,
  },
  label: {
    fontSize: fontSize.xxs,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Montserrat_700Bold',
    textAlign: 'center',
  },
});

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: spacing.px,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize.xl,
    fontFamily: 'Montserrat_800ExtraBold',
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSize.xxs,
    fontFamily: 'Montserrat_700Bold',
    color: colors.textDim,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  rangeRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.px,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  rangeChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.chip,
    alignItems: 'center',
  },
  rangeChipActive: {
    backgroundColor: colors.accent,
  },
  rangeText: {
    fontSize: fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.textMuted,
  },
  rangeTextActive: {
    color: colors.white,
  },
  card: {
    marginHorizontal: spacing.px,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.xxl,
    ...shadow,
  },
  heroCard: {
    backgroundColor: colors.accent,
    marginBottom: spacing.lg,
  },
  heroLabel: {
    fontSize: fontSize.xxs,
    fontFamily: 'Montserrat_700Bold',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1.5,
  },
  heroAmount: {
    fontSize: fontSize.h1,
    fontFamily: 'Montserrat_900Black',
    color: colors.white,
    marginTop: 4,
    lineHeight: 44,
  },
  heroMeta: {
    marginTop: 4,
  },
  heroMetaText: {
    fontSize: fontSize.md,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Montserrat_400Regular',
  },
  section: {
    marginHorizontal: spacing.px,
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xxs,
    fontFamily: 'Montserrat_700Bold',
    color: colors.textDim,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.body,
    color: colors.textDim,
    fontFamily: 'Montserrat_400Regular',
  },
  orderCard: {
    padding: spacing.lg,
    marginHorizontal: 0,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  orderNum: {
    fontSize: fontSize.body,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  estadoText: {
    fontSize: fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
  },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDate: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontFamily: 'Montserrat_400Regular',
  },
  orderTotal: {
    fontSize: fontSize.body,
    fontFamily: 'Montserrat_800ExtraBold',
    color: colors.text,
  },
});
