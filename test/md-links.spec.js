const { mdLinks } = require('../index.js');
const { isMarkdownFile } = require('../index.js');
const { readingFile } = require('../index.js');


describe('mdLinks', () => {
  it('should...', () => {
    console.log('FIX ME!');
  });
  it('Debe rechazar cuando el path no exista', () => {
    return mdLinks('/Rau/documents/notfound.md').catch((error) => {
      expect(error).toBe("The route doesnt exist");
    });
  });
});

describe('isMarkdownfile', () => {
    it('Debe devolver true si el path tiene un documento .md', () => {
      const filePath = 'example.md';
      const result = isMarkdownFile(filePath);
      expect(result).toBe(true);
    });
    it('Debe devolver false si el path tiene un documento .md', () => {
      const filePath = 'example.txt';
      const result = isMarkdownFile(filePath);
      expect(result).toBe(false);
    });
  });

  describe('readingFile', () => {
    it('Debe leer el contenido del archivo cuando se le de un path valido', () => {
      const filePath = 'validFilePath.md';
      const expectedData = 'This is the file content';

      return readingFile(filePath)
        .then((data) => {
          expect(data).toEqual(expectedData);
        });
    });
  });
 
 
