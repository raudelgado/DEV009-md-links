const { mdLinks } = require('../index.js');
const { isMarkdownFile,
  readingFile,
  validatedLinks,
  getMarkdownFiles } = require('../function.js');
const axios = require('axios');

jest.mock('axios');

describe('mdLinks', () => { 
  it('should...', () => {
    console.log('FIX ME!');
  });
  it('Debe rechazar cuando el path no exista', () => {
    return mdLinks('/Rau/documents/notfound.md').catch((error) => {
      expect(error).toBe('The route does not exist');
    });
  });
  it('Debe validar que sea un archivo md', () => {
    return mdLinks('pruebas/example.txt').catch((error) => {
      expect(error).toBe('Is not a md document');
    });
  });
});

describe('isMarkdownfile', () => {
  it('Debe devolver true si el path tiene un documento .md', () => {
    const filePath = 'example.md';
    const result = isMarkdownFile(filePath);
    expect(result).toBe(true);
  });
  it('Debe devolver false si el path no tiene un documento .md', () => {
    const filePath = 'example.txt';
    const result = isMarkdownFile(filePath);
    expect(result).toBe(false);
  });
});

describe('readingFile', () => {
  it('Debe leer el contenido del archivo cuando se le de un path valido', () => {
    const filePath = 'tests/readme2.md';
    const expectedData = [
      {
        href: 'https://www.drupal.org/project/views',
        text: 'Views',
        file: 'C:\\Users\\Rau\\Documents\\DEV009-md-links\\tests\\readme2.md'
      },
      {
        href: 'https://www.drupal.org/project/panels',
        text: 'Panels',
        file: 'C:\\Users\\Rau\\Documents\\DEV009-md-links\\tests\\readme2.md'
      }
    ];

    return readingFile(filePath)
      .then((data) => {
        expect(data).toEqual(expectedData);
      });
  });
});

describe('getMarkdownFiles', () => {
  it('Debe devolver un arreglo con las rutas encontradas', () => {
    const filePath = 'tests';
    const expectedData = ["C:\\Users\\Rau\\Documents\\DEV009-md-links\\tests\\readme2.md"];

    return getMarkdownFiles(filePath)
      .then((data) => {
        expect(data).toEqual(expectedData);
      });
  });
}); 
