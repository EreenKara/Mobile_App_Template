import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {Card, Title, Paragraph, Button} from 'react-native-paper';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '@navigation/types';
import styleNumbers from '@styles/common/style.numbers';
import CommonStyles from '@styles/common/commonStyles';
import Colors, {ColorsSchema} from '@styles/common/colors';
import ButtonComponent from '@components/Button/Button';
import {
  useAuthContext,
  useElectionCreationContext,
  useUserProfileContext,
} from '@contexts/index';
import {useStyles} from '@hooks/Modular/use.styles';
type Props = NativeStackScreenProps<HomeStackParamList, 'HomeMain'>;

const HomeScreen: React.FC<Props> = ({navigation}) => {
  const styles = useStyles(createStyles);
  const {token} = useAuthContext();
  const {step, electionId} = useElectionCreationContext();
  let menuItems;
  if (token === null) {
    menuItems = [
      {
        title: 'Seçimler',
        description: 'İstediğiniz bir seçimi görüntüleyin',
        screen: 'Elections' as const,
        icon: '📅',
      },
    ];
  } else {
    menuItems = [
      {
        title: 'Seçim Oluştur',
        description: 'Yeni bir seçim oluşturun ve yönetin',
        screen: 'BlockchainOrDb' as const,
        icon: '🗳️',
      },
      {
        title: 'Public Seçimler',
        description: 'Genel seçimleri görüntüleyin',
        screen: 'Elections' as const,
        icon: '🗳️',
      },

      {
        title: 'Private Secimler',
        description: 'Size özel seçimleri görüntüleyin',
        screen: 'PrivateElections' as const,
        icon: '📅',
      },
      // {
      //   title: 'Aday Ol',
      //   description: 'Seçimlere aday olarak katılın',
      //   screen: 'BeCandidate' as const,
      //   icon: '👤',
      // },
    ];
  }

  return (
    <View style={[styles.container]}>
      {menuItems.map((item, index) => {
        let image;
        let color;
        switch (item.screen) {
          case 'BlockchainOrDb':
            image = require('@assets/images/ballot_box1.jpg');
            color = 'rgba(50,200,50,1)';
            break;
          case 'Elections':
            image = require('@assets/images/turkeymap.png');
            color = 'rgba(205,50,50,1)';
            break;
          case 'PrivateElections':
            image = require('@assets/images/group-people.png');
            color = 'rgba(  42,133,165,1)';
            break;
        }
        return (
          <Card key={index} style={[styles.card]}>
            <Card.Content>
              <View style={{flexDirection: 'row'}}>
                <Image
                  style={[styles.icon, {tintColor: color}]}
                  source={image}
                />
                <Title style={[CommonStyles.textStyles.title, styles.text]}>
                  {item?.title}
                </Title>
              </View>

              <Paragraph
                style={[CommonStyles.textStyles.paragraph, styles.text]}>
                {item?.description}
              </Paragraph>
            </Card.Content>
            <Card.Actions>
              <ButtonComponent
                style={styles.button}
                title="İncele"
                onPress={() => {
                  if (item?.screen === 'BlockchainOrDb') {
                    switch (step) {
                      case null:
                        navigation.navigate('BlockchainOrDb');
                        break;
                      case 'Info completed':
                        navigation.navigate('Shared', {
                          screen: 'PublicOrPrivate',
                          params: {electionId},
                        });
                        break;
                      case 'Access completed':
                        navigation.navigate('Shared', {
                          screen: 'ElectionCandidates',
                          params: {electionId},
                        });
                        break;
                      case 'Candidate completed':
                        navigation.navigate('Shared', {
                          screen: 'DefaultCustom',
                          params: {electionId},
                        });
                        break;
                      default:
                        navigation.navigate('BlockchainOrDb');
                    }
                  } else
                    navigation.navigate(
                      item?.screen
                        ? item?.screen === 'PrivateElections'
                          ? 'PastCurrentUpcoming'
                          : item?.screen
                        : 'BlockchainOrDb',
                    );
                }}
              />
            </Card.Actions>
          </Card>
        );
      })}
    </View>
  );
};

const createStyles = (colors: ColorsSchema) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: styleNumbers.space,
      backgroundColor: colors.background,
    },
    card: {
      ...CommonStyles.viewStyles.card,
      marginBottom: styleNumbers.space,
    },
    text: {
      color: colors.cardText,
    },
    button: {
      backgroundColor: colors.cardButton,
    },
    icon: {
      width: 50,
      height: 50,
      tintColor: 'black',
      marginRight: styleNumbers.space,
    },
  });

export default HomeScreen;
