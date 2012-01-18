  ;
  (function($, window, document) {
    var Plugin, defaults, pluginName;
    pluginName = 'orderly';
    defaults = {
      direction: 'ascending',
      listclass: 'orderly',
      tableclass: 'orderly',
      buttonclass: 'orderly-button',
      sortcolumn: 0,
      sortcallback: null,
      toolbar: false,
      showtoolbar: true,
      toolbarclass: 'orderly-toolbar',
      filterlabel: 'Type here to filter...',
      filterclass: 'orderly-filter',
      ascbtnsrc: 'img/up.png',
      descbtnsrc: 'img/down.png',
      showbtnsrc: 'img/plus.png',
      hidebtnsrc: 'img/minus.png'
    };
    Plugin = (function() {

      function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
      }

      Plugin.prototype.init = function() {
        switch ($(this.element).get(0).nodeName.toLowerCase()) {
          case 'table':
            return this.setupTable();
          case 'ul':
            return this.setupList();
          default:
            return $.error('Orderly: DOM element not supported.');
        }
      };

      Plugin.prototype.setupList = function() {
        var $asc, $desc, $filter, $toggle, $toolbar,
          _this = this;
        if (this.options.toolbar) {
          $toolbar = $('<div>').addClass(this.options.toolbarclass);
          $filter = $("<input \n    type=\"text\" \n    value=\"" + this.options.filterlabel + "\"\n    class=\"" + this.options.filterclass + "\"\n/>").keyup(function() {
            return _this.filterList($filter.val());
          }).focus(function() {
            if ($filter.val() === _this.options.filterlabel) {
              return $filter.val('');
            }
          }).blur(function() {
            if ($filter.val() === '') {
              return $filter.val(_this.options.filterlabel);
            }
          });
          $asc = $("<button class=\"" + this.options.buttonclass + "\">\n    <img src=\"" + this.options.ascbtnsrc + "\" />\n</button>").click(function() {
            return _this.sortList('ascending');
          });
          $desc = $("<button class=\"" + this.options.buttonclass + "\">\n    <img src=\"" + this.options.descbtnsrc + "\" />\n</button>").click(function() {
            return _this.sortList('descending');
          });
          $toolbar.append($filter).append(' ').append($asc).append(' ').append($desc);
          $toggle = $("<button class=\"" + this.options.buttonclass + " orderly-visible\">\n    <img src=\"\" />\n</button>").click(function() {
            if ($toolbar.is(':visible')) {
              $toolbar.slideUp();
              return $toggle.children('img').attr('src', _this.options.showbtnsrc);
            } else {
              $toolbar.slideDown();
              return $toggle.children('img').attr('src', _this.options.hidebtnsrc);
            }
          });
          if (this.options.showtoolbar) {
            $toolbar.show();
            $toggle.children('img').attr('src', this.options.hidebtnsrc);
          } else {
            $toolbar.hide();
            $toggle.children('img').attr('src', this.options.showbtnsrc);
          }
        }
        this.sortList(this.options.direction);
        return $(this.element).before($toggle).before($toolbar).addClass(this.options.listclass);
      };

      Plugin.prototype.sortList = function(direction) {
        var $list, items;
        $list = $(this.element);
        items = $list.children('li').get();
        items.sort(function(a, b) {
          var compA, compB;
          compA = $(a).text().toLowerCase();
          compB = $(b).text().toLowerCase();
          if (compA < compB) {
            return -1;
          } else if (compA > compB) {
            return 1;
          } else {
            return 0;
          }
        });
        if (direction === 'descending') items.reverse();
        $.each(items, function(id, item) {
          return $list.append(item);
        });
        return $list;
      };

      Plugin.prototype.filterList = function(query) {
        var $list;
        $list = $(this.element);
        return $list.children('li').each(function() {
          var $item;
          $item = $(this);
          if ($item.text().toLowerCase().indexOf(query.toLowerCase()) === -1) {
            return $item.hide();
          } else {
            return $item.show();
          }
        });
      };

      Plugin.prototype.setupTable = function() {
        var $table,
          _this = this;
        this.sortColumn = this.options.sortcolumn;
        this.sortDirection = this.options.direction;
        $table = $(this.element).addClass(this.options.tableclass);
        $.each($table.find('th'), function(id, item) {
          return $(item).click(function() {
            var dir;
            if (_this.sortColumn === id) {
              if (_this.sortDirection === 'ascending') {
                dir = 'descending';
              } else {
                dir = 'ascending';
              }
            } else {
              dir = 'ascending';
            }
            return _this.sortTable(dir, id);
          });
        });
        return this.sortTable(this.options.ordering, this.options.sortcolumn);
      };

      Plugin.prototype.sortTable = function(direction, column) {
        var $tbody, items;
        this.sortColumn = column;
        this.sortDirection = direction;
        $tbody = $(this.element).children('tbody');
        items = $tbody.children('tr').get();
        items.sort(function(a, b) {
          var compA, compB;
          compA = $(a).children('td').get(column).innerHTML;
          compB = $(b).children('td').get(column).innerHTML;
          if (compA < compB) {
            return -1;
          } else if (compA > compB) {
            return 1;
          } else {
            return 0;
          }
        });
        if (direction === 'descending') items.reverse();
        $.each(items, function(id, item) {
          return $tbody.append(item);
        });
        if (this.options.callback != null) this.options.callback(this);
        return $(this.element);
      };

      Plugin.prototype.filterTable = function(query) {
        var _this = this;
        query = query.toLowerCase();
        return $.each($(this.element).find('tbody tr'), function(row_id, row) {
          var $row;
          $row = $(row);
          return $.each($row.children('td'), function(col_id, cell) {
            var value;
            value = $(cell).text().toLowerCase();
            if (value.indexOf(query) === -1) {
              return $row.hide();
            } else {
              return $row.show();
            }
          });
        });
      };

      return Plugin;

    })();
    return $.fn[pluginName] = function(options) {
      return this.each(function() {
        if (!$.data(this, "plugin_" + pluginName)) {
          return $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        }
      });
    };
  })(jQuery, window, document);
