import {TextStyle} from 'react-native';

const space: number = 8;
const styleNumbers = {
  spaceLittle: space / 2,
  space: space, // padding ve margin icin ortak deger.
  spaceLarge: space * 2,
  textSize: 14, // bütün text'lerin font size'ı
  buttonSize: 48, // bütün input, button vb oglerin size'ı
  borderRadius: 16, // her birinin yuvarlaklıgı
  iconSize: 24, // her birinin icon'u
  borderWidth: 2, // bütün border'ların width'i
  fontWeight: '600' as const, // bütün font'lerin weight'i
};

export default styleNumbers;
