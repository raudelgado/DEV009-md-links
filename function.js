const marked = require('marked');
const { JSDOM }= require('jsdom');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
/* const { error } = require('console');
const { rejects } = require('assert'); */

function isMarkdownFile(filePath) { // pasar a function
    return path.extname(filePath) === '.md';
  }


  function readingFile(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) reject(err);
        const markedLexer = marked.lexer(data);
        //console.log('markedlexer', marked.parser(markedLexer));
        const htmlContent = marked.parser(markedLexer);
        const result = getLinks(htmlContent);
        result.forEach((item) => (item.file = filePath));
  
        resolve( result );
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


  const validatedLinks = (data) => {
    const validatePromises = data.map((link) => {
      return axios.get(link.href) // Realiza una solicitud HEAD para verificar el enlace
        .then((response) => {
          if (response.status >= 200 && response.status < 400) {
            return {
              href: link.href,
              text: link.text,
              file: link.file,
              status: response.status,
              valid: 'ok',
            };
          } else {
            return {
              href: link.href,
              text: link.text,
              file: link.file,
              status: response.status,
              valid: 'fail',
            };
          }
          //console.log(link);
        })
        .catch((error) => {
          //link.status = error.status;
          //link.valid = 'fail'; // Marca el enlace como no válido en caso de error
          //console.log(link);
          //console.error(error); // Puedo imprimir el error para depuración
          return {
            href: link.href,
            text: link.text,
            file: link.file,
            status: error.response ? error.response.status : 'Unable to make request',
            valid: 'fail',
          };
        });
  });
  return Promise.all(validatePromises);  
}

function getMarkdownFiles(directoryPath) {
  return new Promise((resolve, reject) => {
    const absoluteDirectoryPath = path.resolve(directoryPath);

    if (!fs.existsSync(absoluteDirectoryPath)) {
      reject('The directory does not exist');
      return;
    }

    fs.readdir(absoluteDirectoryPath, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      const mdFiles = files.filter((file) => path.extname(file) === '.md');
      const mdFilePaths = mdFiles.map((mdFile) => path.join(absoluteDirectoryPath, mdFile));
      resolve(mdFilePaths);
    });
  });
}

  module.exports = {
    isMarkdownFile, 
    readingFile, 
    validatedLinks,
    getMarkdownFiles
  };
  