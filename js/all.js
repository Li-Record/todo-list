$(document).ready(function() {
    console.log('ready');
    // 建立 list
    $('#addList').keyup(function(e) {
        /* Act on the event */
        if (e.keyCode === 13) {
            let textValue = $(this).val();
            let createLi = document.createElement('li');
            let createInput = document.createElement('input');
            let createP = document.createElement('p');
            let createBtn = document.createElement('button');

            createLi.setAttribute('class', 'list-group-item');
            createInput.setAttribute('class', 'mr-3');
            createInput.setAttribute('type', 'checkbox');
            createP.setAttribute('class', 'd-inline');
            createP.textContent = textValue;
            createBtn.setAttribute('class', 'close');
            createBtn.setAttribute('type', 'button');
            createBtn.innerHTML = '<span aria-hidden="true">&times;</span>';

            createLi.appendChild(createInput);
            createLi.appendChild(createP);
            createLi.appendChild(createBtn);
            document.querySelector('.list-group').appendChild(createLi);
        }
    });
    $('.list-group').click(function(e) {
    	/* Act on the event */
    	let tagName = e.target.tagName;
    	switch (tagName) {
    		case 'SPAN':
    			$(e.target).parent().parent().remove();
    			break;
    		case 'INPUT':
    			$(e.target).next().toggleClass('line-through');
    			break;
    	}
    });
    

});