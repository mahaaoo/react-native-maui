import React from 'react';
import {View, Text, TouchableOpacity,ViewStyle, StyleSheet} from 'react-native';
import { ActionSheetUtil } from './ActionSheetUtil';

export interface ActionSheetProps {
  options: string[];
  optionStyle?: ViewStyle;
  closeStyle?: ViewStyle;

  onSelect?: (item: string, index: number) => void;
  onDisappear?: () => void;
};

const ActionSheet: React.FC<ActionSheetProps> = props => {
  const {options, optionStyle, closeStyle, onSelect } = props;

  return (
    <View style={{ marginBottom: 50 }}>
      <View style={{ borderRadius: 8, marginHorizontal: 15, overflow: 'hidden'}}>
        {options.map((item, index) => {
          return (
            <TouchableOpacity 
              key={`action_sheet_${index}`} 
              style={{ justifyContent: 'center', backgroundColor: '#F8F8F8', alignItems: 'center', paddingVertical: 15, marginTop: StyleSheet.hairlineWidth }}
              onPress={() => {
                ActionSheetUtil.hide();
                onSelect && onSelect(item, index);
              }}
            >
              <Text style={[styles.item, optionStyle]}>{item}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
      <View style={{ borderRadius: 8, marginHorizontal: 15, marginTop: 10, overflow: 'hidden' }}>
        <TouchableOpacity
          onPress={ActionSheetUtil.hide}
          style={{ justifyContent: 'center', backgroundColor: '#F8F8F8', alignItems: 'center', paddingVertical: 15, marginTop: StyleSheet.hairlineWidth }}>
          <Text style={[styles.close, closeStyle]}>{`close`}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  item: { 
    fontSize: 20, 
    color: '#1e90ff'
  },
  close: {
    fontSize: 20, 
    color: 'red'
  }
});

export default ActionSheet;
