import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, Pressable, StyleSheet,
  ActivityIndicator, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { api, Product, Tipo, formatARS } from '../services/api';
import { colors, fontSize, spacing, radius, shadow } from '../constants/tokens';
import type { RootStackParamList } from '../navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function CatalogScreen() {
  const insets    = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  const [query, setQuery]       = useState('');
  const [tipos, setTipos]       = useState<Tipo[]>([]);
  const [tipoSel, setTipoSel]   = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(false);
  const [page, setPage]         = useState(1);
  const [hasMore, setHasMore]   = useState(true);

  useEffect(() => {
    api.products.tipos().then(setTipos).catch(() => {});
  }, []);

  const fetchProducts = useCallback(async (reset = false) => {
    setLoading(true);
    const currentPage = reset ? 1 : page;
    try {
      const res = await api.products.list({
        q:    query || undefined,
        tipo: tipoSel || undefined,
        page: currentPage,
      });
      setProducts(prev => reset ? res.items : [...prev, ...res.items]);
      setHasMore(currentPage < res.pages);
      if (!reset) setPage(p => p + 1);
    } catch {}
    finally { setLoading(false); }
  }, [query, tipoSel, page]);

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchProducts(true);
  }, [query, tipoSel]);

  function renderProduct({ item }: { item: Product }) {
    return (
      <Pressable
        style={styles.productRow}
        onPress={() => navigation.navigate('Detail', { id: item.id })}
      >
        <View style={styles.productImg}>
          <Text style={styles.productImgIcon}>⚙</Text>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productCode}>{item.codigo_st}</Text>
          <Text style={styles.productName}>{item.descripcion}</Text>
          <Text style={styles.productMeta}>{item.marca} · {item.modelo}</Text>
        </View>
        <View style={styles.productRight}>
          <Text style={styles.productPrice}>{formatARS(item.precio)}</Text>
          <View style={[styles.stockBadge, item.stock === 0 && styles.stockOut]}>
            <Text style={[styles.stockText, item.stock === 0 && styles.stockOutText]}>
              {item.stock > 0 ? `${item.stock} u.` : 'Sin stock'}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.title}>Catálogo</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por código ST, OE o descripción…"
          placeholderTextColor={colors.textDim}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {/* Tipos */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tiposScroll}
        contentContainerStyle={styles.tiposContent}
      >
        <Pressable
          style={[styles.tipoChip, tipoSel === '' && styles.tipoChipActive]}
          onPress={() => setTipoSel('')}
        >
          <Text style={[styles.tipoText, tipoSel === '' && styles.tipoTextActive]}>Todos</Text>
        </Pressable>
        {tipos.map(t => (
          <Pressable
            key={t.id}
            style={[styles.tipoChip, tipoSel === t.id && styles.tipoChipActive]}
            onPress={() => setTipoSel(t.id)}
          >
            <Text style={[styles.tipoText, tipoSel === t.id && styles.tipoTextActive]}>{t.nombre}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Lista */}
      <FlatList
        data={products}
        keyExtractor={item => String(item.id)}
        renderItem={renderProduct}
        contentContainerStyle={styles.list}
        onEndReached={() => hasMore && !loading && fetchProducts()}
        onEndReachedThreshold={0.3}
        ListFooterComponent={loading ? <ActivityIndicator color={colors.accent} style={{ margin: spacing.lg }} /> : null}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>Sin resultados</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBar: {
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
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing.px,
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.body,
    color: colors.text,
    fontFamily: 'Montserrat_400Regular',
  },
  tiposScroll: {
    maxHeight: 44,
    marginTop: spacing.sm,
  },
  tiposContent: {
    paddingHorizontal: spacing.px,
    gap: spacing.sm,
    alignItems: 'center',
  },
  tipoChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.full,
    backgroundColor: colors.chip,
  },
  tipoChipActive: {
    backgroundColor: colors.accent,
  },
  tipoText: {
    fontSize: fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.textMuted,
  },
  tipoTextActive: {
    color: colors.white,
  },
  list: {
    paddingHorizontal: spacing.px,
    paddingTop: spacing.md,
    paddingBottom: 110,
  },
  productRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    alignItems: 'center',
    gap: spacing.md,
    ...shadow,
  },
  productImg: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    backgroundColor: colors.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImgIcon: {
    fontSize: 26,
  },
  productInfo: {
    flex: 1,
  },
  productCode: {
    fontSize: fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    color: colors.accent,
    letterSpacing: 0.5,
  },
  productName: {
    fontSize: fontSize.md,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.text,
    marginTop: 2,
  },
  productMeta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontFamily: 'Montserrat_400Regular',
    marginTop: 2,
  },
  productRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  productPrice: {
    fontSize: fontSize.md,
    fontFamily: 'Montserrat_700Bold',
    color: colors.text,
  },
  stockBadge: {
    backgroundColor: colors.chip,
    borderRadius: radius.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  stockOut: {
    backgroundColor: 'rgba(198,40,40,0.1)',
  },
  stockText: {
    fontSize: fontSize.xxs,
    fontFamily: 'Montserrat_600SemiBold',
    color: colors.textMuted,
  },
  stockOutText: {
    color: colors.danger,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: fontSize.body,
    color: colors.textDim,
    fontFamily: 'Montserrat_400Regular',
  },
});
