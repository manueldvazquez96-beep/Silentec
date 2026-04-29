import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, Pressable, StyleSheet, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { api, Cliente, formatARS } from '../services/api';
import { colors, fontSize, spacing, radius, shadow } from '../constants/tokens';

const MENU_GROUPS = [
  {
    items: [
      { label: 'Mis datos',      icon: '👤' },
      { label: 'Domicilios',     icon: '📍' },
      { label: 'Notificaciones', icon: '🔔' },
    ],
  },
  {
    items: [
      { label: 'Soporte',        icon: '💬' },
      { label: 'Legales',        icon: '📄' },
    ],
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { cliente, logout } = useAuthStore();
  const [profile, setProfile] = useState<Cliente | null>(null);

  useEffect(() => {
    api.profile.get().then(setProfile).catch(() => {});
  }, []);

  const data = profile ?? cliente;

  function handleLogout() {
    Alert.alert('Cerrar sesión', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: 110 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header perfil */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {data?.razon_social?.charAt(0) ?? 'R'}
          </Text>
        </View>
        <Text style={styles.name}>{data?.razon_social}</Text>
        <Text style={styles.cuit}>{data?.cuit}</Text>
        {data?.cuenta_num && (
          <Text style={styles.cuenta}>Cuenta #{data.cuenta_num}</Text>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard label="NIVEL"    value={data?.nivel ?? '—'} />
        <StatCard label="DESCUENTO" value={data?.descuento ? `${data.descuento}%` : '—'} />
        <StatCard label="PLAZO"    value={data?.plazo_pago ?? '—'} />
      </View>

      {/* Datos de contacto */}
      {(data?.email || data?.ciudad) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CONTACTO</Text>
          <View style={[styles.card]}>
            {data?.email && <InfoRow label="Email" value={data.email} />}
            {data?.ciudad && <InfoRow label="Ciudad" value={data.ciudad} />}
            {data?.direccion && <InfoRow label="Dirección" value={data.direccion} />}
          </View>
        </View>
      )}

      {/* Menús */}
      {MENU_GROUPS.map((group, gi) => (
        <View key={gi} style={styles.section}>
          <View style={styles.card}>
            {group.items.map((item, ii) => (
              <Pressable
                key={item.label}
                style={[
                  styles.menuItem,
                  ii < group.items.length - 1 && styles.menuItemBorder,
                ]}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      {/* Logout */}
      <View style={styles.section}>
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </Pressable>
      </View>

      {/* Footer versión */}
      <Text style={styles.version}>SILENTEC v1.0.0 · RESPALDADO POR COARDEL</Text>
    </ScrollView>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={statStyles.card}>
      <Text style={statStyles.value}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}

const statStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    alignItems: 'center',
    ...shadow,
  },
  value: {
    fontSize: fontSize.lg,
    fontFamily: 'Montserrat_800ExtraBold',
    color: colors.text,
  },
  label: {
    fontSize: fontSize.xxs,
    fontFamily: 'Montserrat_700Bold',
    color: colors.textDim,
    letterSpacing: 1,
    marginTop: 3,
  },
});

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
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
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    maxWidth: '60%',
    textAlign: 'right',
  },
});

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    paddingBottom: spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    fontSize: 32,
    fontFamily: 'Montserrat_900Black',
    color: colors.white,
  },
  name: {
    fontSize: fontSize.xl,
    fontFamily: 'Montserrat_800ExtraBold',
    color: colors.text,
    textAlign: 'center',
  },
  cuit: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 4,
  },
  cuenta: {
    fontSize: fontSize.sm,
    color: colors.accent,
    fontFamily: 'Montserrat_700Bold',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    margin: spacing.px,
    marginTop: spacing.lg,
  },
  section: {
    marginHorizontal: spacing.px,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.xxs,
    fontFamily: 'Montserrat_700Bold',
    color: colors.textDim,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    ...shadow,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuIcon: {
    fontSize: 18,
    width: 28,
  },
  menuLabel: {
    flex: 1,
    fontSize: fontSize.body,
    fontFamily: 'Montserrat_500Medium',
    color: colors.text,
  },
  menuArrow: {
    fontSize: 20,
    color: colors.textDim,
  },
  logoutBtn: {
    backgroundColor: 'rgba(198,40,40,0.08)',
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: fontSize.body,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.danger,
  },
  version: {
    fontSize: fontSize.xxs,
    color: colors.textDim,
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
    marginTop: spacing.xxl,
    letterSpacing: 0.5,
  },
});
