const generateCodigoWork = () => {
  let codigo = '';
  var letters = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];
  var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = 0; i < 6; i++) {
    if (i % 2 == 0) {
      codigo += letters[Math.floor(Math.random() * 26)];
    } else {
      codigo += numbers[Math.floor(Math.random() * 9)];
    }
  }
  return codigo;
};

module.exports = {
  generateCodigoWork,
};
