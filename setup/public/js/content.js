


//Create category -------------------------------------------------------


const catName = document.getElementById('catName');

const catBtn = document.getElementById('catBtn');

const catWrap = document.getElementById('catWrap');

catName.addEventListener('click', createNewCat)

catBtn.addEventListener('click', createNewCat)



function createNewCat(e) {
  if (e.target.id == 'catBtn' && e.target.innerHTML == 'Save') {
    post(catNameValue.value, '/content/createcat')
    spanReset(e)
  } else {
    spanSwitch(e)
  }
}



function spanSwitch(e) {
  let txt = e.innerText;
  catName.innerHTML = `<input id="catNameValue" value='' />`;
  catBtn.innerHTML = 'Save'
  document.getElementsByTagName('input')[0].focus();
}

function spanReset(e) {
  let txt = 'Create new category';



  catName.innerHTML = `<span id="catName"> ${txt} </span>`;
  catBtn.innerHTML = 'Create'
}




// Create box -----------------------------------------------------------


let boxname = document.getElementById('boxname')
let boxnamebtn = document.getElementById('boxnamebtn')

if (boxnamebtn) {
  boxnamebtn.addEventListener('click', createNewBox)
}




function createNewBox() {
  console.log(boxname.parentElement.parentElement);

  let data = {
    id: boxname.parentElement.parentElement.id,
    value: boxname.value
  }

  post(data, '/content/createbox')
}


// Box ------------------------------------------------------------------

function displaycta(e) {

  console.log(e.parentElement);


  for (var i = 0; i < e.parentElement.childNodes.length; i++) {
      if (e.parentElement.childNodes[i].className == "cta") {

        if ( e.checked == true) {
          e.parentElement.childNodes[i].style.display = 'block'
        } else {
            e.parentElement.childNodes[i].style.display = 'none'
        }
      }
  }



}



//Drag and drop ---------------------------------------------------------

function drag() {
  const draggables = document.querySelectorAll('.draggable')
  const containers = document.querySelectorAll('.container')

  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
      draggable.classList.add('dragging')
    })

    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging')
      const catagoryNode = document.querySelectorAll('.draggable')
      const categorys = Array.from(catagoryNode)

      let catId = [];

      categorys.forEach(category => {
        catId.push(category.id)

      });
      //console.log(catId);

      post(catId, '/content/updatecatpos')


    })
  });


  containers.forEach(container => {
    container.addEventListener('dragover', e => {
      e.preventDefault()
      const afterElement = getDragAfterElement(container, e.clientY)
      const draggable = document.querySelector('.dragging')
      if (afterElement == null) {
        container.appendChild(draggable)
      } else {
        container.insertBefore(draggable, afterElement)
      }

    })
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect()
    const offset = y - box.top - box.height / 2
    if (offset < 0 && offset > closest.offset) {
      return { offset : offset, element : child}
    } else {
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
}

 drag()












// Get & Post ---------------------------------------------------------
function get(url) {
  fetch('/content/company', {method: 'GET',})
  .then((response) => response.json())
  .then((responseJson) => {
    //displayCats(responseJson);
  })
  }



async function post (data, URL) {

    fetch(URL, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        data: data,
      })
    }) .then(res => {
      return res.json()
    })


}
