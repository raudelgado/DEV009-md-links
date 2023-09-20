const { mdLinks } = require('./index.js');

mdLinks('./pruebas/README-EXAMPLE.md') // Puedo pasar true o false para habilitar el validate
  .then(links => {
    // => [{ href, text, file }, ...]
  })
  .catch((error) => {
    console.error(error);
  });