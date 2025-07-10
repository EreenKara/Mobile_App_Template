import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import CommonStyles from '@styles/common/commonStyles';
import Colors, { ColorsSchema } from '@styles/common/colors';
import ButtonComponent from '@mycomponents/Button/Button';
import styleNumbers from '@styles/common/style.numbers';
import { useNavigation } from '@react-navigation/native';
import { HomeStackParamList, SharedStackParamList } from '@navigation/NavigationTypes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSearchContext } from '@contexts/search.context';
import { ElectionType } from '@enums/election.type';
import { useStyles } from '@hooks/Modular/use.styles';
const menuItems = [
   {
      title: 'Gelecek Seçimler',
      description: 'Yaklaşan seçimleri görüntüleyin',
      screen: 'ListElections' as const,
      routeParams: { type: ElectionType.Upcoming },
      icon: '📅',
   },
   {
      title: 'Güncel Seçimler',
      description: 'Devam eden seçimleri görüntüleyin',
      screen: 'ListElections' as const,
      routeParams: { type: ElectionType.Current },
      icon: '📈',
   },
   {
      title: 'Geçmiş Seçimler',
      description: 'Tamamlanan seçimleri görüntüleyin',
      screen: 'ListElections' as const,
      routeParams: { type: ElectionType.Past },
      icon: '📊',
   },
];

interface HistoryCardComponentProps {
   style?: ViewStyle;
}
type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'Shared'>;

const HistoryCardComponent: React.FC<HistoryCardComponentProps> = ({ style }) => {
   const styles = useStyles(createStyles);

   const { search } = useSearchContext();
   const navigation = useNavigation<HomeNavigationProp>();
   return (
      <View style={[styles.container, style]}>
         <View>
            <Text style={[CommonStyles.textStyles.title, { textAlign: 'center' }]}>
               {search.city} Seçimleri
            </Text>
         </View>
         {menuItems.map((item, index) => (
            <Card key={index} style={[styles.card]}>
               <Card.Content>
                  <Title
                     style={[CommonStyles.textStyles.title, { color: Colors.getTheme().cardText }]}>
                     {item.icon} {item.title}
                  </Title>
                  <Paragraph
                     style={[
                        CommonStyles.textStyles.paragraph,
                        { color: Colors.getTheme().cardText },
                     ]}>
                     {item.description}
                  </Paragraph>
               </Card.Content>
               <Card.Actions>
                  <ButtonComponent
                     title="İncele"
                     onPress={() => {
                        navigation.navigate('Shared', {
                           screen: item.screen,
                           params: item.routeParams,
                        });
                     }}
                  />
               </Card.Actions>
            </Card>
         ))}
      </View>
   );
};

export default HistoryCardComponent;

const createStyles = (colors: ColorsSchema) =>
   StyleSheet.create({
      container: {
         ...CommonStyles.viewStyles.container,
         width: '100%',
         backgroundColor: colors.transition,
      },
      card: {
         ...CommonStyles.viewStyles.card,
         marginBottom: styleNumbers.spaceLarge,
         ...CommonStyles.shadowStyle,
         backgroundColor: colors.cardBackground,
      },
   });
