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

  const submitForm = (content) => {
    const csrf = $('#csrf').val();
    $.ajax({
      type: 'POST',
      url: '/draft/editor',
      data: {
        _csrf: csrf,
        content: content
      },
      beforeSend() {
        enableLoading();
      },
      success() {
        disabledLoading();
        Turbolinks.visit(`/draft/preview`);
      },
      error(err) {
        console.log(err);
        Turbolinks.visit(`/draft/editor`);
      }
    });
  };

  const setButtonActive = (text) => {
    let empty = text.length == 0;
    if (empty) {
      $('#buttonNext').attr('disabled', true);
    } else {
      $('#buttonNext').attr('disabled', false);
    }
  };

  //init and events
  $(() => {
    const editor = new Quill('#editor', {
      theme: 'snow'
    });

    //on input press
    $('#editor').on('keyup', () => {
      setButtonActive(editor.root.innerHTML);
    });

    //submit form
    $('#editorForm').on('submit', (e) => {
      e.preventDefault();
      submitForm(editor.root.innerHTML);
    });
  });
})();
