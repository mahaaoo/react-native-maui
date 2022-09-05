import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  Dimensions,
} from 'react-native';
import { useTheme } from 'react-native-maui';

const { width } = Dimensions.get('window');

interface CardProps {
  content: React.ReactNode;
  onPress: () => void;
  title: string;

  style?: ViewStyle;
}

const Card: React.FC<CardProps> = (props) => {
  const { content, onPress, style, title } = props;
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.cardBackgroundColor },
        style,
      ]}
    >
      <View
        style={[
          styles.backgroundContainer,
          { backgroundColor: theme.cardContentColor },
        ]}
      >
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.cardTitleColor }]}>
            {title}
          </Text>
        </View>
        <View style={styles.content} pointerEvents={'none'}>
          {content}
        </View>
      </View>
      <TouchableOpacity
        testID={`Navigate-Button-${title}`}
        style={styles.titleContainer}
        onPress={onPress}
      >
        <Text style={{ color: theme.clickTextColor }}>more</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: (width - 50) / 2,
    height: 150,
    borderRadius: 8,
  },
  backgroundContainer: {
    flex: 1,
    marginHorizontal: 2,
    marginTop: 2,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  titleContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 5,
    overflow: 'hidden',
  },
});

export default Card;
