import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { Picker } from 'react-native-maui';
import Section from '../components/Section';

const { width } = Dimensions.get('window');

const years: string[] = [];
for (let i = 1980; i < 2050; i++) {
  years.push(`${i}`);
}

const months: string[] = [];
for (let i = 1; i < 13; i++) {
  months.push(`${i}`);
}

const getDays = (month: string) => {
  if (
    month === '1' ||
    month === '3' ||
    month === '5' ||
    month === '7' ||
    month === '8' ||
    month === '10' ||
    month === '12'
  ) {
    return new Array(31).fill(0).map((_, index) => index + 1);
  }
  if (month === '4' || month === '6' || month === '9' || month === '11') {
    return new Array(30).fill(0).map((_, index) => index + 1);
  }
  return new Array(28).fill(0).map((_, index) => index + 1);
};

interface PickerExampleProps {}

const PickerExample: React.FC<PickerExampleProps> = (props) => {
  const {} = props;

  const [year, setYear] = useState('1980');
  const [month, setMonth] = useState('1');

  const days = useMemo(() => {
    return getDays(month);
  }, [month]);

  const [day, setDay] = useState('1');

  useEffect(() => {
    console.log(`当前选择的时间：${year} - ${month} - ${day}`);
  }, [year, month, day]);

  return (
    <View style={styles.flex}>
      <Section title="基本用法">
        <View style={styles.picker1}>
          <Picker
            style={styles.flex}
            dataSource={new Array(100).fill(0).map((_, index) => index)}
            renderItem={(item) => {
              return <Text style={styles.title}>{item}</Text>;
            }}
            options={{
              maxRender: 4,
            }}
          />
        </View>
      </Section>
      {/* <Section title="时间选择器">
        <View style={styles.picker2}>
          <Picker
            style={styles.flex}
            dataSource={years}
            renderItem={(item) => {
              return <Text style={styles.title}>{item}</Text>;
            }}
            onChange={(item) => {
              setYear(item);
            }}
          />
          <Picker
            style={styles.flex}
            dataSource={months}
            renderItem={(item) => {
              return <Text style={styles.title}>{item}</Text>;
            }}
            onChange={(item) => {
              setMonth(item);
            }}
          />
          <Picker
            style={styles.flex}
            dataSource={days}
            renderItem={(item) => {
              return <Text style={styles.title}>{item}</Text>;
            }}
            onChange={(item) => {
              setDay(item);
            }}
          />
        </View>
      </Section> */}
    </View>
  );
};

const styles = StyleSheet.create({
  picker1: {
    flex: 1,
    flexDirection: 'row',
    width: width - 30,
  },
  picker2: {
    flexDirection: 'row',
    width: width - 30,
  },
  flex: {
    flex: 1,
  },
  title: {
    fontSize: 20,
  },
});

export default PickerExample;
