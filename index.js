const fs = require('fs');
const path = require('path');
const {isMarkdownFile, readingFile, validatedLinks, getMarkdownFiles } = require('./function.js');

const mdLinks = (dirFilePath, validate) => {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(dirFilePath); //convierte la ruta a absoluta
    if (!fs.existsSync(absolutePath)) {
      reject('The route does not exist');
      return;
    } 
    if (fs.statSync(absolutePath).isFile()) {
      if (!isMarkdownFile(absolutePath)) {
        reject('Is not a md document');
        return;
      }   
        readingFile(absolutePath)
      .then(data => {
        if (validate === true) { //enviar a function como function individual 
             validatedLinks(data)
              .then(promises => resolve(promises))
        } else {
          resolve(data);
        }
      })
      .catch((error) => {
        reject(error);
      });
    } else if (fs.statSync(absolutePath).isDirectory()) {
      // Si es un directorio, procesa todos los archivos .md en ese directorio
      getMarkdownFiles(absolutePath)
        .then((mdFiles) => {
          const promises = mdFiles.map((filePath) => {
            return readingFile(filePath)
              .then((data) => {
                if (validate) {
                  return validatedLinks(data);
                } else {
                  return data;
                }
              })
              .catch((error) => {
                return {
                  file: filePath,
                  error: error.message || 'Unknown error',
                };
              });
          });

          Promise.all(promises)
            .then((results) => {
              resolve(results.flat());
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    } else {
      reject('Invalid path');
    }
  });
};

module.exports = {
  mdLinks
}