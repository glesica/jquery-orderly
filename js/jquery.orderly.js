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
            
            // The controlbar lets the user search and re-order the list
            controlbar                : false,
            showcontrolbar            : true,
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
        
        // Set up the list with proper classes, etc.
        var $list = this.
            addClass(settings.listclass);
        
        // Call the sort() method to sort the list
        sort.call($list, settings.ordering);
        
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
                    filter.call($list, $box.val());
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
                    sort.call($list, 'ascending');
                });

            var $desc = $('<img>')
                .addClass('jq-orderly-btn')
                .attr('src', settings.descbtnsrc)
                .click(function() {
                    sort.call($list, 'descending');
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
    };
    
    var sort = function(dir) {
        var $list = this;
        
        // Record the sorting direction
        $list.data('ordering', dir);
        
        // Create a place to store the items
        var items = $list.children('li').get();
        
        // Sort the list
        items.sort(function(a, b) {
            var compA = $(a).text().toUpperCase();
            var compB = $(b).text().toUpperCase();
            return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        });
        
        // Flip the list if we want it to be descending
        if (dir == 'descending') {
            items.reverse();
        }
        
        // Rebuild the sorted list
        $.each(items, function(id, item) {
            $list.append(item);
        });
        
        return $list;
    };
    
    var filter = function(str) {
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
    };
    
    // Define available methods
    var methods = {
        init            : init,
        sort            : sort,
        filter          : filter,
    };
    
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


