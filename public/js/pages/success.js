(() => {
  const copyButton = () => {
    $('#btnCopy').removeClass('btn-primary');
    $('#btnCopy').addClass('btn-success');
    $('.fa-check-circle').removeClass('d-none');
    $('#btnCopy .text').text('Copied');
  };

  //init and events
  $(() => {
    //clipboard copy
    new ClipboardJS('#btnCopy');

    $('#btnCopy').click(function () {
      copyButton();
    });
  });
})();
