var $window = $(window);
var $year = $('#js-year');
var $month = $('#js-month');
var $tbody = $('#js-calendar-body');
var $week = $('#js-week');
var $dayList = ['月','火','水','木','金','土','日'];

var today = new Date();
var currentYear = today.getFullYear(),
    currentMonth = today.getMonth() + 1,
    currentDate = today.getDate(),
    currentDay = today.getDay();

var viewYear = today.getFullYear(),
    viewMonth = today.getMonth() + 1,
    viewDate = today.getDate(),
    viewDay = today.getDay();

var $buttonGreen = "#036351";
var $buttonRed = "#A01A1A";
var $buttonyellow = "#D6D245";

var nameList = [];

$window.on('load',function(){
  nameHolder();
  $('.modal').modaal();
  firstView();
  calendarHeading(viewYear, viewMonth, viewDate);
  // calendarBody(viewYear, viewMonth, today);
});

function nameHolder(){
  for(var i=0; i<44; i++){
      var name = $('.koma-main td').eq(i).text();
      nameList.push(name);
  }
}

function firstView(){
  if(viewDay == 0){
    viewDay += 6;
  }else{
    viewDay--;
  }

  viewDate -= viewDay;
  viewDay = 0;
}

function calendarHeading(year, month, date){
  $year.text(year);
  $month.text(month);
  $week.html('');
  $week.append('<div class="top-left"></div>');

  var date = Number(date);
  var endDate = new Date(viewYear, viewMonth, 0).getDate();

  for(var i=0; i<7; i++){
    if(date > endDate){
      date -= endDate;
    }
    $week.append('<div><p>' + date + '</p><p>(' + $dayList[i] + ')</p></div>');
    date++;
  }
}


function pre_week(){
  viewDate -= 7;
}

function next_week(){
  viewDate += 7;
}

$('.week-button').on('click', function() {
  checkStartDate();
  calendarHeading(viewYear, viewMonth, viewDate);
  komacheck();
});

function checkStartDate(){

  var preEndDate = new Date(viewYear, viewMonth-1, 0).getDate();
  if(viewDate < 1){
    viewMonth--;
    viewDate += preEndDate;
  }

  var endDate = new Date(viewYear, viewMonth, 0).getDate();
  if(viewDate > endDate){
    viewMonth++;
    viewDate -= endDate;
  }

  if(viewMonth < 1){
    viewMonth = 12;
    viewYear--;
  }

  if(viewMonth > 12){
    viewMonth = 1;
    viewYear++;
  }
}




var selectedKoma,selectedKomaTd;
var $modal = $("#modal");
var index,weekNum,prename;

$('.koma-main .modal').on('click',function(){
  selectedKoma = $(this);
  selectedKomaTd = $(this).parent('td');

  index = selectedKomaTd.index('td');

  if(index <= 16){
    if(index % 2 == 0){
      indexNum = 6;
    }else{
      indexNum = 5;
    }
  }else{
    var pindex = index - 17;
    indexNum = pindex % 7;
  }

  var month = viewMonth;
  var date = viewDate + indexNum;
  var endDate = new Date(viewYear, viewMonth, 0).getDate();

  if(date > endDate){
    date -= endDate;
    month++;
  }

  $modal.html('');
  $modal.append('<div class="modal-top"><p class="date">' + month + '月' + date + '日(' + $dayList[indexNum] + ')</p><p class="bandName"></p></div>');

  var bandName = $(this).text();
  $('.bandName').html(bandName);

  if(selectedKomaTd.hasClass("aki-koma")){
    $('.bandName').html("空きコマ");
  }

  if(selectedKomaTd.hasClass("aki-koma")){
    $modal.append('<button class="in-button" onclick="komaIn()">コマに新しく入る</button><button class="move-button" onclick="komaMove()">このコマに移動する</button>');
    $modal.append('<form name="formBandName"><input class="inputBandName" name="bandName" type="text" placeholder="バンド名を入力してください"><input type="text" style="display: none;"/><button type="button" class="enter-button modaal-close" onclick="formEnter()">決定</button></form>');
  }else if(selectedKomaTd.hasClass("off-koma")){
    $modal.append('<button class="on-button modaal-close" onclick="komaOnOff()">コマをONにする</button><button class="move-button" onclick="komaMove()">このコマに移動する</button><button class="delete-button modaal-close" onclick="komaDelete()">コマを削除する</button>');
    $modal.append('<form name="formBandName"><input class="inputBandName" name="bandName" type="text" placeholder="バンド名を入力してください"><input type="text" style="display: none;"/><button type="button" class="enter-button modaal-close" onclick="formEnter()">決定</button></form>');
  }else{
    $modal.append('<button class="off-button modaal-close" onclick="komaOnOff()">コマをOFFにする</button><button class="delete-button modaal-close" onclick="komaDelete()">コマを削除する</button>');
  }
});

function komaIn(){
  selectedKomaTd.addClass("inin");
  $('.move-button').css('display','none');
  $('.inputBandName').css('display','inline-block');
  $('.enter-button').css('display','inline-block');
  $('.in-button').css('background-color','#EDEDED');
}

function formEnter(){
  var value = $('.inputBandName').val();
  selectedKoma.html(value);

  if(selectedKomaTd.hasClass("off-koma")){
    selectedKomaTd.removeClass("off-koma");
  }
  if(selectedKomaTd.hasClass("movemove")){
    selectedKomaTd.addClass("move-koma");
    selectedKomaTd.removeClass("movemove");
    removeArray();
    array.push([viewYear,viewMonth,viewDate,index,1,value]);
  }
  if(selectedKomaTd.hasClass("inin")){
    selectedKomaTd.removeClass("aki-koma");
    selectedKomaTd.removeClass("inin");
  }
}

var array = [];

function komaOnOff(){
  if(selectedKomaTd.hasClass("move-koma")){
    selectedKomaTd.removeClass("move-koma");
    removeArray();
  }
  if(selectedKomaTd.hasClass("off-koma")){
    selectedKomaTd.removeClass("off-koma");
    removeArray();
  }else{
    selectedKomaTd.addClass("off-koma");
    array.push([viewYear,viewMonth,viewDate,index,0]);
  }
}

function komaDelete(){
  if(selectedKomaTd.hasClass("off-koma")){
    selectedKomaTd.removeClass("off-koma");
  }
  if(selectedKomaTd.hasClass("move-koma")){
    selectedKomaTd.removeClass("move-koma");
  }
  selectedKoma.html('　　　');
  selectedKomaTd.addClass("aki-koma");
}

function komaMove(){
  selectedKomaTd.addClass("movemove");
  $('.delete-button').css('display','none');
  $('.in-button').css('display','none');
  $('.on-button').css('display','none');
  $('.inputBandName').css('display','inline-block');
  $('.enter-button').css('display','inline-block');
  $('.move-button').css('background-color','#EDEDED');
}


function komacheck(){
  $('.koma-main td').removeClass('off-koma');
  $('.koma-main td').removeClass('move-koma');

  for(var i=0; i<array.length; i++){
    var year = array[i][0];
    var month = array[i][1];
    var date = array[i][2];
    var index = array[i][3];
    var type = array[i][4];

    if(year == viewYear && month == viewMonth && date == viewDate){

      if(type == 0){
        $('.koma-main td').eq(index).addClass('off-koma');
      }else if(type == 1){
        $('.koma-main td').eq(index).addClass('move-koma');

        var name = array[i][5];
        $('.koma-main td:eq(' + index + ') a').html(name);
      }
    }else if(type == 1){
      $('.koma-main td:eq(' + index + ') a').html(nameList[index]);
    }
  }
}

function removeArray(){
  for(var i=0; i<array.length; i++){
    var year = array[i][0];
    var month = array[i][1];
    var date = array[i][2];
    var id = array[i][3];

    if(year == viewYear && month == viewMonth && date == viewDate && index == id){
      array.splice(i, 1);
    }
  }
}
