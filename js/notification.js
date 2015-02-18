function Notification(params){

    // create structure
    var notificationBlock = document.createElement('div');

    //check whether type of notification is provided
    if (params.type!=null) {
        notificationBlock.className = 'notification '+ params.type;
    }
    else {
        notificationBlock.className = 'notification'
    }

    var notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';

    var notificationInner = document.createElement('div');
    notificationInner.className = 'notification-inner';

    // close btn
    var closeBtn = document.createElement('div');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML='X';

    // get list of all notifications present on a page
    var notifications = document.body.getElementsByClassName('notification');

    // remove notification when click on close btn
    var that = this
    closeBtn.addEventListener('click',function() {that.removeStaff(notificationBlock, notifications)},false);

    var textBlock = document.createElement('p');

    //fill in text
    if (params.text!=null || params.text!='') {
        textBlock.innerHTML = params.text;
    }

    // construct
    notificationInner.appendChild(textBlock);
    notificationInner.appendChild(closeBtn);

    notificationContainer.appendChild(notificationInner);
    notificationBlock.appendChild(notificationContainer);

    // check whether other notifications are present
    // to positionate next notification below
    if (notifications.length>0) {
        var lastAddedNotification = notifications[0];
        var bottomEdgeOfLastNotification = lastAddedNotification.offsetHeight+lastAddedNotification.offsetTop;
        notificationBlock.style.top = bottomEdgeOfLastNotification+'px';
    }

    //append to page
    document.body.insertBefore(notificationBlock, document.body.firstChild);

}


Notification.prototype.removeStaff = function(elemToDelete, notifications) {

    // check whether we need to repositionate notifications
    // if item is the last visible on the page we don't need to repositionate
    if (elemToDelete != notifications[0]) {
        var repositionateNeeded = true;
        var previousSibling = elemToDelete.previousElementSibling;
        var topPositionValue = elemToDelete.offsetTop;
    }

    document.body.removeChild(elemToDelete);

    //repositionate existent notifications
    if (repositionateNeeded) {
        repositionateInList (previousSibling, topPositionValue, 'notification');
    }

}

window.addEventListener('resize', function() {
    // get list of all notifications present on a page
    var notifications = document.body.getElementsByClassName('notification');
    var amount = notifications.length;
    if (amount>1) {
        firstNotification = notifications[amount-1];
        repositionateInList (firstNotification, 0, 'notification');
    }

});

function repositionateInList (currentSibling, topPositionValue, className) {
        do {
            if (hasClass(currentSibling,className)) {
                currentSibling.style.top = topPositionValue + 'px'; 
                var topPositionValue = currentSibling.offsetHeight+currentSibling.offsetTop; 
            }
            currentSibling = currentSibling.previousElementSibling;
        }
        while (currentSibling)
}

function hasClass(el, cls) {
  return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
}

/* use like here

 new Notification( {
 type: 'warn',
 text : '<span>Success!</span> You are welcome!'
 });

 new Notification( {
 type: 'error',
 text : '<span>Error!</span> Fail!'
 });

 new Notification( {
 type: 'success',
 text : '<span>Be careful!</span> Dangerous!''
 });


 */