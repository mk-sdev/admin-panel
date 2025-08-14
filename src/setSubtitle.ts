export function setSubtitle(partName: string, mystery: string): string {
  let subtitle = ''
  if (partName === 'radosna') {
    if (mystery === '1') {
      subtitle = 'Tajemnica pierwsza - Zwiastowanie Najświętszej Maryi Panny'
    } else if (mystery === '2') {
      subtitle = 'Tajemnica druga - Nawiedzenie św. Elżbiety'
    } else if (mystery === '3') {
      subtitle = 'Tajemnica trzecia - Narodzenie Pana Jezusa'
    } else if (mystery === '4') {
      subtitle = 'Tajemnica cawarta - Ofiarowanie Pana Jezusa w świątyni'
    } else if (mystery === '5') {
      subtitle = 'Tajemnica piąta - Znalezienie Pana Jezusa w świątyni'
    }
  } else if (partName === 'światła') {
    if (mystery === '1') {
      subtitle = 'Tajemnica pierwsza - Chrzest Pana Jezusa w Jordanie'
    } else if (mystery === '2') {
      subtitle =
        'Tajemnica druga - Objawienie się Pana Jezusa na weselu w Kanie Galilejskiej'
    } else if (mystery === '3') {
      subtitle =
        'Tajemnica trzecia - Głoszenie Królestwa Bożego i wzywanie do nawrócenia'
    } else if (mystery === '4') {
      subtitle = 'Tajemnica cawarta - Przemienienie Pańskie'
    } else if (mystery === '5') {
      subtitle = 'Tajemnica piąta - Ustanowienie Eucharystii'
    }
  } else if (partName === 'bolesna') {
    if (mystery === '1') {
      subtitle = 'Tajemnica pierwsza - Modlitwa Pana Jezusa w Ogrójcu'
    } else if (mystery === '2') {
      subtitle = 'Tajemnica druga - Biczowanie Pana Jezusa'
    } else if (mystery === '3') {
      subtitle = 'Tajemnica trzecia - Cierniem ukoronowanie Pana Jezusa'
    } else if (mystery === '4') {
      subtitle = 'Tajemnica cawarta - Droga Krzyżowa Pana Jezusa'
    } else if (mystery === '5') {
      subtitle = 'Tajemnica piąta - Śmierć Pana Jezusa na krzyżu'
    }
  } else if (partName === 'chwalebna') {
    if (mystery === '1') {
      subtitle = 'Tajemnica pierwsza - Zmartwychwstanie Pana Jezusa'
    } else if (mystery === '2') {
      subtitle = 'Tajemnica druga - Wniebowstąpienie Pana Jezusa'
    } else if (mystery === '3') {
      subtitle = 'Tajemnica trzecia - Zesłanie Ducha Świętego'
    } else if (mystery === '4') {
      subtitle = 'Tajemnica cawarta - Wniebowzięcie Najświętszej Maryi Panny'
    } else if (mystery === '5') {
      subtitle =
        'Tajemnica piąta - Ukoronowanie Najświętszej Maryi Panny na Królową Nieba i Ziemi'
    }
  }

  return subtitle
}
