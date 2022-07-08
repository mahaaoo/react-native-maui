import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { ActionSheetUtil } from './ActionSheetUtil';

export interface ActionSheetProps {
  options: string[];
  optionStyle?: ViewStyle;
  closeStyle?: ViewStyle;
  marginBottom?: number;

  onSelect?: (item: string, index: number) => void;
  onDisappear?: () => void;
}

const ActionSheet: React.FC<ActionSheetProps> = (props) => {
  const {
    options,
    optionStyle,
    closeStyle,
    onSelect,
    marginBottom = 50,
  } = props;

  return (
    <View style={{ marginBottom: marginBottom }}>
      <View style={styles.container}>
        {options.map((item, index) => {
          return (
            <TouchableOpacity
              key={`action_sheet_${index}`}
              style={styles.itemContainer}
              onPress={() => {
                ActionSheetUtil.hide();
                onSelect && onSelect(item, index);
              }}
            >
              <Text style={[styles.item, optionStyle]}>{item}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.errorContainer}>
        <TouchableOpacity
          onPress={ActionSheetUtil.hide}
          style={styles.itemContainer}
        >
          <Text style={[styles.close, closeStyle]}>{`close`}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    fontSize: 20,
    color: '#1e90ff',
  },
  close: {
    fontSize: 20,
    color: 'red',
  },
  container: {
    borderRadius: 8,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  itemContainer: {
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: StyleSheet.hairlineWidth,
  },
  errorContainer: {
    borderRadius: 8,
    marginHorizontal: 15,
    marginTop: 10,
    overflow: 'hidden',
  },
});

export default ActionSheet;
