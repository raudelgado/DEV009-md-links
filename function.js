function isMarkdownFile(filePath) { // pasar a function
    return path.extname(filePath) === '.md';
  }


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


  module.exports = {
    isMarkdownFile
  };
  