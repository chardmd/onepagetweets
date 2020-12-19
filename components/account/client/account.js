(() => {
  const deleteAccount = () => {
    const isDeleted = confirm('Do you want to delete this account?');
    if (isDeleted) {
      const csrf = $('#csrf').val();
      $.ajax({
        type: 'DELETE',
        data: {
          _csrf: csrf
        },
        url: `/account/delete`
      });
    }
  };
  //init and events
  $(() => {
    $('#btnDeleteAccount').on('click', () => {
      deleteAccount();
    });
  });
})();
