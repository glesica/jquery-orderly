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
            ordering                  : 'ascending',
            
            listclass                 : 'jq-orderly',
            
            controlbar                : false,
            hidecontrolbar            : false,
            controlbarclass           : 'jq-orderly-controlbar',
            
            filterboxlabel            : 'Type here to filter...',
            filterboxclass            : 'jq-orderly-filterbox',

            ascbuttonsrc              : 'img/plus.png',
            descbuttonsrc             : 'img/minus.png',
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
                .addClass(settings.filterboxclass);
            
            $box.keyup(function() {
                filter.call($list, $box.val());
            });
            $box.focus(function() {
                if ($box.val() == settings.filterboxlabel) {
                    $box.val('');
                }
            });
            $box.blur(function() {
                if ($box.val() == '') {
                    $box.val(settings.filterboxlabel);
                }
            });

            // Create the ascending and descending links
            var $asc = $('<img>')
                .addClass('jq-orderly-btn')
                .attr('src', settings.ascbuttonsrc);

            var $desc = $('<img>')
                .addClass('jq-orderly-btn')
                .attr('src', settings.descbuttonsrc);
            
            // Add stuff to the tab bar
            $controlbar
                .append($box)
                .append($asc)
                .append($desc);
            
            // Create the show / hide button
            $visiblebtn = $('<img>')
                .addClass('jq-orderly-btn')
                .addClass('jq-orderly-visiblebtn');
            
            $visiblebtn.click(function() {
                if ($controlbar.is(':visible')) {
                    $controlbar.slideUp();
                    $(this).attr('src', settings.showbtnsrc);
                } else {
                    $controlbar.slideDown();
                    $(this).attr('src', settings.hidebtnsrc);
                }
            });
            
            // Show the tab bar if necessary
            if (settings.hidecontrolbar) {
                $controlbar.hide();
                $visiblebtn.attr('src', settings.showbtnsrc);
            } else {
                $controlbar.show();
                $visiblebtn.attr('src', settings.hidebtnsrc);
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


