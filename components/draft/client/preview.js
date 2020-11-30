(() => {
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
    $.ajax({
      type: 'POST',
      data: {
        _csrf: csrf,
        screenshot: canvasData
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
