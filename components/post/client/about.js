(() => {
  const disabledLoading = () => {
    $('#spinner').addClass('d-none');
    $('#buttonNext').attr('disabled', false);
    $('#buttonNext .text').text('Next');
  };

  const enableLoading = () => {
    $('#spinner').removeClass('d-none');
    $('#buttonNext').attr('disabled', true);
    $('#buttonNext .text').text('Saving...');
  };

  const submitForm = () => {
    $.ajax({
      type: 'POST',
      url: '/post/about',
      data: $('#aboutForm').serialize(),
      beforeSend() {
        enableLoading();
      },
      success() {
        disabledLoading();
        Turbolinks.visit(`/post/preview`);
      },
      error(err) {
        console.log(err);
        Turbolinks.visit(`/post/about`);
      }
    });
  };

  const setButtonActive = text => {
    let empty = text.length == 0;
    if (empty) {
      $('#buttonNext').attr('disabled', true);
    } else {
      $('#buttonNext').attr('disabled', false);
    }
  };

  //init and events
  $(() => {
    tinymce.remove();
    tinymce.init({
      selector: '#summary',
      branding: false,
      resize: false,
      height: 400
    });

    //on input press
    $('#summary').on('keyup', () => {
      let text = $('#summary').val();
      setButtonActive(text);
    });

    //submit form
    $('#aboutForm').on('submit', e => {
      e.preventDefault();
      submitForm();
    });
  });
})();
