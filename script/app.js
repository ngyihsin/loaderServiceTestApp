var paymentTest = {

  init: function init() {
    this.current = 0;
    this.navigableItems[this.current].focus();
    window.addEventListener('keyup', this);
    window.addEventListener('keydown', this);
    window.addEventListener('hashchange', this);
    this.loaderservice_result = document.getElementById('loaderservice_result');
    this.responsefile = document.getElementById('responsefile');
    this.getversion_result = document.getElementById('getversion_result');
  },

  uninit: function uninit() {

  },

  get navigableItems() {
    delete this.navigableItems;
    return this.navigableItems = document.querySelectorAll('.navigable');
  },

  handleEvent: function handleEvent(ev) {
    dump("handleEvent:" + ev.type);
    switch (ev.type) {
      case 'click':
        if (ev.target.id === "exit-button") {
          window.location.hash = '';
        }
        break;
      case 'load':
        break;
      case 'unload':
        break;
      case 'hashchange':
        break;
      case 'transitionend':
        break;
      case 'keydown':
        this.handleKeydown(ev);
        break;
      case 'keyup':
        this.handleKeyup(ev);
        break;
    }
  },

  disSelectAll: function () {
    this.sendMoney.checked = false;
    this.getMoney.checked = false;
    this.stop.checked = false;
  },

  handleKeydown: function ut_handleKeydown(ev) {
    var key = ev.key;
    dump("handleKeydown " + key );
    switch(key) {
      case 'Enter':
        if (ev.target.id == "lsexecute-button") {
          var loaderService = window.navigator.loaderService;
          var enabled = window.navigator.mozNfc.enabled;
          if (!enabled || !loaderService) {
            dump("Nfc is not enabled or LoaderService API is not present");
          } else {
            dump("Get LoaderService");
            paymentTest.loaderservice_result.textContent = "update ongoing....";
            loaderService.lsExecuteScript("/storage/emulated/Reliance_Load_Cap_Files.txt", "/storage/emulated/UpdateResult.txt")
            .then((result) => {
              // Loader service response.
              dump("loader service response " + result.data);
              paymentTest.loaderservice_result.textContent = "Update result:" + result.data;
            })
            .catch((err) => {
              dump("loader service execute script error:" + err.name + " " + err.message);
              paymentTest.loaderservice_result.textContent = err.name + " " + err.message;
            });
          }
        } else if (ev.target.id == "getversion-button") {
          dump("lsGetVersion start testing ...");
          var enabled = window.navigator.mozNfc.enabled;
          var loaderService = window.navigator.loaderService;
          if (!enabled || !loaderService) {
            dump("Nfc is not enabled or LoaderService API is not present");
          } else {
            dump("Get LoaderService");
            loaderService.lsGetVersion()
            .then((result) => {
              dump("get version response " + result.data);
              paymentTest.getversion_result.textContent = "ls applet ver:" + result.data;
            })
            .catch((err) => {
              dump("get loader service error:" + err.name + " " + err.message);
              paymentTest.getversion_result.textContent = err.name + " " + err.message;
            });
          }
        } else if (ev.target.id == "clear-button") {
          paymentTest.loaderservice_result.textContent = "";
          paymentTest.responsefile.textContent = "";
          paymentTest.getversion_result.textContent = "";
        }
        break;
      case 'ArrowUp':
        this.current -= 1;
        if (this.current < 0) {
          this.current = this.navigableItems.length;
        }
        this.navigableItems[this.current].focus();
        break;
      case 'ArrowDown':
        this.current += 1;
        this.current %= this.navigableItems.length;
        this.navigableItems[this.current].focus();
        break;
      case 'BrowserBack':
      case 'Backspace':
        break;
    }
  },

  handleKeyup: function ut_handleKeyup(ev) {
    var key = ev.key;
    switch(key) {
      case 'BrowserBack':
      case 'Backspace':
        break;
    }
  }
};
window.addEventListener('load', paymentTest.init.bind(paymentTest));
