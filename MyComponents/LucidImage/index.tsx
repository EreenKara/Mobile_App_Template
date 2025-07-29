import { LucideIcon, LucideProps } from 'lucide-react-native';
import { cssInterop } from 'nativewind';
import { ImageStyle } from 'react-native';

export interface ImageComponentProps extends LucideProps {
   /** NativeWind className - color desteği dahil (text-appIcon gibi) */
   Icon: LucideIcon;
   className?: string;
}
const iconInteropConfig = {
   className: {
      target: 'style',
      nativeStyleToProp: {
         color: 'color',
         tintColor: 'color',
      },
   },
};

const IconComponent: React.FC<ImageComponentProps> = ({ Icon, className, ...props }) => {
   const IconComponent = cssInterop(Icon, iconInteropConfig as any);

   return <IconComponent className={className} {...props} />;
};

export default IconComponent;
