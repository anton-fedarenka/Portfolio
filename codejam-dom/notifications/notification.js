if (!localStorage.getItem('notificationIsDisabled')) {
	let notification = document.getElementById('notification');
	let checkbox = document.getElementById('disable-messages');
	let closingButton = document.getElementById('icon-close');
	let notificationMessages = [
	[['Message of the day'],['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales elit eget congue elementum. Praesent gravida finibus orci, et lacinia quam suscipit eget.']],
	[['Message of the day'],['Vestibulum blandit eu lectus id aliquet. Etiam eu velit aliquet, convallis velit et, scelerisque velit. Sed urna leo, fermentum nec mollis nec, convallis et ex.']],
	[['Message of the day'],['Curabitur fermentum dapibus purus, ac pretium tortor elementum a. Nulla nec lorem libero. Mauris eleifend risus vitae leo hendrerit iaculis.']],
	[['Message of the day'],['Etiam consequat quis massa a fermentum. Aliquam scelerisque libero vitae consequat porta. Curabitur ante lacus, tempor quis felis vitae, commodo maximus mi.']],
	[['Message of the day'],['Phasellus sit amet commodo velit. Sed mollis vehicula rutrum. Morbi egestas ex a nisi luctus euismod. Vivamus euismod ut mauris vel congue.']],
	[['Message of the day'],['Curabitur erat lectus, hendrerit in faucibus id, sagittis eget dolor. Cras a arcu et odio facilisis dignissim quis ut diam. ']]
	];
	let message = document.getElementById('info-slides');
	let slider = document.getElementById('slides-nav');
	let links = document.getElementsByClassName('slide-nav');
	let prevButton = document.getElementById('prev');
	let nextButton = document.getElementById('next');
	let rightArrowKeyCode = 39;
	let leftArrowKeyCode = 37;
	let escapeKeyCode = 27;

	window.addEventListener('load', openNotificationAfterFiveSeconds);	
	function openNotificationAfterFiveSeconds () {//notification open in 1 seconds
		setTimeout(openNotification, 1000);
	}
	function openNotification() {
		notification.classList.remove('hidden');
	}

	function setMessage(num) { //text message download
		message.firstChild.innerHTML = notificationMessages[num][0];
		message.lastChild.innerHTML = notificationMessages[num][1];
	}
	setMessage(0);

	closingButton.addEventListener('click', closeNotification); //when press the close button
	function closeNotification() {
		notification.classList.add('hidden');
		if (checkbox.checked === true) {
			localStorage.setItem('notificationIsDisabled', 'true');
		}
	}

	slider.addEventListener('click', showMessage);
	function showMessage(e) {
		let target = e.target;
		[].forEach.call(links, item => item.classList.remove('current'));
		target.classList.add('current');
		num = target.getAttribute('data-slide');
		setMessage(num);
	}

	nextButton.addEventListener('click', e => toSlide('next'));//slider arrows movement
	prevButton.addEventListener('click', e => toSlide('prev'));
	function toSlide(side) {
		let currentSlideNum = document.querySelector('.current').getAttribute('data-slide');
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

	addEventListener('keydown', toSlideKey); //keyboard action
	function toSlideKey() {
		switch(event.keyCode) {
	  		case rightArrowKeyCode:
	  			toSlide('next');
	  			break;
	  		case leftArrowKeyCode:
	  			toSlide('prev');
	  			break;
	  		case escapeKeyCode:
	  			closeNotification();
	  			break;
	  	}
	}
}