export function setSubtitle(
  partName: string,
  mystery: string
): { subtitle: string; image: string } {
  let subtitle = ''
  let image = ''

  if (partName === 'radosna') {
    if (mystery === '1') {
      subtitle = 'Tajemnica pierwsza - Zwiastowanie Najświętszej Maryi Panny'
      image = 'https://i.ibb.co/qM7ZMb3B/01-Zwiastowanie-1.png'
    } else if (mystery === '2') {
      subtitle = 'Tajemnica druga - Nawiedzenie św. Elżbiety'
      image = 'https://i.ibb.co/ccvLp4v1/02-Nawiedzenie-1.png'
    } else if (mystery === '3') {
      subtitle = 'Tajemnica trzecia - Narodzenie Pana Jezusa'
      image = 'https://i.ibb.co/ynvXKF1Q/03-Narodzenie-1.png'
    } else if (mystery === '4') {
      subtitle = 'Tajemnica cawarta - Ofiarowanie Pana Jezusa w świątyni'
      image = 'https://i.ibb.co/BKgqSB5j/04-Ofiarowanie-1.png'
    } else if (mystery === '5') {
      subtitle = 'Tajemnica piąta - Znalezienie Pana Jezusa w świątyni'
      image = 'https://i.ibb.co/x8DS26K0/05-Odnalezienie-1.png'
    }
  } else if (partName === 'światła') {
    if (mystery === '1') {
      subtitle = 'Tajemnica pierwsza - Chrzest Pana Jezusa w Jordanie'
      image = 'https://i.ibb.co/YBGyhf9p/06-Jordan-1.png'
    } else if (mystery === '2') {
      subtitle =
        'Tajemnica druga - Objawienie się Pana Jezusa na weselu w Kanie Galilejskiej'
      image = 'https://i.ibb.co/13Ddzdh/07-Kana-1.png'
    } else if (mystery === '3') {
      subtitle =
        'Tajemnica trzecia - Głoszenie Królestwa Bożego i wzywanie do nawrócenia'
      image = 'https://i.ibb.co/6Rwws6bN/08-Galilea-1.png'
    } else if (mystery === '4') {
      subtitle = 'Tajemnica cawarta - Przemienienie Pańskie na górze Tabor'
      image = 'https://i.ibb.co/pvm6QRVT/09-Tabor-1.png'
    } else if (mystery === '5') {
      image = 'https://i.ibb.co/DH9qGTxs/10-Eucharystia-1.png'
      subtitle = 'Tajemnica piąta - Ustanowienie Eucharystii'
    }
  } else if (partName === 'bolesna') {
    if (mystery === '1') {
      subtitle = 'Tajemnica pierwsza - Modlitwa Pana Jezusa w Ogrójcu'
      image = 'https://i.ibb.co/KcfdHWCX/11-Ogr-jec-1.png'
    } else if (mystery === '2') {
      image = 'https://i.ibb.co/6j54NTh/12-Biczowanie-1.png'
      subtitle = 'Tajemnica druga - Biczowanie Pana Jezusa'
    } else if (mystery === '3') {
      image = 'https://i.ibb.co/kfwwFVc/13-Cierniem-kor-1.png'
      subtitle = 'Tajemnica trzecia - Cierniem ukoronowanie Pana Jezusa'
    } else if (mystery === '4') {
      image = 'https://i.ibb.co/d4rq6D4S/14-Droga-krz-1.png'
      subtitle = 'Tajemnica cawarta - Droga Krzyżowa Pana Jezusa'
    } else if (mystery === '5') {
      subtitle = 'Tajemnica piąta - Śmierć Pana Jezusa na krzyżu'
      image = 'https://i.ibb.co/fGMF6Kxj/15-Ukrzy-owanie-1.png'
    }
  } else if (partName === 'chwalebna') {
    if (mystery === '1') {
      image = 'https://i.ibb.co/yBntQhHT/16-Zmartwychwstanie-1.png'
      subtitle = 'Tajemnica pierwsza - Zmartwychwstanie Pana Jezusa'
    } else if (mystery === '2') {
      image = 'https://i.ibb.co/DDZqx8V5/17-Wniebowst-pienie-1.png'
      subtitle = 'Tajemnica druga - Wniebowstąpienie Pana Jezusa'
    } else if (mystery === '3') {
      subtitle = 'Tajemnica trzecia - Zesłanie Ducha Świętego'
      image = 'https://i.ibb.co/nMS6PDqc/18-Pi-dziesi-tnica-1.png'
    } else if (mystery === '4') {
      image = 'https://i.ibb.co/HTDCWcZn/19-Wniebowzi-cie-1.png'
      subtitle = 'Tajemnica cawarta - Wniebowzięcie Najświętszej Maryi Panny'
    } else if (mystery === '5') {
      subtitle =
        'Tajemnica piąta - Ukoronowanie Najświętszej Maryi Panny na Królową Nieba i Ziemi'
      image = 'https://i.ibb.co/dwNWXBSL/20-Ukoronowanie-1.png'
    }
  }

  return { subtitle, image }
}
