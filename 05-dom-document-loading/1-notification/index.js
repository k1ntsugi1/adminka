export default class NotificationMessage {
  constructor(message = '', { duration = 0, type = ''} = {}) {
    this.message = message;
    this.duration = duration;
    this.durationStart = duration;
    this.type = type;
    
    this.render(); 
  }
  createElement(wrapperOfElement = null) {
    const element = wrapperOfElement ?? document.createElement('div');
    element.className = `${element.className} notification ${this.type}`;
    element.style['--value'] = `${this.duration / 1000}s`;
    const bodyElement = `
        <div class="timer"></div>
        <div class="inner-wrapper">
            <div class="notification-header"${this.type}></div>
            <div class="notification-body">${this.message}</div>
        </div>
    `;
    element.insertAdjacentHTML('afterbegin', bodyElement);
    return element;
  }

  render(wrapperOfElement = null) {
    this.element = this.createElement(wrapperOfElement);
  }

  createTimer() {
    this.constructor.timeoutID = setTimeout(() => {this.destroy();}, this.duration);
  }

  removeTimer() {
    clearTimeout(this.constructor.timeoutID);
    this.constructor.timeoutID = null;
  }

  remove() {
      this.constructor.globalNotifictionElement?.remove();
      this.constructor.globalNotifictionElement = null;
  }

  destroy() {
    this.element = null;
    this.remove();
    this.removeTimer();
  }

  show(wrapperOfElement = null) {
    this.destroy();
    if (wrapperOfElement) {this.render(wrapperOfElement);}
    this.constructor.globalNotifictionElement = this.element;
    document.body.append(this.constructor.globalNotifictionElement);
    this.duration = this.durationStart;
    this.createTimer();  
  }
}
