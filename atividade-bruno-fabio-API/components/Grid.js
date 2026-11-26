import { Fragment, useState } from 'react';
import { View } from 'react-native';

/**
 * Grade responsiva: mede a largura disponível e calcula quantas colunas
 * cabem com `minWidth` por item. `renderItem(item, width)` recebe a largura final.
 */
export default function Grid({ data, minWidth, gap = 20, renderItem, keyExtractor }) {
  const [width, setWidth] = useState(0);
  const columns = width ? Math.max(1, Math.floor((width + gap) / (minWidth + gap))) : 1;
  const itemWidth = width ? Math.floor((width - gap * (columns - 1)) / columns) : 0;

  return (
    <View
      onLayout={(e) => setWidth(Math.floor(e.nativeEvent.layout.width))}
      style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: gap, rowGap: gap + 12, alignItems: 'flex-start' }}
    >
      {width > 0 &&
        data.map((item) => <Fragment key={keyExtractor(item)}>{renderItem(item, itemWidth)}</Fragment>)}
    </View>
  );
}
