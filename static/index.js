window.onload = function() {
    const parentElemLeft = document.querySelector('.left');
    const parentElemRight = document.querySelector('.right');
    const input = document.querySelector('input');
    let arrLeftList = [];
    let arrRightList = [];
    let timeout;

    loadData();

    arrLeftList.forEach((book) => createElementItem(book, parentElemLeft, 'after'));
    arrRightList.forEach((book) => createElementItem(book, parentElemRight, 'before'));

    input.addEventListener('keydown', (event) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            search(event.target.value);
            parentElemLeft.innerHTML = '';
            parentElemRight.innerHTML = '';
            arrLeftList.forEach((book) => createElementItem(book, parentElemLeft, 'after'));
            arrRightList.forEach((book) => createElementItem(book, parentElemRight, 'before'));
        }, 500)
    });

    function loadJSON(file, callback) {

        const xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open('GET', file, true); // Replace 'my_data' with the path to your file
        xhr.onreadystatechange = function () {

            if (xhr.readyState == 4) {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xhr.responseText)
            }
        };
        xhr.send(null);
    }

    function loadData() {
        if (window.localStorage.getItem('leftList') === null) {
            loadJSON("./static/data.json", function(response) {
                window.localStorage.setItem('leftList', response);
                const data = JSON.parse(response);
                for (key in data) {
                    arrLeftList.push(data[key]);
                }
            });

        } else {
            getDataLocalStorage(arrLeftList, arrRightList);
        }
    }

    function getDataLocalStorage(arrLeftList, arrRightList) {
        arrLeftList.length = 0;
        arrRightList.length = 0;
        const leftList = JSON.parse(window.localStorage.getItem('leftList'));
        for (key in leftList) {
            arrLeftList.push(leftList[key]);
        }
        const rightList = JSON.parse(window.localStorage.getItem('rightList'));
        for (key in rightList) {
            arrRightList.push(rightList[key]);
        }
    }

    function search(text) {
        console.log(text);

        getDataLocalStorage(arrLeftList, arrRightList);
        arrLeftList = arrLeftList.filter(element => {
            console.log(~element.name.indexOf(text) || ~element.author.indexOf(text));
            return ~element.name.toLocaleLowerCase().indexOf(text) || ~element.author.toLocaleLowerCase().indexOf(text);
        });
        arrRightList = arrRightList.filter(element => {
            return ~element.name.toLocaleLowerCase().indexOf(text) || ~element.author.toLocaleLowerCase().indexOf(text);
        });
    }

    function createElementPic(book, parentElem) {
        const pic = document.createElement('div');
        const span = document.createElement('span');
        const img = document.createElement('img');


        pic.className = "pic";
        img.src = book.img;
        parentElem.appendChild(pic).appendChild(span).appendChild(img);


    }

    function createElementTitle(book, parentElem) {
        const title = document.createElement('div');
        const name = document.createElement('span');
        const author = document.createElement('span');
        const titleElem = parentElem.appendChild(title);

        title.className = "title";
        name.innerHTML = `<b>Название</b>: ${book.name}`;
        titleElem.appendChild(name);
        author.innerHTML = `<b>Автор</b>: ${book.author}`;
        titleElem.appendChild(author);
    }

    function createElementItem(book, parentElem, pseudoElement) {
        const item = document.createElement('div');
        const arrow = document.createElement('div');
        const itemElem = parentElem.appendChild(item);

        item.className = "item";
        createElementPic(book, itemElem);
        createElementTitle(book, itemElem);
        arrow.className = pseudoElement;
        arrow.setAttribute('bookName', book.name);
        itemElem.appendChild(arrow).addEventListener('click', (event) => {
            const bookName = event.currentTarget.getAttribute('bookName');

            changeLists(pseudoElement, bookName, arrLeftList, arrRightList);
            parentElemLeft.innerHTML = '';
            arrLeftList.forEach((book) => createElementItem(book, parentElemLeft, 'after'));
            parentElemRight.innerHTML = '';
            arrRightList.forEach((book) => createElementItem(book, parentElemRight, 'before'));
        });

    }

    function changeLists(pseudoElement, bookName, arrLeftList, arrRightList) {
        if (pseudoElement === 'after') {
            const index = arrLeftList.findIndex(element => element.name === bookName);
            const newElement = arrLeftList.splice(index, 1)[0];

            arrRightList.push(newElement);
            window.localStorage.setItem('leftList', JSON.stringify(arrLeftList));
            window.localStorage.setItem('rightList', JSON.stringify(arrRightList));
        }
        if (pseudoElement === 'before') {
            const index = arrRightList.findIndex(element => element.name === bookName);
            const newElement = arrRightList.splice(index, 1)[0];

            arrLeftList.push(newElement);
            window.localStorage.setItem('leftList', JSON.stringify(arrLeftList));
            window.localStorage.setItem('rightList', JSON.stringify(arrRightList));
        }
    }
}
