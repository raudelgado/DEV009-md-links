const { mdLinks } = require('../index.js');
const { isMarkdownFile, readingFile, validatedLinks, getMarkdownFiles } = require('../function.js');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

jest.mock('axios');

describe('mdLinks', () => {

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
  it('Debe retornar un array de objetos con ciertas propiedades si el archivo es md y la validación es false', () => {
    const dirFilePath = 'tests/readme2.md';
    const validate = false;

    return mdLinks(dirFilePath, validate)
      .then((result) => {
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0); // toBeGreatherThan me sirve para evaluar contra el result.length, debe ser mayor a la comparación

        // Verificar que cada objeto en el array tenga las propiedades necesarias
        result.forEach((link) => {
          expect(link).toHaveProperty('href');
          expect(link).toHaveProperty('text');
          expect(link).toHaveProperty('file');
        });
      });
  });
  it('Debe retornar un error cuando falle el leer un archivo', () => {
    const dirFilePath = 'valid/markdown/file.md';
    const validate = false;

    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('The route does not exist');
    });

    return expect(mdLinks(dirFilePath, validate)).rejects.toMatch('The route does not exist');
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
        file: 'tests/readme2.md'
      },
      {
        href: 'https://www.drupal.org/project/panels',
        text: 'Panels',
        file: 'tests/readme2.md'
      },
      {
        href: 'https://www.wetransfer.org/project/panels',
        text: 'weTransfer',
        file: 'tests/readme2.md'
      }
    ];

    return readingFile(filePath)
      .then((data) => {
        expect(data).toEqual(expectedData);
      });
  });
});

describe('validatedLinks', () => {
  it('Debe retornar ok para los links validos con status por más de 200', () => {
    const links = [
      { href: 'https://www.drupal.org/project/views', text: 'Views', file: 'tests/readme2.md' },
      { href: 'https://www.drupal.org/project/panels', text: 'Panels', file: 'tests/readme2.md' },
    ];

    // Mock de axios.get para resolver con un estado 200 (como si son enlaces validos)
    axios.get.mockResolvedValue({ status: 200 });

    return validatedLinks(links)
      .then((result) => {
        // Verifica que result sea un array
        expect(Array.isArray(result)).toBe(true);

        // Verifica que todos los objetos tengan un estado 'ok' (representando enlaces válidos)
        result.forEach((link) => {
          expect(link.valid).toBe('ok');
        });
      });
  });
  it('Debe retornar Unable to make request para los links validos con status por más de 200', () => {
    const links = [
      { href: 'https://www.drupal.org/project/views', text: 'Views', file: 'tests/readme2.md' },
      { href: 'https://www.drupal.org/project/panels', text: 'Panels', file: 'tests/readme2.md' },
      { href: 'https://www.wetransfer.org/project/panels', text: 'weTransfer', file: 'tests/readme2.md' },
    ];

    // Mock de axios.get para resolver con un estado 200 (como si son enlaces validos)
    axios.get.mockRejectedValue({ status: 404});

    return validatedLinks(links)
      .then((result) => {
        // Verifica que result sea un array
        expect(Array.isArray(result)).toBe(true);

        // Verifica si hay un link por más de 400
        result.forEach((link) => {
          expect(link.valid).toBe('fail');
        });
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
    it('debería resolver con una lista de archivos .md si el directorio existe', () => {
      const existingDirectory = 'C:\\Users\\Rau\\Documents\\DEV009-md-links\\tests\\';
    
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    
      const mdFiles = ['readme2.md'];
      jest.spyOn(fs, 'readdirSync').mockReturnValue(mdFiles);
    
      const expectedFilePaths = mdFiles.map((file) => path.join(existingDirectory, file));
    
      return expect(getMarkdownFiles(existingDirectory)).resolves.toEqual(expectedFilePaths);
    });
  
    it('debería rechazar con un mensaje de error si el directorio no existe', () => {
      const nonExistentDirectory = 'ruta/del/directorio/inexistente';

      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
  
      return expect(getMarkdownFiles(nonExistentDirectory)).rejects.toMatch('The directory does not exist');
    });
  });