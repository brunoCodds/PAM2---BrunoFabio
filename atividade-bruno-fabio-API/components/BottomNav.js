import { StyleSheet, View } from 'react-native';
import { NAV_ITEMS, NavLink } from './Header';
import { colors } from '../styles/theme';

export const BOTTOM_NAV_HEIGHT = 68;

/** Barra de navegação fixa no rodapé, usada só em telas estreitas. */
export default function BottomNav({ route, favoritesCount, onNavigate }) {
  return (
    <View style={styles.bar} role="navigation">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.name}
          item={item}
          route={route}
          count={item.name === 'favorites' ? favoritesCount : 0}
          onPress={onNavigate}
          style={styles.item}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: BOTTOM_NAV_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    zIndex: 20,
  },
  item: { flex: 1, paddingHorizontal: 8 },
});
