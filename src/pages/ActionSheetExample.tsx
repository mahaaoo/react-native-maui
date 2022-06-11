import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import Button from '../components/Button';
import { useOverlay, TranslateContainer } from '../components/Overlay';

interface ActionSheetExampleProps {
};

const options = ['option1', 'option2', 'option3', 'option4', 'option5'];
const errors = ['close', 'close2'];
const ActionSheetExample: React.FC<ActionSheetExampleProps> = props => {
  const {} = props;
  const {add} = useOverlay();

  return (
    <View style={styles.container}>
      <Button onPress={() => {
        add(
          <TranslateContainer>
            <View style={{ borderRadius: 8, margin: 15, overflow: 'hidden', marginBottom: 50 }}>
              {options.map((item, index) => {
                return (
                  <TouchableOpacity key={`action_sheet_${index}`} style={{ justifyContent: 'center', backgroundColor: '#F8F8F8', alignItems: 'center', paddingVertical: 15, marginTop: StyleSheet.hairlineWidth }}>
                    <Text style={{ fontSize: 20, color: '#1e90ff' }}>{item}</Text>
                  </TouchableOpacity>
                )
              })}
              <View>
                {errors.map((item, index) => {
                  return (
                    <TouchableOpacity key={`action_sheet_${index}`} style={{ justifyContent: 'center', backgroundColor: '#F8F8F8', alignItems: 'center', paddingVertical: 15, marginTop: StyleSheet.hairlineWidth }}>
                      <Text style={{ fontSize: 20, color: '#1e90ff' }}>{item}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </TranslateContainer>,
          'action-sheet'
        )
      }}>
        <Text>默认样式</Text>
      </Button>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})

export default ActionSheetExample;
