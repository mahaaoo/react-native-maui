import React from 'react';
import {View, StyleSheet, Text, ViewStyle} from 'react-native';

interface SectionProps {
  title: string;
  style?: ViewStyle
};

const Section: React.FC<SectionProps> = props => {
  const {title, children, style} = props;

  return (
    <View style={styles.container}>
      <Text style={{ padding: 15, fontSize: 16 }}>{title}</Text>
      <View style={[{ padding: 15, backgroundColor: 'white', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}, style]}>
        {children}
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    
  }
})

export default Section;
