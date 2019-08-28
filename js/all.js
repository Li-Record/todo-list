$(document).ready(function() {
    console.log('ready');

    // 先建立一個 空陣列 準備來新增到資料庫
    let listData = localStorage.getItem('list') || [];
    if (typeof(listData) === 'string') {
        listData = listData.split(',');
    }

    // 一進到網頁 就更新畫面
    function update() {
        // 清空原先列表
        $('.list-group').html('');
        for (let i = 0; i < listData.length; i++) {
            // 再新增
            createList(listData[i], i);
        }
    }
    update();

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
        /* Act on the event */
        if (e.keyCode === 13) {
            let textValue = $(this).val();
            if (textValue === '') { return };
            listData.push(textValue);
            localStorage.setItem('list', listData);
            update();
            $(this).val('');
        }
    });

    // 刪除
    $('.list-group').click(function(e) {
        /* Act on the event */
        let tagName = e.target.tagName;
        switch (tagName) {
            case 'SPAN':
                let num = $(e.target).parent().parent().data('num');
                listData.splice(num, 1);
                localStorage.setItem('list', listData);
                update();
                break;
            case 'INPUT':
                $(e.target).next().toggleClass('line-through');
                break;
        }
    });

    // 修改 
    function edit(who) {
        let num = $(who).data('num');
        // 加入 input value 是原本裡面的值
        let str = `
			<input type="text" class="edit-line w-100 p-2" value="${listData[num]}" data-num="${num}">
        `
        $(who).addClass('p-0');
        $(who).html(str);
        // 讓游標保持最後，先清空，在貼上值
        $(who).find('input').val('').focus().val(listData[num]);
        // 修改完成後 enter 重新放入 localstorage
        $(who).find('input').keyup(function(e) {
            /* Act on the event */
            if (e.keyCode === 13) {
                let textValue = $(this).val();
                if (textValue === '') { return };
                listData[num] = textValue;
                localStorage.setItem('list', listData);
                update();
            } else if (e.keyCode === 27 ){
            	
            	cancelEdit(who,num);
            }
        });
    }

    // 取消
    function cancelEdit(who,num){
    	$(who).removeClass('p-0');
    	$(who).html('');
        let createInput = document.createElement('input');
        let createP = document.createElement('p');
        let createBtn = document.createElement('button');

        createInput.setAttribute('class', 'mr-3');
        createInput.setAttribute('type', 'checkbox');
        createP.setAttribute('class', 'd-inline');
        createP.textContent = listData[num];
        createBtn.setAttribute('class', 'close');
        createBtn.setAttribute('type', 'button');
        createBtn.innerHTML = '<span aria-hidden="true">&times;</span>';

        $(who).append(createInput);
        $(who).append(createP);
        $(who).append(createBtn);
    }

    // 點兩下修改
    $('.list-group').dblclick(function(e) {
        let tagName = e.target.tagName;
        if (tagName !== 'LI' && tagName !== 'P') { 
        	return 
        }else if ($(this).find('input[type=text]').hasClass('edit-line')){
        	let who = $(this).find('input[type=text]').parent();
        	let num = $(this).find('input[type=text]').data('num');
        	cancelEdit(who,num);
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


});