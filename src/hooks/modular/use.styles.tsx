import {useMemo} from 'react';
import {useThemeColors} from '@contexts/index';
import {ColorsSchema} from '@styles/common/colors';

// Generic olarak tasarlandı, farklı stilleri destekler
export function useStyles<T>(createStyles: (colors: ColorsSchema) => T): T {
  const {colors} = useThemeColors();
  return useMemo(() => createStyles(colors), [colors]);
}
