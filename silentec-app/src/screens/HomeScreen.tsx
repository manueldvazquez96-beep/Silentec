import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuthStore } from '../store/authStore';
import { api, ProfileStats, formatARS } from '../services/api';
import { colors, fontSize, spacing, radius, shadow } from '../constants/tokens';
import type { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const QUICK_ACTIONS = [
  { label: 'Catálogo', icon: '☰', tab: 'Catalog' },
  { label: 'Pedidos',  icon: '📋', tab: 'Reports' },
  { label: 'Asistente',icon: '◎', tab: 'Chat' },
  { label: 'Cuenta',   icon: '👤', tab: 'Cart' },
];

export default function HomeScreen() {
  const insets    = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { cliente } = useAuthStore();
  const [stats, setStats]     = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.profile.stats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: 110 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <View style={styles.headerTop}>
          <Text style={styles.logoSmall}>SILENTEC</Text>
          <View style={styles.b2bBadge}>
            <Text style={styles.b2bText}>B2B · MAYORISTA</Text>
          </View>
        </View>
        <Text style={styles.greeting}>Bienvenido,</Text>
        <Text style={styles.clientName}>{cliente?.razon_social}</Text>
      </View>

      {/* Cuenta Corriente */}
      <View style={[styles.card, styles.cardCC]}>
        <Text style={styles.cardLabel}>CUENTA CORRIENTE</Text>
        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginVertical: 12 }} />
        ) : (
          <>
            <Text style={styles.saldoHero}>{formatARS(stats?.total90 ?? 0)}</Text>
            <Text style={styles.cardSub}>Comprado en los últimos 90 días</Text>
            <View style={styles.ccRow}>
              <View style={styles.ccItem}>
                <Text style={styles.ccValue}>{stats?.pedidos90 ?? 0}</Text>
                <Text style={styles.ccKey}>pedidos</Text>
              </View>
              <View style={styles.ccDivider} />
              <View style={styles.ccItem}>
                <Text style={styles.ccValue}>{stats?.pendientes ?? 0}</Text>
                <Text style={styles.ccKey}>en curso</Text>
              </View>
              <View style={styles.ccDivider} />
              <View style={styles.ccItem}>
                <Text style={styles.ccValue}>{cliente?.nivel}</Text>
                <Text style={styles.ccKey}>nivel</Text>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Accesos rápidos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ACCESOS RÁPIDOS</Text>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((item) => (
            <Pressable
              key={item.tab}
              style={styles.quickItem}
              onPress={() => (navigation as any).navigate(item.tab)}
            >
              <View style={styles.quickIcon}>
                <Text style={styles.quickIconText}>{item.icon}</Text>
              </View>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Top productos */}
      {stats?.topProductos && stats.topProductos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MÁS COMPRADOS</Text>
          {stats.topProductos.map((p, i) => (
            <View key={p.codigo_st} style={styles.topItem}>
              <Text style={styles.topRank}>0{i + 1}</Text>
              <View style={styles.topInfo}>
                <Text style={styles.topName}>{p.descripcion}</Text>
                <Text style={styles.topCode}>{p.codigo_st}</Text>
              </View>
              <View style={styles.topRight}>
                <Text style={styles.topUnits}>{p.unidades} u.</Text>
                <Text style={styles.topMonto}>{formatARS(p.monto)}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.px,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  logoSmall: {
    fontSize: 18,
    fontFamily: 'Montserrat_900Black',
    color: colors.accent,
    letterSpacing: -0.5,
  },
  b2bBadge: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.xs,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  b2bText: {
    fontSize: fontSize.xxs,
    fontFamily: 'Montserrat_700Bold',
    color: colors.accent,
    letterSpacing: 1,
  },
  greeting: {
    fontSize: fontSize.body,
    color: colors.textMuted,
    fontFamily: 'Montserrat_400Regular',
  },
  clientName: {
    fontSize: fontSize.xl,
    fontFamily: 'Montserrat_800ExtraBold',
    color: colors.text,
    marginTop: 2,
  },
  card: {
    margin: spacing.px,
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    padding: spacing.xxl,
    ...shadow,
  },
  cardCC: {
    borderWidth: 1,
    borderColor: colors.accentSoft,
  },
  cardLabel: {
    fontSize: fontSize.xxs,
    fontFamily: 'Montserrat_700Bold',
    color: colors.textDim,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  saldoHero: {
    fontSize: fontSize.h1,
    fontFamily: 'Montserrat_900Black',
    color: colors.text,
    lineHeight: 44,
  },
  cardSub: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  ccRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ccItem: {
    flex: 1,
    alignItems: 'center',
  },
  ccValue: {
    fontSize: fontSize.xl,
    fontFamily: 'Montserrat_800ExtraBold',
    color: colors.text,
  },
  ccKey: {
    fontSize: fontSize.xs,
    color: colors.textDim,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 2,
  },
  ccDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  section: {
    marginHorizontal: spacing.px,
    marginTop: spacing.xxl,
  },
  sectionTitle: {
    fontSize: fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    color: colors.textDim,
    letterSpacing: 1.5,
    marginBottom: spacing.md,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickItem: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickIconText: {
    fontSize: 20,
  },
  quickLabel: {
    fontSize: fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.textMuted,
    textAlign: 'center',
  },
  topItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    ...shadow,
  },
  topRank: {
    fontSize: fontSize.xxl,
    fontFamily: 'Montserrat_900Black',
    color: colors.surface3,
    width: 32,
  },
  topInfo: {
    flex: 1,
  },
  topName: {
    fontSize: fontSize.md,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
  },
  topCode: {
    fontSize: fontSize.xs,
    fontFamily: 'Montserrat_400Regular',
    color: colors.accent,
    marginTop: 2,
  },
  topRight: {
    alignItems: 'flex-end',
  },
  topUnits: {
    fontSize: fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
  },
  topMonto: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 2,
  },
});
