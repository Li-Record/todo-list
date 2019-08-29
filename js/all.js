$(document).ready(function() {
    // 先建立一個 空陣列 準備來新增到資料庫
    let listData = JSON.parse(localStorage.getItem('list')) || [];

    // 一進到網頁 就更新畫面
    function update() {
        localStorage.setItem('list', JSON.stringify(listData));
        $('.list-group').html('');
        for (let i = 0; i < listData.length; i++) {
            createList(listData[i].title, i);
            if (listData[i].completed) {
                let checkbox = $('.list-group input[type=checkbox]');
                $(checkbox[i]).next().addClass('line-through');
                checkbox[i].checked = true;
            }
        }
        countItems();
    }
    update();

    // 計算剩餘 list
    function countItems() {
        let getLen = listData.length;
        let checkbox = $('.list-group input[type=checkbox]');
        let ary = [];
        for (let i = 0; i < checkbox.length; i++) {
            if (checkbox[i].checked) {
                ary.push(i);
            }
        }
        let len = getLen - ary.length;

        $('#countItems').text(len + ' items left')
    }

    function active() {
        for (let i = 0; i < listData.length; i++) {
            if (listData[i].completed) {
                let checkbox = $('.list-group input[type=checkbox]');
                $(checkbox[i]).parent().addClass('d-none');
            }
        }
    }

    function completed() {
        for (let i = 0; i < listData.length; i++) {
            if (!listData[i].completed) {
                let checkbox = $('.list-group input[type=checkbox]');
                $(checkbox[i]).parent().addClass('d-none');
            }
        }
    }

    $('.nav-pills').click(function(e) {
        $(this).find('a').removeClass('active');
        if (e.target.tagName !== 'A') { return }
        $(e.target).addClass('active')
        switch (e.target.hash) {
            case '#active':
                update();
                active();
                break;
            case '#completed':
                update();
                completed();
                break;
            default:
                update();
                break;
        }
    });

    // 建立 li
    function createList(text, num) {
        let createLi = document.createElement('li');
        let createInput = document.createElement('input');
        let createP = document.createElement('p');
        let createBtn = document.createElement('button');

        createLi.setAttribute('class', 'list-group-item');
        createLi.setAttribute('data-num', num);
        createInput.setAttribute('class', 'mr-3');
        createInput.setAttribute('type', 'checkbox');
        createP.setAttribute('class', 'd-inline');
        createP.textContent = text;
        createBtn.setAttribute('class', 'close');
        createBtn.setAttribute('type', 'button');
        createBtn.innerHTML = '<span aria-hidden="true">&times;</span>';

        createLi.appendChild(createInput);
        createLi.appendChild(createP);
        createLi.appendChild(createBtn);
        document.querySelector('.list-group').appendChild(createLi);
    }

    // 新增
    $('#addList').keyup(function(e) {

        if (e.keyCode === 13) {
            let textValue = $(this).val();
            if (textValue === '') { return };

            let items = {};
            items.title = textValue;
            items.completed = false;
            listData.push(items);
            update();
            $(this).val('');
        }
    });

    // 事件代理 監聽 close checkbox
    $('.list-group').click(function(e) {
        let tagName = e.target.tagName;
        switch (tagName) {
            case 'SPAN':
                // 點擊叉叉 移除該項
                let num = $(e.target).parent().parent().data('num');
                listData.splice(num, 1);
                update();
                break;
            case 'INPUT':
                // 點擊到 checkbox
                $(e.target).next().toggleClass('line-through');
                let checkbox = $('.list-group input[type=checkbox]');
                for (let i = 0; i < checkbox.length; i++) {
                    if (checkbox[i].checked) {
                        listData[i].completed = true;
                    } else {
                        listData[i].completed = false;
                    }
                }

                if (location.hash === '#active') {
                    update();
                    active();
                } else if (location.hash === '#completed') {
                    update();
                    completed();
                } else {
                    update();
                }
                break;
        }
    });

    // 修改 
    function edit(who) {
        let num = $(who).data('num');
        // 加入 input value 是原本裡面的值
        let str = `
			<input type="text" class="edit-line w-100 p-2" value="" data-num="${num}">
        `
        $(who).addClass('p-0');
        $(who).html(str);
        // 讓游標保持最後，先清空，在貼上值
        $(who).find('input').val('').focus().val(listData[num].title);
        // 修改完成後 enter 重新放入 localstorage
        $(who).find('input').keyup(function(e) {
            if (e.keyCode === 13) {
                let textValue = $(this).val();
                if (textValue === '') { return };
                listData[num].title = textValue;
                update();
            } else if (e.keyCode === 27) {
                cancelEdit(who, num);
            }
        });
    }

    // 取消
    function cancelEdit(who, num) {
        $(who).removeClass('p-0');
        $(who).html('');
        let createInput = document.createElement('input');
        let createP = document.createElement('p');
        let createBtn = document.createElement('button');

        createInput.setAttribute('class', 'mr-3');
        createInput.setAttribute('type', 'checkbox');
        createP.setAttribute('class', 'd-inline');
        createP.textContent = listData[num].title;
        createBtn.setAttribute('class', 'close');
        createBtn.setAttribute('type', 'button');
        createBtn.innerHTML = '<span aria-hidden="true">&times;</span>';

        $(who).append(createInput);
        $(who).append(createP);
        $(who).append(createBtn);

        if (listData[num].completed) {
            let checkbox = $('.list-group input[type=checkbox]');
            $(checkbox[num]).next().addClass('line-through');
            checkbox[num].checked = true;
        }
    }

    // 點兩下修改
    $('.list-group').dblclick(function(e) {
        let tagName = e.target.tagName;
        if (tagName !== 'LI' && tagName !== 'P') {
            return
        } else if ($(this).find('input[type=text]').hasClass('edit-line')) {
            let who = $(this).find('input[type=text]').parent();
            let num = $(this).find('input[type=text]').data('num');
            cancelEdit(who, num);
        }
        switch (tagName) {
            case 'LI':
                edit(e.target);
                break;
            case 'P':
                let getLi = $(e.target).parent();
                edit(getLi);
                break;
        }
    })

    // 清除全部資料
    $('#clearAll').click(function(e) {
        // 建立一個警告視窗
        listData = [];
        update();
    });
});