const { mdLinks } = require('./index.js');

mdLinks('tests/readme2.md', false) // Puedo pasar true o false para habilitar el validate
  .then(links => {
    console.log(links);
  })
  .catch((error) => {
    console.error(error);
  });