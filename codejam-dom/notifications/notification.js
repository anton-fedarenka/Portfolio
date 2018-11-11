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

	message.firstChild.innerHTML = notificationMessage[0][0]; //добавление текста нотификации
	message.lastChild.innerHTML = notificationMessage[0][1];

	closingButton.addEventListener('click', e => closeNotification(e)); //при нажатии на кнопку закрытия
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
		message.firstChild.innerHTML = notificationMessage[num][0];
		message.lastChild.innerHTML = notificationMessage[num][1];
	}

	nextButton.addEventListener('click', e => slideNext()); //перемещение по стрелкам
	prevButton.addEventListener('click', e => slidePrev());
	function slideNext() {
		let currentSlideNum = document.querySelector('.info-slides-nav a.current').getAttribute("data-slide");
		+currentSlideNum === 5 ? nextSlideNum = 0 : nextSlideNum = +currentSlideNum + 1;
		links[nextSlideNum].classList.add('current');
		links[currentSlideNum].classList.remove('current');
		message.firstChild.innerHTML = notificationMessage[nextSlideNum][0];
		message.lastChild.innerHTML = notificationMessage[nextSlideNum][1];
	}
	function slidePrev() {
		let currentSlideNum = document.querySelector('.info-slides-nav a.current').getAttribute("data-slide");
		+currentSlideNum === 0 ? prevSlideNum = 5 : prevSlideNum = currentSlideNum - 1;
		links[prevSlideNum].classList.add('current');
		links[currentSlideNum].classList.remove('current');
		message.firstChild.innerHTML = notificationMessage[prevSlideNum][0];
		message.lastChild.innerHTML = notificationMessage[prevSlideNum][1];
	}
}