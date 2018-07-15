window.onload = function() {
    const parentElemLeft = document.querySelector('.left');
    const parentElemRight = document.querySelector('.right');
    const input = document.querySelector('input');
    let arrLeftList = [];
    let arrRightList = [];
    let timeout;

    load(arrLeftList, arrRightList);
    
    input.addEventListener('keydown', (event) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            search(event.target.value.toLowerCase());
            createAllElement(parentElemLeft, parentElemRight, arrLeftList, arrRightList);
        }, 500)
    });

    function loadJSON(file, callback) {

        const xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        xhr.open('GET', file, true);
        xhr.onreadystatechange = () => {

            if (xhr.readyState == 4 && xhr.status == 200) {
                callback(xhr.responseText);
            }
        };
        xhr.send(null);
    }

    function load(arrLeftList, arrRightList) {
        if (window.localStorage.getItem('leftList') === null) {
            loadJSON("books", (response) => {
                window.localStorage.setItem('leftList', response);
                const data = JSON.parse(response);
                console.log(response);
                for (key in data) {
                    arrLeftList.push(data[key]);
                }
                createElementAmount(parentElemLeft, arrLeftList);
                arrLeftList.forEach((book) => createElementItem(book, parentElemLeft, 'after'));
            });

        } else {
            getDataLocalStorage(arrLeftList, arrRightList);
            createElementAmount(parentElemLeft, arrLeftList);
            arrLeftList.forEach((book) => createElementItem(book, parentElemLeft, 'after'));
            createElementAmount(parentElemRight, arrRightList);
            arrRightList.forEach((book) => createElementItem(book, parentElemRight, 'before'));
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
        getDataLocalStorage(arrLeftList, arrRightList);

        arrLeftList = arrLeftList.filter(element => ~element.author.toLowerCase().indexOf(text));
        arrRightList = arrRightList.filter(element => ~element.author.toLowerCase().indexOf(text));
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

        item.className = 'item';
        createElementPic(book, itemElem);
        createElementTitle(book, itemElem);
        arrow.className = pseudoElement;
        arrow.setAttribute('bookName', book.name);
        itemElem.appendChild(arrow).addEventListener('click', (event) => {
            const bookName = event.currentTarget.getAttribute('bookName');

            changeLists(pseudoElement, bookName, arrLeftList, arrRightList);
            createAllElement(parentElemLeft, parentElemRight, arrLeftList, arrRightList);
        });

    }

    function createElementAmount(parentElem, arr) {
        const elemAmount = document.createElement('div');

        elemAmount.innerHTML = `Всего книг: ${arr.length}`;
        parentElem.appendChild(elemAmount);
    }

    function createAllElement(parentElemLeft, parentElemRight, arrLeftList, arrRightList) {
        parentElemLeft.innerHTML = '';
        parentElemRight.innerHTML = '';
        createElementAmount(parentElemLeft, arrLeftList);
        arrLeftList.forEach((book) => createElementItem(book, parentElemLeft, 'after'));
        createElementAmount(parentElemRight, arrRightList);
        arrRightList.forEach((book) => createElementItem(book, parentElemRight, 'before'));
    }

    function changeLists(pseudoElement, bookName, arrLeftList, arrRightList) {
        if (pseudoElement === 'after') {
            const index = arrLeftList.findIndex(element => element.name === bookName);
            const newElement = arrLeftList.splice(index, 1)[0];

            arrRightList.push(newElement);
            setLocalStorage(arrLeftList, arrRightList)
        }
        if (pseudoElement === 'before') {
            const index = arrRightList.findIndex(element => element.name === bookName);
            const newElement = arrRightList.splice(index, 1)[0];

            arrLeftList.push(newElement);
            setLocalStorage(arrLeftList, arrRightList)
        }
    }

    function setLocalStorage(arrLeftList, arrRightList) {
        window.localStorage.setItem('leftList', JSON.stringify(arrLeftList));
        window.localStorage.setItem('rightList', JSON.stringify(arrRightList));
    }
}
