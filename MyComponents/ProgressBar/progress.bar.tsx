import {StyleSheet, View, ViewProps} from 'react-native';
import React from 'react';
import {useStyles} from '@hooks/Modular/use.styles';
import {ColorsSchema} from '@styles/common/colors';

interface ProgressBarProps {
  progress: number;
  height: number;
}
const ProgressBarComponent: React.FC<ProgressBarProps> = ({
  progress,
  height,
}) => {
  const styles = useStyles(createStyles);
  return <View style={[styles.container, {height: height}]}></View>;
};

export default ProgressBarComponent;

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    progressBar: {
      flexDirection: 'row',
      width: '100%',
    },
    progress: {
      backgroundColor: 'red',
    },
    remain: {
      backgroundColor: 'blue',
    },
  });
