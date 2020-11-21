(() => {
  const disableLoading = () => {
    $('#spinner').addClass('d-none');
    $('#btnPublish').attr('disabled', false);
    $('#btnPublish .text').text('Publish');
  };

  const enableLoading = () => {
    $('#spinner').removeClass('d-none');
    $('#btnPublish').attr('disabled', true);
    $('#btnPublish .text').text('Publishing...');
  };

  const capture = async () => {
    const imageCanvas = $('#capture').get(0);
    const canvas = await html2canvas(imageCanvas);
    var dataURL = canvas.toDataURL();
    console.log('------------------------------------');
    console.log(dataURL);
    console.log('------------------------------------');
  };

  //init and events
  $(() => {
    disableLoading();

    $('#btnPublish').click(() => {
      const csrf = $('#csrf').val();
      $.ajax({
        type: 'PATCH',
        data: {
          _csrf: csrf
        },
        url: `/post/publish`,
        beforeSend() {
          enableLoading();
        },
        success() {
          $('#confirmDialog').modal('hide');
          capture();
          //Turbolinks.visit(`/post/success`);
        },
        error() {
          Turbolinks.visit(`/post/preview`);
        }
      });
    });

    $('#btnConfirm').on('click', () => {
      $('#confirmDialog').modal('show');
    });
  });
})();
