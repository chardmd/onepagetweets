(() => {
  //https://stackoverflow.com/questions/22329481/compressing-base64-data-uri-images
  const U16to8 = (data) => {
    var out = '';
    for (var i = 0; i < data.length; i++) {
      var charCode = data.charCodeAt(i);
      out += String.fromCharCode(~~(charCode / 256));
      out += String.fromCharCode(charCode % 256);
    }
    return out;
  };

  const disableLoading = () => {
    $('#spinner').addClass('d-none');
    $('#btnPublish').attr('disabled', false);
    $('#btnPublish .text').text('Publish Tweet');
  };

  const enableLoading = () => {
    $('#spinner').removeClass('d-none');
    $('#btnPublish').attr('disabled', true);
    $('#btnPublish .text').text('Publishing...');
  };

  const capture = async () => {
    const imageCanvas = $('#capture').get(0);
    const canvas = await html2canvas(imageCanvas);
    const base64Canvas = canvas.toDataURL('image/jpeg').split(';base64,')[1];
    await uploadToServer(base64Canvas);
  };

  const uploadToServer = async (canvasData) => {
    const csrf = $('#csrf').val();
    let compressed = LZString.compress(canvasData);
    compressed = U16to8(compressed);
    $.ajax({
      type: 'POST',
      data: {
        _csrf: csrf,
        compressed
      },
      url: `/draft/publish`,
      beforeSend() {
        enableLoading();
      },
      success() {
        $('#confirmDialog').modal('hide');
        capture();
      },
      complete() {
        Turbolinks.visit(`/draft/success`);
      },
      error() {
        Turbolinks.visit(`/draft/preview`);
      }
    });
  };

  //init and events
  $(() => {
    disableLoading();

    $('#btnPublish').on('click', () => {
      capture();
    });

    $('#btnConfirm').on('click', () => {
      $('#confirmDialog').modal('show');
    });
  });
})();
