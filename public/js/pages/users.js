(() => {
  const deleteUser = (id) => {
    const isDeleted = confirm('Do you want to delete this user?');
    if (isDeleted) {
      const csrf = $('#csrf').val();
      $.ajax({
        type: 'DELETE',
        data: {
          _csrf: csrf
        },
        url: `/admin/users/${id}`,
        success: function () {
          Turbolinks.visit(`/admin/users`);
        },
        error: function () {
          Turbolinks.visit(`/admin/users`);
        }
      });
    }
  };

  //init and events
  $(() => {
    $('#btnDeleteUser').on('click', () => {
      const userId = $('#userId').val();
      deleteUser(userId);
    });
  });
})();
