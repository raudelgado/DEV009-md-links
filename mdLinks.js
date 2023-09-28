const { mdLinks } = require('./index.js');

mdLinks('./pruebas/README-EXAMPLE.md', true) // Puedo pasar true o false para habilitar el validate
  .then(links => {
    console.log(links);
  })
  .catch((error) => {
    console.error(error);
  });