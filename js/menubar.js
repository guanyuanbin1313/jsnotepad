/* exported $menubar*/
var $menubar = (function() {
  var $bar = $('<div class="notepad-menubar"></div>'),
      menuData,
      menus = [],
      active = -1;
  function show(data) {
    menuData = data;
    var $titles = $('<ul class="menu-title"></ul>');
    for(var i=0; i<menuData.length; i++) {
      var $title = $('<li class="title"></li>');
      $title.html(menuData[i].title);
      $title.attr('data-id', i);
      $titles.append($title);

      $title.click(function(e) {
        var i = Number(this.dataset.id);

        if(active === -1) {
          menus[i].css({ display: 'inline-block' });
          active = i;
        } else if(active !== i) {
          menus[active].css({ display: 'none' });
          menus[i].css({ display: 'inline-block' });
          active = i;
        } else {
          menus[active].css({ display: 'none' });
          active = -1;
        }

        e.stopPropagation();
      });

      $title.hover(function() {
        if(active !== -1) {
          var i = Number(this.dataset.id);

          menus[active].css({ display: 'none' });
          menus[i].css({ display: 'inline-block' });
          active = i;
        }
      });
    }

    $bar.append($titles);
    
    for(var q=0; q<menuData.length; q++) {
      var $menus = $('<ul class="menus"></ul>'),
          items = menuData[q].menuItems;

      for(var j=0; j<items.length; j++) {
        if(items[j].title === 'hr') {
          var $hr = $('<li class="menu-hr"></li>');
          $menus.append($hr);
          continue;
        }

        var $menu = $('<li class="menu-item"></li>');

        $menu.html(items[j].title);
        $menu.attr('data-x', q);
        $menu.attr('data-y', j);

        if(items[j].shortcut !== '') {
          var $shorcut = $('<span class="shortcut"></span>');

          $shorcut.html(items[j].shortcut);
          $menu.append($shorcut);
        }

        if(!items[j].enabled) $menu.addClass('disabled');

        $menus.append($menu);

        $menu.click(function(e) {
          e.stopPropagation();

          if($(this).hasClass('disabled')) return;

          var q = this.dataset.x, j = this.dataset.y;

          menus[q].css({display: 'none'});
          active = -1;

          menuData[q].menuItems[j].handler();
        });
      }

      $menus.css({
        width: menuData[q].width,
        left: menuData[q].left,
        display: 'none'
      });

      $bar.append($menus);
      menus.push($menus);
    }
    $('body').append($bar);
  }

  function hideMenu() {
    if(active === -1) return;
    menus[active].css({display: 'none'});
    active = -1;
  }
  return {
    show: show,
    hideMenu: hideMenu
  };
}());
