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
            
            tabbar                    : true,
            hidetabbar                : false,
            tabbarclass               : 'jq-orderly-tabbar',
            
            filterboxlabel            : 'Type here to filter...',
            filterboxclass            : 'jq-orderly-filterbox',
        };
        // Update default settings with options passed in
        if (options) {
            $.extend(settings, options);
        }
        
        // Set up the list elements
        var $list = this.
            addClass(settings.listclass);
        
        // Record the sorting direction
        $list.data('ordering', settings.ordering);
        
        // Create a place to store the items
        $list.data('items', $list.children('li').get());
        
        // Sort the list
        $list.data('items').sort(function(a, b) {
            var compA = $(a).text().toUpperCase();
            var compB = $(b).text().toUpperCase();
            return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
        });
        
        if (settings.ordering == 'descending') {
            $list.data('items').reverse();
        }
        
        // Rebuild the sorted list
        $.each($list.data('items'), function(idx, itm) {
            $list.append(itm);
        });
        
        // Set up the tab bar
        if (settings.tabbar) {
            var $tabbar = $('<div>')
                .addClass(settings.tabbarclass);
        
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
            
            // Add stuff to the tab bar
            $tabbar
                .append($box)
            
            // Create the show / hide button
            $visiblebtn = $('<img>')
                .addClass('jq-orderly-visiblebtn');
            
            $visiblebtn.click(function() {
                if ($tabbar.is(':visible')) {
                    $tabbar.slideUp();
                    $(this).attr('src', 'img/plus.png');
                } else {
                    $tabbar.slideDown();
                    $(this).attr('src', 'img/minus.png');
                }
            });
            
            // Show the tab bar if necessary
            if (settings.hidetabbar) {
                $tabbar.hide();
                $visiblebtn.attr('src', 'img/plus.png');
            } else {
                $tabbar.show();
                $visiblebtn.attr('src', 'img/minus.png');
            }
            
            $list
                .before($tabbar)
                .before($visiblebtn);
        }

        return this;
    };
    
    var filter = function(str) {
        // Filter the list based on the search string `str`
        var search_string = str.toLowerCase();
        this.children('li').each(function() {
            if ($(this).text().toLowerCase().indexOf(search_string) == -1) {
                $(this).hide();
            } else {
                $(this).show();
            }
        });
    };
    
    // Define available methods
    var methods = {
        init            : init,
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


