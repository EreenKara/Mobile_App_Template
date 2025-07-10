import RNFS from 'react-native-fs';

async function convertImageToBase64(
  mimeType: string,
  uri: string,
): Promise<string> {
  if (!uri || !mimeType) {
    throw new Error('Hem uri hem de mimeType zorunludur.');
  }

  try {
    const base64 = await RNFS.readFile(uri, 'base64');
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Base64 dönüşüm hatası:', error);
    throw error;
  }
}

export default convertImageToBase64;
