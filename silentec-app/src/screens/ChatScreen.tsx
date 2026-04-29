import React, { useState } from 'react';
import {
  View, Text, StyleSheet, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSize, spacing, radius } from '../constants/tokens';

export default function ChatScreen() {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.assistantIcon}>
          <Text style={styles.assistantIconText}>◎</Text>
        </View>
        <View style={styles.topInfo}>
          <Text style={styles.topTitle}>Asistente SILENTEC</Text>
          <Text style={styles.topStatus}>
            <Text style={styles.statusDot}>● </Text>
            Próximamente disponible
          </Text>
        </View>
      </View>

      {/* Placeholder */}
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>◎</Text>
        <Text style={styles.emptyTitle}>Asistente IA</Text>
        <Text style={styles.emptyDesc}>
          El asistente técnico de SILENTEC estará disponible próximamente.{'\n'}
          Podrás consultar compatibilidades, alternativas y stock en tiempo real.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.px,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  assistantIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  assistantIconText: {
    fontSize: 20,
    color: colors.white,
  },
  topInfo: {
    flex: 1,
  },
  topTitle: {
    fontSize: fontSize.body,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
  },
  topStatus: {
    fontSize: fontSize.xs,
    color: colors.textDim,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 1,
  },
  statusDot: {
    color: colors.warn,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.px,
  },
  emptyIcon: {
    fontSize: 80,
    color: colors.accent,
    opacity: 0.15,
    marginBottom: spacing.xxl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontFamily: 'Montserrat_800ExtraBold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyDesc: {
    fontSize: fontSize.body,
    color: colors.textMuted,
    fontFamily: 'Montserrat_400Regular',
    textAlign: 'center',
    lineHeight: 22,
  },
});
