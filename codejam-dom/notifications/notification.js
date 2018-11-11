let notificationMessage = [
[['Tip of the day'],['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales elit eget congue elementum. Praesent gravida finibus orci, et lacinia quam suscipit eget.']],
[['Tip of the day'],['Vestibulum blandit eu lectus id aliquet. Etiam eu velit aliquet, convallis velit et, scelerisque velit. Sed urna leo, fermentum nec mollis nec, convallis et ex.']],
[['Tip of the day'],['Curabitur fermentum dapibus purus, ac pretium tortor elementum a. Nulla nec lorem libero. Mauris eleifend risus vitae leo hendrerit iaculis.']],
[['Tip of the day'],['Etiam consequat quis massa a fermentum. Aliquam scelerisque libero vitae consequat porta. Curabitur ante lacus, tempor quis felis vitae, commodo maximus mi.']],
[['Tip of the day'],['Phasellus sit amet commodo velit. Sed mollis vehicula rutrum. Morbi egestas ex a nisi luctus euismod. Vivamus euismod ut mauris vel congue.']],
[['Tip of the day'],['Curabitur erat lectus, hendrerit in faucibus id, sagittis eget dolor. Cras a arcu et odio facilisis dignissim quis ut diam. ']]
];

let notification = document.getElementById('notification');
notification.removeAttribute('hidden');

let message = document.getElementById('info-slides');
message.firstChild.innerHTML = notificationMessage[0][0];
message.lastChild.innerHTML = notificationMessage[0][1];

function closeNotification() {
	notification.setAttribute('hidden', 'true');
}

let closingButton = document.getElementById('icon-close');
closingButton.addEventListener('click', e => closeNotification(e));

