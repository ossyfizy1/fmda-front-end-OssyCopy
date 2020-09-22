class ResHandlers {
  static resRedirect(res, path) {
    res.send(`<script> window.location.href='${path}'; </script>`);
  }

  static resRedirectBack(res) {
    res.send('<script> location.replace(document.referrer); </script>');
  }

  static resRender(res, path) {
    res.send(`<script> window.location.href='${path}'; </script>`);
  }

  static resError(res, error) {
    res.send(`Error Message, APIs Service Down: ${error.message}`);
  }

  static resPopupRedirect(res, message, path) {
    res.send(`
        <script> 
          alert('${message}');
          window.location.href='${path}';
        </script>`);
  }
}

export default ResHandlers;
