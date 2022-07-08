import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { ActionSheetUtil } from './ActionSheetUtil';

export interface ActionSheetFullProps {
  options: string[];
  optionStyle?: ViewStyle;
  closeStyle?: ViewStyle;

  onSelect?: (item: string, index: number) => void;
  onDisappear?: () => void;
}

const ActionSheetFull: React.FC<ActionSheetFullProps> = (props) => {
  const { options, optionStyle, closeStyle, onSelect } = props;

  return (
    <>
      <View style={styles.hidden}>
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
      <View style={styles.hidden}>
        <TouchableOpacity
          onPress={ActionSheetUtil.hide}
          style={styles.cancelContainer}
        >
          <Text style={[styles.close, closeStyle]}>{`close`}</Text>
        </TouchableOpacity>
      </View>
    </>
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
  itemContainer: {
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: StyleSheet.hairlineWidth,
  },
  cancelContainer: {
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 50,
    marginTop: StyleSheet.hairlineWidth,
  },
  hidden: {
    overflow: 'hidden',
  },
});

export default ActionSheetFull;
