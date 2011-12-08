/*
    jquery-orderly
    A list sorting plugin for jQuery.
    George Lesica <glesica@gmail.com>
*/

(function($){

    var init = function(options) {
        var settings; // For storing default settings
    
        // Configure default settings
        var settings = {
            // Initial sort direction
            ordering                  : 'ascending',
            
            // One or more classes to add to each targeted list
            listclass                 : 'jq-orderly',
            
            // Options for sorting tables
            tableclass                : 'jq-orderly',
            sortcolumn                : 0, // Initial column to use for sorting
            sortcallback              : null, // Called in table's context
            
            // The controlbar lets the user search and re-order the list
            controlbar                : false, // Create a controll bar or not
            showcontrolbar            : true, // Show control bar initially
            controlbarclass           : 'jq-orderly-controlbar',
            
            // Filter box lets the user search the list by typing
            filterboxlabel            : 'Type here to filter...',
            filterboxclass            : 'jq-orderly-filterbox',

            // Button image file paths
            ascbtnsrc                 : 'img/up.png',
            descbtnsrc                : 'img/down.png',
            showbtnsrc                : 'img/plus.png',
            hidebtnsrc                : 'img/minus.png',
        };
        // Update default settings with options passed in
        if (options) {
            $.extend(settings, options);
        }
        
        var $target = this;
        
        // Run the appropriate setup method for the type of tags we got.
        $target.each(function() {
            var $next = $(this);
            var tagname = $next.get(0).nodeName.toLowerCase();
            
            if (tagname == 'table') {
                setupTable.call($next, settings);
            } else if (tagname == 'ul') {
                setupList.call($next, settings);
            } else {
                console.error('Orderly: Invalid DOM element: ' + tagname);
            }
        });
        
        return $target;
    };
    
    // Filter a list: `str` is a search string. List items that do not 
    // include the search string (case-insensitive) will be hidden.
    var filterList = function(str) {
        $list = this;
        // Filter the list based on the search string `str`
        var search_string = str.toLowerCase();
        $list.children('li').each(function() {
            if ($(this).text().toLowerCase().indexOf(search_string) == -1) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
        
        return $list;
    }
    
    // Filter a table: `str` is a search string to look for. Rows that do 
    // not contain the search string (case-insensitive) will be hidden.
    var filterTable = function(str) {
        $tbody = this.children('tbody');
        
        var search_string = str.toLowerCase();
        $tbody.children('tr').each(function() {
            var $row = $(this);
            var hide = false;
            $row.children('td').each(function() {
                if ($(this).text().toLowerCase().indexOf(search_string) == -1) {
                    hide = true;
                }
            });
            if (hide) {
                $row.hide();
            } else {
                $row.show(); // Need to do this so you can get the list back
            }
        });
        
        return this;
    }
    
    // Sort a list: `direction` is either 'ascending' or 'descending'.
    var sortList = function(direction) {
        var $list = this;
        
        // Record the sorting direction
        $list.data('ordering', direction);
        
        // Create a place to store the items
        var items = $list.children('li').get();
        
        // Sort the list
        items.sort(function(a, b) {
            var compA = $(a).text().toUpperCase();
            var compB = $(b).text().toUpperCase();
            return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        });
        
        // Flip the list if we want it to be descending
        if (direction == 'descending') {
            items.reverse();
        }
        
        // Rebuild the sorted list
        $.each(items, function(id, item) {
            $list.append(item);
        });
        
        return $list;
    };
    
    // Sort a table: `direction` is either 'ascending' or 'descending', 
    // and `column` is the column index (starting with 0) of the column to 
    // sort on.
    var sortTable = function(direction, column) {
        this.data('orderly.sort.column', column);
        this.data('orderly.sort.direction', direction);
    
        $tbody = this.children('tbody');
        
        // Get raw DOM objects for the rows
        var items = $tbody.children('tr').get();
        
        // Sort the list
        items.sort(function(a, b) {
            var compA = $(a).children('td').get(column).innerHTML;
            var compB = $(b).children('td').get(column).innerHTML;
            return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        });
        
        // Reverse the list if we need desc sort order
        if (direction == 'descending') {
            items.reverse();
        }
        
        // Rebuild the table
        $.each(items, function(id, item) {
            $tbody.append(item);
        });
        
        // Call the post-sort callback, if present
        var callback = this.data('orderly.sort.callback');
        if (callback) {
            callback.call(this);
        }
        
        return this;
    }
    
    // Initial setup for a list
    var setupList = function(settings) {
        // Set up the list with proper classes, etc.
        var $list = this
            .addClass(settings.listclass)
            .data('orderly.type', 'list');
        
        // Call the sort() method to sort the list
        sortList.call($list, settings.ordering);
        
        // Set up the controll bar
        if (settings.controlbar) {
            var $controlbar = $('<div>')
                .addClass(settings.controlbarclass);
        
            // Create the filter box
            var $box = $('<input>')
                .attr('type', 'text')
                .attr('value', settings.filterboxlabel)
                .addClass(settings.filterboxclass)
                .keyup(function() {
                    filterList.call($list, $box.val());
                })
                .focus(function() {
                    if ($box.val() == settings.filterboxlabel) {
                        $box.val('');
                    }
                })
                .blur(function() {
                    if ($box.val() == '') {
                        $box.val(settings.filterboxlabel);
                    }
                });

            // Create the ascending and descending links
            var $asc = $('<img>')
                .addClass('jq-orderly-btn')
                .attr('src', settings.ascbtnsrc)
                .click(function() {
                    sortList.call($list, 'ascending');
                });

            var $desc = $('<img>')
                .addClass('jq-orderly-btn')
                .attr('src', settings.descbtnsrc)
                .click(function() {
                    sortList.call($list, 'descending');
                });
            
            // Add stuff to the tab bar
            $controlbar
                .append($box)
                .append($asc)
                .append($desc);
            
            // Create the show / hide button
            $visiblebtn = $('<img>')
                .addClass('jq-orderly-btn')
                .addClass('jq-orderly-visiblebtn')
                .click(function() {
                    if ($controlbar.is(':visible')) {
                        $controlbar.slideUp();
                        $(this).attr('src', settings.showbtnsrc);
                    } else {
                        $controlbar.slideDown();
                        $(this).attr('src', settings.hidebtnsrc);
                    }
                });
            
            // Show the tab bar if necessary
            if (settings.showcontrolbar) {
                $controlbar.show();
                $visiblebtn.attr('src', settings.hidebtnsrc);
            } else {
                $controlbar.hide();
                $visiblebtn.attr('src', settings.showbtnsrc);
            }
            
            $list
                .before($controlbar)
                .before($visiblebtn);
        }
        
        return $list;
    }
    
    // Initial setup for a table
    var setupTable = function(settings) {
        // Add classes and data to keep track of sort column and direction 
        // for subsequent calls.
        var $table = this
            .addClass(settings.tableclass)
            .data('orderly.type', 'table')
            .data('orderly.sort.column', settings.sortcolumn)
            .data('orderly.sort.direction', settings.ordering);
        
        // If we got a sort callback function to apply after sorting, save it.
        if (settings.sortcallback) {
            $table.data('orderly.sort.callback', settings.sortcallback);
        }
        
        // Sort the actual table
        sortTable.call($table, settings.ordering, settings.sortcolumn);
        
        // Add interface stuff to table so clicking on a column sorts by that
        // column and such and such.
        $table.find('th').each(function(id) {
            var $header = $(this);
            $header.click(function() {
                if ($table.data('orderly.sort.column') == id) {
                    var prev = $table.data('orderly.sort.direction');
                    if (prev == 'ascending') {
                        var dir = 'descending';
                    } else {
                        var dir = 'ascending';
                    }
                } else {
                    var dir = 'ascending';
                }
                sortTable.call($table, dir, id);
            });
        })
        .addClass('orderly-header');
        
        return $table;
    }
    
    // Define available methods
    var methods = {
        init            : init,
        sortList        : sortList,
        sortTable       : sortTable,
        filterList      : filterList,
        filterTable     : filterTable
    };
    
    // Run the correct method
    $.fn.orderly = function(method, options) {
        // Decide which method we're supposed to call and call it
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' +  method + ' does not exist on jQuery.orderly');
        }
    };
    
})(jQuery);


