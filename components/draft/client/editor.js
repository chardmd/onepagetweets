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

  const submitForm = (content, bgColor) => {
    const csrf = $('#csrf').val();
    $.ajax({
      type: 'POST',
      url: '/draft/editor',
      data: {
        _csrf: csrf,
        content,
        bgColor
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

  const deleteDraft = () => {
    const isDeleted = confirm('Do you want to delete this draft?');
    if (isDeleted) {
      const csrf = $('#csrf').val();
      $.ajax({
        type: 'DELETE',
        data: {
          _csrf: csrf
        },
        url: `/draft/delete`,
        success: function () {
          Turbolinks.visit(`/draft/editor`);
        },
        error: function () {
          Turbolinks.visit(`/draft/editor`);
        }
      });
    }
  };

  const setButtonActive = (text) => {
    let empty = text.trim().length == 0;
    if (empty) {
      $('#buttonNext').attr('disabled', true);
    } else {
      $('#buttonNext').attr('disabled', false);
    }
  };

  //init and events
  $(() => {
    const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ align: '' }],
      [{ align: 'center' }],
      [{ align: 'right' }],
      [{ align: 'justify' }],
      [{ font: [] }]
    ];
    const editor = new Quill('#editor', {
      modules: {
        toolbar: toolbarOptions
      },
      placeholder: 'Compose a tweet...',
      theme: 'snow'
    });

    const text = editor.getText();
    setButtonActive(text);

    //on input press
    $('#editor').on('keyup', () => {
      const text = editor.getText();
      setButtonActive(text);
    });

    //submit form
    $('#buttonNext').on('click', (e) => {
      const content = editor.root.innerHTML;
      let bgColor;
      let style = $('.ql-editor').attr('style');
      if (style) {
        bgColor = style
          .split(';')
          .filter((item) => item.startsWith('background-color'))[0]
          .split(':')[1]
          .trim();
      }
      submitForm(content, bgColor);
    });

    $('#discardButton').on('click', () => {
      deleteDraft();
    });

    $('.color-picker').on('click', 'div', function () {
      const bgColor = $(this).attr('data-col');
      $('.ql-editor').css('background-color', bgColor);
    });
  });
})();
