(function () {
  'use strict';

  angular
    .module('app')
    .controller('AppController', AppController);

  AppController.$inject = [
    '$scope',
    '$window',
    'dialogService'
  ];

  function AppController($scope,
    $window,
    dialogService) {

    // HEAD //
    var vm = this;

    _active();

    // Window controls //
    try {
      var BrowserWindow = $window.require('electron').remote.BrowserWindow;
      $scope.minimizeWindow = function () {
        var window = BrowserWindow.getFocusedWindow();
        window.minimize();
      };

      $scope.maximizeWindow = function () {
        var window = BrowserWindow.getFocusedWindow();
        if (window.isMaximized()) {
          window.unmaximize();
        } else {
          window.maximize();
        }
      };

      $scope.closeWindow = function () {
        var window = BrowserWindow.getFocusedWindow();
        _onBeforeCloseDesktop(window);
      };
    } catch (e) { }

    // BODY //
    function _active() {
      window.onbeforeunload = _onBeforeCloseBrowser;

      try {
        var gui = require('nw.gui');
        var win = gui.Window.get();

        win.on('close', function () {
          _onBeforeCloseDesktop(win);
        });
      } catch (e) { }
    }

    function _onBeforeCloseBrowser() {
      if ($window.editor.isDirty()) {
        return "Leaving now will erase your unsaved changes.";
      }
    }
    function _onBeforeCloseDesktop(win) {
      if ($window.editor.isDirty()) {
        dialogService
          .confirm(
            'Leave without saving?',
            'If you proceed you will lose all unsaved modifications.',
            null)
          .then(function () {
            win.close(true);
          });
        return false;
      } else {
        win.close(true);
      }

    }
  }

})();