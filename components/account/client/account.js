(() => {
  const cancelSubscription = () => {
    const isDeleted = confirm('Do you want to cancel your subscription?');
    if (isDeleted) {
      const csrf = $('#csrf').val();
      $.ajax({
        type: 'PUT',
        data: {
          _csrf: csrf
        },
        url: `/account/cancel`
      });
    }
  };
  const deleteAccount = () => {
    const isDeleted = confirm('Do you want to delete this account?');
    if (isDeleted) {
      const csrf = $('#csrf').val();
      $.ajax({
        type: 'POST',
        data: {
          _csrf: csrf
        },
        url: `/account/delete`
      });
    }
  };
  //init and events
  $(() => {
    $('#btnCancelSubscription').on('click', () => {
      cancelSubscription();
    });
    $('#btnDeleteAccount').on('click', () => {
      deleteAccount();
    });
  });
})();
