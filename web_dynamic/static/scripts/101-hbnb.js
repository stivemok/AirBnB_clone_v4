$(document).ready(function () {
  let statesObj = {};
  let amenitiesObj = {};

  function handleStateCheck() {
    if (this.checked) {
      statesObj[$(this).data('id')] = ' ' + $(this).data('name');
      let cities = $(this).parent().next('ul').find('.cities_li input:checkbox');
      cities.each((idx, ele) => {
        ele.checked = true;
        if (statesObj[$(ele).data('id')]) {
          delete statesObj[$(ele).data('id')];
        }
      });
    } else {
      let cities = $(this).parent().next('ul').find('.cities_li input:checkbox');
      cities.each((idx, ele) => {
        if (ele.checked) {
          statesObj[$(ele).data('id')] = ' ' + $(ele).data('name');
        }
      });
      delete statesObj[$(this).data('id')];
    }
    $('DIV.locations h4').text(Object.values(statesObj));
  }

  function handleCityCheck() {
    if (this.checked) {
      let boxie = $(this).parent().parent().find('.cities_li input:checkbox').length;
      let checked = $(this).parent().parent().find('.cities_li input:checked').length;
      if (boxie === checked) {
        let stateCheck = $(this).parent().parent().parent().find('.states_h2 input:checkbox')[0];
        stateCheck.checked = true;
        $(stateCheck).trigger('change');
      } else {
        statesObj[$(this).data('id')] = ' ' + $(this).data('name');
      }
    } else {
      let stateCheck = $(this).parent().parent().parent().find('.states_h2 input:checkbox')[0];
      if (stateCheck.checked) {
        stateCheck.checked = false;
        $(stateCheck).trigger('change');
      }
      delete statesObj[$(this).data('id')];
    }
    $('DIV.locations h4').text(Object.values(statesObj));
  }

  function handleAmenitiesCheck() {
    if (this.checked) {
      amenitiesObj[$(this).data('id')] = ' ' + $(this).data('name');
    } else {
      delete amenitiesObj[$(this).data('id')];
    }
    $('DIV.amenities h4').text(Object.values(amenitiesObj));
  }

  function placeSearch(postdata) {
    $('.places_articles').remove();
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      method: 'POST',
      dataType: 'json',
      contentType: 'application/JSON',
      data: JSON.stringify(postdata),
      success: function (data) {
        $.each(data, function (k, v) {
          $(`<article class='places_articles'>
          <div class="title">
          <h2>${v.name}</h2>
          <div class="price_by_night">
          ${v.price_by_night}
          </div>
          </div>
          <div class="information">
          <div class="max_guest">
          <i class = "fa fa-users fa-3x" aria - hidden = "true"></i>
          <br />
          ${v.max_guest} Guests
          </div>
          <div class="number_rooms">
          <i class="fa fa-bed fa-3x" aria - hidden = "true" > </i>
          <br />
          ${v.number_rooms} Bedrooms
          </div>
          <div class="number_bathrooms">
          <i class="fa fa-bath fa-3x" aria - hidden = "true"></i>
          <br />
          ${v.number_bathrooms} Bathroom
          </div>
          </div>
          <div class="user">
          <strong> Owner: ${v.user.first_name} ${v.user.last_name}</strong>
          </div>
          <div class="description">
          ${v.description}
          </div>
          <div class="reviews">
            <h2 class=review_heading>Reviews</h2>
        <span class="review_toggle" data-id = "${v.id}">
        SHOW </span>
            <ul id="${v.id}">
            <li>
                <h3></h3>
                <p></p>
            </li>
            </ul>
          </div>
          </article>`).appendTo('.places');
        });
        $('.review_toggle').click(function () {
          // console.log(this);
          let ulid = this.dataset.id;
          let url = 'http://0.0.0.0:5001/api/v1/places/' + ulid + '/reviews';
          $.get(url, function (data) {
            console.log(data);
            data.forEach(function (review) {
              // console.log(item);
              /* TODO: 
               * Need to get users.first_name and users.last_name
               * and place it under reviews in flask
               */
              $(`
                <li>
                <h3>${review.user.first_name} ${review.user.last_name}</h3>
                <p>${review.text}</p> 
                </li> `).appendTo('#' + ulid);
              // console.log($(this).find('.reviews'));
            });
          });
        });
      }
    });
  }

  function handleSearchClick(el) {
    let res = {};
    let amenities = [];
    let cities = [];
    $('.amenities li input').each((idx, elem) => {
      if (elem.checked) {
        amenities.push(elem.dataset.id);
      }
      res['amenities'] = amenities;
      if (amenities.length) {}
    });

    $('.cities_li input').each((idx, elem) => {
      if (elem.checked) {
        cities.push(elem.dataset.id);
      }
      res['cities'] = cities;
    });
    placeSearch(res);
  }

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  placeSearch({});
  $('.states_h2 input:checkbox').change(handleStateCheck);
  $('.cities_li input:checkbox').change(handleCityCheck);
  $('.amenities input:checkbox').change(handleAmenitiesCheck);
  $('#search_btn').click(handleSearchClick);
});
