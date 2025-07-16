import * as yup from 'yup';
import { object, string, number, date, ref } from 'yup';

const nameValidation = string().required();
const surnameValidation = string().required();
const identityNumberValidation = string()
   .length(11)
   .required('TC girilmesi zorunlu bir alandır.')
   .matches(/^[1-9][0-9]{10}$/, 'TC Kimlik Numarası 11 haneli ve geçerli olmalıdır')
   .test('isValidTC', 'Geçersiz TC Kimlik Numarası', value => {
      // TC Kimlik algoritmasını kontrol et
      const digits = value.split('').map(Number);

      // 1. kural: İlk 10 haneye göre 11. haneyi doğrula
      const oddSum = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
      const evenSum = digits[1] + digits[3] + digits[5] + digits[7];
      const checkDigit10 = (oddSum * 7 - evenSum) % 10;

      if (checkDigit10 !== digits[9]) return false;

      // 2. kural: İlk 10 hanenin toplamına göre 11. haneyi doğrula
      const totalSum = digits.slice(0, 10).reduce((sum, digit) => sum + digit, 0);
      const checkDigit11 = totalSum % 10;

      if (checkDigit11 !== digits[10]) return false;

      return true;
   });

const ageValidation = number().min(18, 'Yaş en az 18 olmalidir').required().positive().integer();
const emailValidation = string().required('E-mail gereklidir').email('Geçersiz e-mail adresi');
const birthDateValidation = date()
   .required()
   .max(new Date(), 'Doğum tarihi gelecekte olamaz') // Gelecek tarih olamaz;
   .test('age', "Yaşınız 18'den küçük olamaz", value => {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
         return age - 1 >= 18; // 18 yaşından küçükse false döner
      }
      return age >= 18; // 18 yaşından küçükse false döner
   });

const passwordValidation = string()
   .required('Şifre zorunludur') // Şifrenin boş olmaması gerekir
   .min(8, 'Şifre en az 8 karakter uzunluğunda olmalıdır') // Minimum 8 karakter uzunluğu
   .matches(/[A-Z]/, 'Şifre en az bir büyük harf içermelidir') // En az bir büyük harf
   .matches(/[a-z]/, 'Şifre en az bir küçük harf içermelidir') // En az bir küçük harf
   .matches(/[0-9]/, 'Şifre en az bir rakam içermelidir') // En az bir rakam
   .matches(
      /[\!@#\$%\^&\*\(\)\_\+\-=\[\]\{\};:\'",<>\./?\\|`~]/,
      'Şifre en az bir özel karakter içermelidir',
   ); // En az bir özel karakter
//    .test("password-match", "Şifreler birbirini tutmuyor", (value) => {
//       const { passwordConfirmation } = this.parent; // Diğer form elemanlarından 'passwordConfirmation' değerini al
//       return value === passwordConfirmation; // Şifre ve onay şifresi eşit olmalı
//    });

const passwordConfirmValidation = string()
   .required('Şifre zorunludur')
   .oneOf([ref('password')], 'Şifreler eşleşmiyor'); // obje oluştururken password vereceğimizden burası passwordVAlidation değil password kalmalı

const phoneValidation = string()
   .required('Telefon numarası gereklidir')
   .matches(/^[0-9]{10}$/, 'Geçersiz telefon numarası');
const userNameValidation = string().required('Kullanıcı adı gereklidir');

const passwordLoginValidation = string().required('Şifre gereklidir');

const bosSchema = object({});
// Validation Schema
const registerValidationSchema = yup.object().shape({
   name: yup
      .string()
      .min(2, 'Ad en az 2 karakter olmalıdır')
      .max(50, 'Ad en fazla 50 karakter olabilir')
      .required('Ad gereklidir'),
   surname: string()
      .min(2, 'Ad en az 2 karakter olmalıdır')
      .max(50, 'Ad en fazla 50 karakter olabilir')
      .required(),
   email: yup.string().email('Geçerli bir email adresi girin').required('Email adresi gereklidir'),
   phoneNumber: yup
      .string()
      .matches(/^(\+90|0)?[5][0-9]{9}$/, 'Geçerli bir telefon numarası girin')
      .required('Telefon numarası gereklidir'),
   password: yup
      .string()
      .min(8, 'Şifre en az 8 karakter olmalıdır')
      .matches(
         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
         'Şifre en az 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir',
      )
      .required('Şifre gereklidir'),
   termsAccepted: yup
      .boolean()
      .oneOf([true], 'Kullanım koşullarını kabul etmeniz gerekiyor')
      .required('Kullanım koşullarını kabul etmeniz gerekiyor'),
});

const forgotPasswordValidationSchema = yup.object().shape({
   email: yup.string().email('Geçerli bir email adresi girin').required('Email adresi gereklidir'),
});

const loginUserSchema = object({
   emailOrIdentity: emailValidation,
   password: passwordLoginValidation,
});
const resetPasswordValidationSchema = yup.object().shape({
   newPassword: yup
      .string()
      .min(8, 'Şifre en az 8 karakter olmalıdır')
      .matches(
         /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
         'Şifre en az 1 büyük harf, 1 küçük harf ve 1 rakam içermelidir',
      )
      .required('Yeni şifre gereklidir'),
   confirmPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], 'Şifreler eşleşmiyor')
      .required('Şifre tekrarı gereklidir'),
});

const isValidLuhn = (cardNumber: string): boolean => {
   let sum = 0;
   let isEven = false;

   for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);

      if (isEven) {
         digit *= 2;
         if (digit > 9) {
            digit -= 9;
         }
      }

      sum += digit;
      isEven = !isEven;
   }

   return sum % 10 === 0;
};
const cardValidationSchema = yup.object().shape({
   cardHolder: yup
      .string()
      .required('Kart sahibinin adı gereklidir')
      .min(2, 'Ad en az 2 karakter olmalıdır')
      .max(50, 'Ad en fazla 50 karakter olabilir')
      .matches(/^[a-zA-ZğĞıİöÖüÜşŞçÇ\s]+$/, 'Sadece harfler kullanılabilir'),

   cardNumber: yup
      .string()
      .required('Kart numarası gereklidir')
      .matches(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, 'Geçerli bir kart numarası girin')
      .test('luhn-check', 'Geçersiz kart numarası', value => {
         if (!value) return false;
         const numbers = value.replace(/\s/g, '');
         return isValidLuhn(numbers);
      }),

   expiryDate: yup
      .string()
      .required('Son kullanma tarihi gereklidir')
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'MM/YY formatında girin')
      .test('expiry-check', 'Kart süresi dolmuş', value => {
         if (!value) return false;
         const [month, year] = value.split('/');
         const currentDate = new Date();
         const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
         return expiryDate > currentDate;
      }),

   cvc: yup
      .string()
      .required('CVC gereklidir')
      .matches(/^\d{3,4}$/, 'CVC 3 veya 4 haneli olmalıdır'),

   saveCard: yup.boolean(),
});
const addressValidationSchema = yup.object().shape({
   type: yup
      .string()
      .oneOf(['home', 'work', 'other'], 'Geçerli bir adres tipi seçin')
      .required('Adres tipi gereklidir'),
   title: yup
      .string()
      .min(2, 'Adres başlığı en az 2 karakter olmalıdır')
      .max(50, 'Adres başlığı en fazla 50 karakter olabilir')
      .required('Adres başlığı gereklidir'),
   cityId: yup.string().required('Şehir seçimi gereklidir'),
   districtId: yup.string().required('İlçe seçimi gereklidir'),
   fullAddress: yup
      .string()
      .min(10, 'Detaylı adres en az 10 karakter olmalıdır')
      .max(200, 'Detaylı adres en fazla 200 karakter olabilir')
      .required('Detaylı adres gereklidir'),
   buildingNo: yup.string().max(10, 'Bina no en fazla 10 karakter olabilir'),
   apartmentNo: yup.string().max(10, 'Daire no en fazla 10 karakter olabilir'),
   floor: yup.string().max(5, 'Kat bilgisi en fazla 5 karakter olabilir'),
   postalCode: yup.string().matches(/^\d{5}$/, 'Posta kodu 5 haneli olmalıdır'),
   isDefault: yup.boolean(),
});

export {
   registerValidationSchema,
   loginUserSchema,
   resetPasswordValidationSchema,
   bosSchema,
   forgotPasswordValidationSchema,
   cardValidationSchema,
   addressValidationSchema,
};
