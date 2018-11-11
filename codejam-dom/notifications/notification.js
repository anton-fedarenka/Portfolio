if (!localStorage.getItem('checkbox')) {
	let notification = document.getElementById('notification');
	let checkbox = document.getElementById('disable-messages');
	let closingButton = document.getElementById('icon-close');
	let notificationMessage = [
	[['Message of the day'],['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales elit eget congue elementum. Praesent gravida finibus orci, et lacinia quam suscipit eget.']],
	[['Message of the day'],['Vestibulum blandit eu lectus id aliquet. Etiam eu velit aliquet, convallis velit et, scelerisque velit. Sed urna leo, fermentum nec mollis nec, convallis et ex.']],
	[['Message of the day'],['Curabitur fermentum dapibus purus, ac pretium tortor elementum a. Nulla nec lorem libero. Mauris eleifend risus vitae leo hendrerit iaculis.']],
	[['Message of the day'],['Etiam consequat quis massa a fermentum. Aliquam scelerisque libero vitae consequat porta. Curabitur ante lacus, tempor quis felis vitae, commodo maximus mi.']],
	[['Message of the day'],['Phasellus sit amet commodo velit. Sed mollis vehicula rutrum. Morbi egestas ex a nisi luctus euismod. Vivamus euismod ut mauris vel congue.']],
	[['Message of the day'],['Curabitur erat lectus, hendrerit in faucibus id, sagittis eget dolor. Cras a arcu et odio facilisis dignissim quis ut diam. ']]
	];
	let message = document.getElementById('info-slides');
	let links = document.getElementsByClassName('slide-nav');
	let prevButton = document.getElementById('prev');
	let nextButton = document.getElementById('next');

	setTimeout(openNotification, 5000); //загрузка нотификации через 5 секунд
	function openNotification() {
		notification.removeAttribute('hidden');
	}

	function setMessage(num) { //загрузка текстового message
		message.firstChild.innerHTML = notificationMessage[num][0];
		message.lastChild.innerHTML = notificationMessage[num][1];
	}
	setMessage(0);

	closingButton.addEventListener('click', closeNotification); //при нажатии на кнопку закрытия
	function closeNotification() {
		notification.setAttribute('hidden', 'true');
		if (checkbox.checked === true) {
			localStorage.setItem('checkbox', 'checked');
		}
	}
	
	for (let i = 0; i < links.length; i++) { //слайдер
		links[i].addEventListener('click', e => showMessage(i));
	}
	function showMessage(num) {
		[].forEach.call(links, item => item.classList.remove('current'));
		links[num].classList.add('current');
		setMessage(num);
	}

	nextButton.addEventListener('click', e => toSlide('next'));//перемещение по стрелкам
	prevButton.addEventListener('click', e => toSlide('prev'));
	function toSlide(side) {
		let currentSlideNum = document.querySelector('.info-slides-nav a.current').getAttribute("data-slide");
		let nextSlideNum = null;
		if (side === 'next') {
			+currentSlideNum === 5 ? nextSlideNum = 0 : nextSlideNum = +currentSlideNum + 1;
		} else {
			+currentSlideNum === 0 ? nextSlideNum = 5 : nextSlideNum = currentSlideNum - 1;
		}
		links[nextSlideNum].classList.add('current');
		links[currentSlideNum].classList.remove('current');
		setMessage(nextSlideNum);
	}

	addEventListener('keydown', toSlideKey); //действия с клавиатуры
	function toSlideKey() {
		switch(event.keyCode) {
	  		case 39:
	  			toSlide('next');
	  			break;
	  		case 37:
	  			toSlide('prev');
	  			break;
	  		case 27:
	  			closeNotification();
	  			break;
	  	}
	}
}