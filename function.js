const marked = require('marked');
const { JSDOM }= require('jsdom');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

// Verifica si el archivo es .md
function isMarkdownFile(filePath) { // pasar a function
    return path.extname(filePath) === '.md';
  }

 // Lee el archivo y extrae con marked lexer
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
  
  // retorna los links con el jsdom y el html content
  function getLinks(htmlContent) {
      const dom = new JSDOM(htmlContent);
      const document = dom.window.document;
      const anchorElements = document.querySelectorAll('a');
      const links = []; // se guarda en un array vació
      anchorElements.forEach((element) => {
        const href = element.href;
        const text = element.textContent;
        links.push({ href, text });
      });
    
      return links;
  }

  // Aquí valido si mis links son true (then / if) or false catch
   const validatedLinks = (data) => {
    const validatePromises = data.map((link) => {
      return axios.get(link.href)  // Realiza una solicitud HEAD para verificar el enlace
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
        })
        .catch((error) => {

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

// función para leer los directorios
function getMarkdownFiles(directoryPath) {
  return new Promise((resolve, reject) => {
    const absoluteDirectoryPath = path.resolve(directoryPath);
    const directory = fs.readdirSync(directoryPath);
    if (!fs.existsSync(absoluteDirectoryPath)) {
      reject('The directory does not exist');
      return;
    }
    const mdFiles = directory.filter((file) => path.extname(file) === '.md');
    const mdFilePaths = mdFiles.map((mdFile) => path.join(absoluteDirectoryPath, mdFile));
    console.log(mdFilePaths, 'array');
    resolve(mdFilePaths);
  })
}


  module.exports = {
    isMarkdownFile, 
    readingFile, 
    validatedLinks,
    getMarkdownFiles
  };
  