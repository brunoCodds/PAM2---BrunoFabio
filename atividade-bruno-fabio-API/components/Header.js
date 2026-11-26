import { Pressable, StyleSheet, View } from 'react-native';
import Button from './Button';
import Container from './Container';
import Logo from './Logo';
import Text from './Text';
import { colors, radius, web } from '../styles/theme';
import { useLayout } from '../utils/layout';

export const NAV_ITEMS = [
  { name: 'home', label: 'Início' },
  { name: 'categories', label: 'Categorias' },
  { name: 'favorites', label: 'Favoritos' },
];

/** Marca o item de menu da seção em que o usuário está. */
export function isNavActive(route, item) {
  if (item === 'home') return route.name === 'home' || route.name === 'search';
  if (item === 'categories') return route.name === 'categories' || route.name === 'category';
  return route.name === item;
}

export function NavLink({ item, route, count, onPress, style }) {
  const active = isNavActive(route, item.name);
  return (
    <Pressable
      onPress={() => onPress({ name: item.name })}
      role="link"
      aria-current={active ? 'page' : undefined}
      style={({ hovered }) => [
        styles.link,
        (active || hovered) && { backgroundColor: colors.sage },
        web({ cursor: 'pointer', transitionProperty: 'background-color', transitionDuration: '150ms' }),
        style,
      ]}
    >
      <Text variant="subheading" style={{ fontSize: 15, color: active ? colors.forest : colors.ink }}>
        {item.label}
      </Text>
      {count > 0 ? (
        <View style={styles.badge}>
          <Text variant="caption" style={styles.badgeText}>
            {count}
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}

export default function Header({ route, favoritesCount, onNavigate, onRandom, randomLoading }) {
  const { isMobile } = useLayout();

  return (
    <View style={styles.bar}>
      <Container style={styles.inner}>
        <Logo onPress={() => onNavigate({ name: 'home' })} />
        {!isMobile ? (
          <View style={styles.nav} role="navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.name}
                item={item}
                route={route}
                count={item.name === 'favorites' ? favoritesCount : 0}
                onPress={onNavigate}
              />
            ))}
          </View>
        ) : null}
        <Button
          label="Receita surpresa"
          variant="accent"
          size="sm"
          loading={randomLoading}
          onPress={onRandom}
        />
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.cream,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    zIndex: 10,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    gap: 16,
  },
  nav: { flexDirection: 'row', gap: 6, marginLeft: 'auto', marginRight: 12 },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: colors.forestDark, fontSize: 12, lineHeight: 16, fontWeight: '700' },
});
