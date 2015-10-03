var captcha_code;
var info = {};

$(function() {
  captcha_img = $('#BookingS1Form_homeCaptcha_passCode').attr('src')
  chrome.runtime.sendMessage({method:'pageAction_show'});
  chrome.runtime.sendMessage({method:'setData', data: {captcha_img: captcha_img}});

  chrome.runtime.sendMessage({method: 'getInfo'},function(response){
    if (response) info = response;
  });

  chrome.extension.onMessage.addListener(function(message,sender,sendResponse){
    switch(message.method) {
    case 'start':
      captcha_code = message.captcha_code;
      step_1();
      break;
    }
  });

  check_status();
  function check_status() {
    console.log(localStorage['THSR_status'], localStorage['step'])
    if (localStorage['THSR_status'] == 'start') {
      switch(localStorage['step']) {
      case '2':
        step_2();
        break;
      case '3':
        step_3();
        break;
      default:
        localStorage['THSR_status'] = 'stop';
        localStorage['step'] = 1;
      }
    }
  }

  function step_1() {
    console.log(' -- step 1 --')
    $('select[name="selectStartStation"]').val(info.station.selectStartStation);
    $('select[name="selectDestinationStation"]').val(info.station.selectDestinationStation);
    $('#toTimeInputField').val(info.station.date);
    $('select[name="toTimeTable"]').val(get_start_time_code(info.station.start_time));
    $('input[name="homeCaptcha:securityCode"]').val(captcha_code);

    localStorage['THSR_status'] = 'start';
    localStorage['step'] = 2;

    $('#SubmitButton').trigger('click');
  }

  function step_2() {
    console.log(' -- step 2 --')
  }

  function step_3() {
    console.log(' -- step 3 --')
  }

  function get_start_time_code(start_time) {
    info_start_time = start_time.split(':');
    if (info_start_time[0] == 12) {
      start_time_code = info_start_time[0] + info_start_time[1] + 'N'
    } else if (info_start_time[0] / 12 > 1) {
      start_time_code = (parseInt(info_start_time[0]) - 12) + info_start_time[1] + 'P'
    } else {
      start_time_code = parseInt(info_start_time[0]) + info_start_time[1] + 'A'
    }
    return start_time_code;
  }
});

