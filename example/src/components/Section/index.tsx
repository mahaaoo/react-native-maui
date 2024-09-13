import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';

interface SectionProps {
  title: string;
  style?: ViewStyle;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = (props) => {
  const { title, children, style } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={[styles.content, style]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    padding: 15,
    fontSize: 16,
  },
  content: {
    padding: 15,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default Section;
