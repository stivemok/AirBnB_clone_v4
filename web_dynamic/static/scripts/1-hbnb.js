$('document').ready(function () {
  const amenityID = {};

  $('input[type="checkbox"]').change(function () {
    if ($(this).prop('checked') === true) {
      amenityID[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenityID[$(this).attr('data-id')];
    }
    $('.amenities h4').text(Object.values(amenityID).join(', '));
    console.log(amenityID);
  });
});
