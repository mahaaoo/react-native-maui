import React, { useCallback } from 'react';
import {View, Dimensions, StyleSheet, ViewStyle, TouchableOpacity} from 'react-native';
import {DividerProps, Divider} from '../Divider';
import {useProps} from './utils';

const {width} = Dimensions.get('window');

export type ContentType = string | React.ReactNode | null;

export interface ListRowProps {
  left: ContentType
  mid?: ContentType;
  right?: ContentType;

  disabled?: boolean;
  onPress?: () => void;
  style?: ViewStyle;

  divider?: boolean;
  dividerProps?: DividerProps
};

const ListRow: React.FC<ListRowProps> = props => {
  const {style, left, right, mid, onPress, divider = true, dividerProps, disabled = false} = useProps(props);

  const handlePress = useCallback(() => {
    if (disabled == false) {
      onPress && onPress();
    }
  }, [])

  return (
    <>
      <TouchableOpacity onPress={handlePress} activeOpacity={disabled ? 1 : 0.3} style={[styles.listRow, style]}>
        <View style={styles.leftContent}>
          {left}
          {mid}
        </View>
        <View>
          {right}
        </View>
      </TouchableOpacity>
      {
        divider && <Divider start={0} end={width} {...{...dividerProps}} />
      }
    </>
  )
};

const styles = StyleSheet.create({
  listRow: {
    width: '100%',
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
  }
})


export default ListRow;
