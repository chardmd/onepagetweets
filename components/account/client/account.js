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
  //init and events
  $(() => {
    $('#btnCancelSubscription').on('click', () => {
      cancelSubscription();
    });
  });
})();
