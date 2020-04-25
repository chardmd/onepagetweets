/* eslint-disable */

function copiedButton() {
  $('#btnCopy').removeClass('btn-primary');
  $('#btnCopy').addClass('btn-success');
  $('.fa-check-circle').removeClass('d-none');
  $('#btnCopy .text').text('Copied');
}

function initClipboard() {
  new ClipboardJS('#btnCopy');
}

$(function() {

  //clipboard copy
  initClipboard();

  $('#btnCopy').click(function() {
    copiedButton();
  })

});
