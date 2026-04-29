import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { api } from '../services/api';
import { colors, fontSize, spacing, radius } from '../constants/tokens';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { setAuth } = useAuthStore();
  const [cuit, setCuit]         = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  async function handleLogin() {
    if (!cuit.trim() || !password) {
      setError('Ingresá tu CUIT y contraseña.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { token, cliente } = await api.auth.login(cuit.trim(), password);
      await setAuth(token, cliente);
    } catch (e: any) {
      setError(e.message || 'Error al ingresar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.xxxl, paddingBottom: insets.bottom + spacing.xxxl }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>PORTAL MAYORISTA</Text>
        </View>

        {/* Logo placeholder */}
        <View style={styles.logoWrap}>
          <Text style={styles.logoText}>SILENTEC</Text>
          <Text style={styles.slogan}>Soporte en tu camino.</Text>
          <Text style={styles.subSlogan}>DISEÑADO PARA DURAR</Text>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="CUIT (ej: 30-71485293-4)"
            placeholderTextColor={colors.textDim}
            value={cuit}
            onChangeText={setCuit}
            autoCapitalize="none"
            keyboardType="default"
          />

          <View style={styles.passWrap}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Contraseña"
              placeholderTextColor={colors.textDim}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <Pressable onPress={() => setShowPass(v => !v)} style={styles.eyeBtn}>
              <Text style={styles.eyeIcon}>{showPass ? '🙈' : '👁'}</Text>
            </Pressable>
          </View>

          <Pressable onPress={() => {}} style={styles.forgotWrap}>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </Pressable>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            style={[styles.btnPrimary, loading && styles.btnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.btnPrimaryText}>INGRESAR</Text>
            }
          </Pressable>

          <Pressable onPress={() => {}} style={styles.registerWrap}>
            <Text style={styles.registerText}>Solicitá acceso</Text>
          </Pressable>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Respaldado por COARDEL · 55 años · AR</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.px,
    alignItems: 'center',
  },
  badge: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.xs,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: spacing.xxxl,
  },
  badgeText: {
    fontSize: fontSize.xxs,
    color: colors.accent,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1.5,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: spacing.xxxl + 8,
  },
  logoText: {
    fontSize: 40,
    fontFamily: 'Montserrat_900Black',
    color: colors.accent,
    letterSpacing: -1,
  },
  slogan: {
    fontSize: fontSize.lg,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    marginTop: 4,
  },
  subSlogan: {
    fontSize: fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    color: colors.textDim,
    letterSpacing: 2,
    marginTop: 4,
  },
  form: {
    width: '100%',
    gap: spacing.md,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.body,
    color: colors.text,
    backgroundColor: colors.surface,
    fontFamily: 'Montserrat_400Regular',
  },
  passWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    paddingRight: spacing.md,
  },
  eyeBtn: {
    padding: spacing.sm,
  },
  eyeIcon: {
    fontSize: 18,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: fontSize.md,
    color: colors.accent,
    fontFamily: 'Montserrat_500Medium',
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.danger,
    fontFamily: 'Montserrat_500Medium',
    textAlign: 'center',
  },
  btnPrimary: {
    height: 52,
    backgroundColor: colors.accent,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  btnPrimaryText: {
    color: colors.white,
    fontSize: fontSize.body,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  registerWrap: {
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  registerText: {
    fontSize: fontSize.md,
    color: colors.accent,
    fontFamily: 'Montserrat_500Medium',
  },
  footer: {
    marginTop: spacing.huge,
    fontSize: fontSize.xs,
    color: colors.textDim,
    fontFamily: 'Montserrat_400Regular',
    letterSpacing: 0.5,
  },
});
