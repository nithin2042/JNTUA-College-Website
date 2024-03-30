function openPopup() {
    var popup = document.getElementById('popup');
    var overlay = document.getElementById('overlay');
    popup.style.display = 'block';
    overlay.style.display = 'block';
}

function closePopup() {
    var popup = document.getElementById('popup');
    var overlay = document.getElementById('overlay');
    popup.style.display = 'none';
    overlay.style.display = 'none';
}
function openPopup1() {
    var popup = document.getElementById('inner-single-popup');
    var overlay = document.getElementById('overlay');
    document.getElementById('popup').style.display = 'none';
    popup.style.display = 'block';
    overlay.style.display = 'block';
}

function closePopup1() {
    var popup = document.getElementById('inner-single-popup');
    var overlay = document.getElementById('overlay');
    popup.style.display = 'none';
    overlay.style.display = 'none';
}
function openPopup2() {
    var popup = document.getElementById('inner-bulk-popup');
    var overlay = document.getElementById('overlay');
    document.getElementById('popup').style.display = 'none';
    popup.style.display = 'block';
    overlay.style.display = 'block';
}

function closePopup2() {
    var popup = document.getElementById('inner-bulk-popup');
    var overlay = document.getElementById('overlay');
    popup.style.display = 'none';
    overlay.style.display = 'none';
}
function openPopup5() {
    var popup = document.getElementById('inner-bulk-popup2');
    var overlay = document.getElementById('overlay');
    document.getElementById('popup').style.display = 'none';
    popup.style.display = 'block';
    overlay.style.display = 'block';
}

function closePopup5() {
    var popup = document.getElementById('inner-bulk-popup2');
    var overlay = document.getElementById('overlay');
    popup.style.display = 'none';
    overlay.style.display = 'none';
}
function setSelectOptionFromVariable(variableValue, id) {
    var selectElement = document.getElementById(id);
    for (var i = 0; i < selectElement.options.length; i++) {
      var option = selectElement.options[i];
      if (option.value === variableValue) {
        option.selected = true;
        break;
      }
    }
  }
