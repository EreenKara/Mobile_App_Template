declare module 'victory-native' {
  import {ComponentType, ReactNode} from 'react';

  // Ortak tipler
  interface ChartData {
    [key: string]: any;
  }

  interface ChartProps {
    data?: ChartData[];
    labelKey?: string;
    valueKey?: string;
    colorKey?: string;
    width?: number;
    height?: number;
    children?: ReactNode;
  }

  // Pie Chart bileşenleri
  interface PieSliceProps {
    radius?: number;
    startAngle?: number;
    endAngle?: number;
    center?: {
      x: number;
      y: number;
    };
    color?: string;
    children?: ReactNode;
    animate?: {
      type?: 'timing' | 'spring';
      duration?: number;
      delay?: number;
      easing?: (t: number) => number;
    };
  }

  interface PieSliceAngularInsetProps {
    angularInset?: {
      angularStrokeWidth?: number;
      angularStrokeColor?: string;
    };
  }

  interface PieChartProps extends ChartProps {
    innerRadius?: string;
    circleSweepDegrees?: number;
    startAngle?: number;
    children?: (props: {slice: any}) => ReactNode;
  }

  // Cartesian Chart bileşenleri
  interface CartesianChartProps extends ChartProps {
    xKey?: string;
    yKey?: string;
  }

  interface LineProps {
    color?: string;
    strokeWidth?: number;
  }

  // Ana bileşenler
  export const CartesianChart: ComponentType<CartesianChartProps>;
  export const Line: ComponentType<LineProps>;

  export namespace Pie {
    export const Chart: ComponentType<PieChartProps>;
    export const Slice: ComponentType<PieSliceProps>;
    export const SliceAngularInset: ComponentType<PieSliceAngularInsetProps>;
    export const Label: ComponentType<PieLabelProps>;
    export const SliceBackground: ComponentType<PieSliceBackgroundProps>;
    export const SliceStroke: ComponentType<PieSliceStrokeProps>;
    export const SliceText: ComponentType<PieSliceTextProps>;
  }

  export const PolarChart: ComponentType<ChartProps>;
}
