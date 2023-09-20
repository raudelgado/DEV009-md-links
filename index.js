const fs = require('fs');
const path = require('path');
const marked = require('marked');
const {isMarkdownFile } = require('./function.js');
const { JSDOM }= require('jsdom');
const axios = require('axios');

function readingFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) reject(err);
      const markedLexer = marked.lexer(data);
      //console.log('markedlexer', marked.parser(markedLexer));
      const htmlContent = marked.parser(markedLexer);
      const result = getLinks(dom);
      result.forEach((item) => (item.file = filePath));

      resolve({ links: result, htmlContent: htmlContent });
    });
  });
};

function getLinks(htmlContent) {
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    const anchorElements = document.querySelectorAll('a');
    const links = [];
    anchorElements.forEach((element) => {
      const href = element.href;
      const text = element.textContent;
      links.push({ href, text });
    });
  
    return links;
}

const mdLinks = (filePath, validate) => {
  return new Promise((resolve, reject) => {
    const absolutePath = path.resolve(filePath); //convierte la ruta a absoluta
    if (!fs.existsSync(absolutePath)) {
      reject('The route doesnt exist');
    } else if (!path.isAbsolute(absolutePath)) {
      reject('The provided path is not an absolute path');
    } else if (!isMarkdownFile(absolutePath)) {
      reject('Is not a md document');
    } else {
      readingFile(absolutePath)
        .then(data => {
          // Procesar el contenido del archivo Markdown utilizando markdown-parser

          if (validate) {
            const validatePromises = links.map((link) => {
    
              return axios.head(link.href) // Realiza una solicitud HEAD para verificar el enlace
                .then((response) => {
                  if (response.status >= 200 && response.status < 400) {
                    link.valid = true; // Marca el enlace como válido
                  } else {
                    link.valid = false; // Marca el enlace como no válido
                  }
                  return link;
                })
                .catch((error) => {
                  link.valid = false; // Marca el enlace como no válido en caso de error
                  return link;
                });
            });

            Promise.all(validatePromises)
              .then((validatedLinks) => {
                resolve(validatedLinks);
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            resolve(links);
          }
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};


module.exports = {
  mdLinks,
  isMarkdownFile,
  readingFile
};
