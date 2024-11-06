export function decodeWindows1252(buffer: ArrayBuffer): string {
  // Implementação personalizada para Windows-1252
  const bytes = new Uint8Array(buffer);
  let result = '';
  
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i];
    // Mapeamento específico para caracteres especiais do Windows-1252
    switch (byte) {
      case 0xE0: result += 'à'; break;
      case 0xE1: result += 'á'; break;
      case 0xE2: result += 'â'; break;
      case 0xE3: result += 'ã'; break;
      case 0xE7: result += 'ç'; break;
      case 0xE9: result += 'é'; break;
      case 0xEA: result += 'ê'; break;
      case 0xED: result += 'í'; break;
      case 0xF3: result += 'ó'; break;
      case 0xF4: result += 'ô'; break;
      case 0xF5: result += 'õ'; break;
      case 0xFA: result += 'ú'; break;
      case 0xC0: result += 'À'; break;
      case 0xC1: result += 'Á'; break;
      case 0xC2: result += 'Â'; break;
      case 0xC3: result += 'Ã'; break;
      case 0xC7: result += 'Ç'; break;
      case 0xC9: result += 'É'; break;
      case 0xCA: result += 'Ê'; break;
      case 0xCD: result += 'Í'; break;
      case 0xD3: result += 'Ó'; break;
      case 0xD4: result += 'Ô'; break;
      case 0xD5: result += 'Õ'; break;
      case 0xDA: result += 'Ú'; break;
      default:
        if (byte < 128) {
          result += String.fromCharCode(byte);
        } else {
          result += String.fromCharCode(byte);
        }
    }
  }
  return result;
}

export function encodeWindows1252(text: string): Uint8Array {
  const encoder = new TextEncoder();
  const utf8Bytes = encoder.encode(text);
  const win1252Bytes: number[] = [];

  // Mapeamento reverso de caracteres especiais
  const specialChars: { [key: string]: number } = {
    'à': 0xE0, 'á': 0xE1, 'â': 0xE2, 'ã': 0xE3, 'ç': 0xE7,
    'é': 0xE9, 'ê': 0xEA, 'í': 0xED, 'ó': 0xF3, 'ô': 0xF4,
    'õ': 0xF5, 'ú': 0xFA, 'À': 0xC0, 'Á': 0xC1, 'Â': 0xC2,
    'Ã': 0xC3, 'Ç': 0xC7, 'É': 0xC9, 'Ê': 0xCA, 'Í': 0xCD,
    'Ó': 0xD3, 'Ô': 0xD4, 'Õ': 0xD5, 'Ú': 0xDA
  };

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char in specialChars) {
      win1252Bytes.push(specialChars[char]);
    } else {
      win1252Bytes.push(char.charCodeAt(0));
    }
  }

  return new Uint8Array(win1252Bytes);
}