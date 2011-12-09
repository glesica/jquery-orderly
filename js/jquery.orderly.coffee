###
    jquery-orderly
    A list sorting plugin for jQuery implemented in Coffeescript 
    because I'm a wannabe hipster coder.
    George Lesica <glesica@gmail.com>
###

(($) ->
    
    init = (options) =>
        # Default options.
        settings = 
            direction   : 'ascending' # Initial sort direction
            
            listclass   : 'orderly' # Class(es) to add to sorted lists
            tableclass  : 'orderly' # Class(es) to add to sorted tables
            
            sortcolumn  : 0 # Column to sort on for sorted tables, 0-indexed
            sortcallback: null # Function to call after sorting, passes $(table)
            
            toolbar     : false # Create a toolbar for sorted lists
            showtoolbar : true # Show the toolbar (when created) by default
            toolbarclass: 'orderly-toolbar' # Class(es) to add to toolbar
            
            filterlabel : 'Type here to filter...' # Label for filter textbox
            filterclass : 'orderly-filter' # Class(es) to add to filter textbox
            
            ascbtnsrc   : 'img/up.png', # Image src for ascend sort button
            descbtnsrc  : 'img/down.png', # Image src for descend sort button
            showbtnsrc  : 'img/plus.png', # Image src for show toolbar button
            hidebtnsrc  : 'img/minus.png' # Image src for hide toolbar button
        
        # Extend defaults with options passed in.
        $.extend(settings, options)
        
        $target = this
        
        # Iterate over the elements we have received and call the 
        # appropriate setup method for each, depending on the type of 
        # tag.
        $target.each () =>
            $next = $(this)
            tagname = $next.get(0).nodeName.toLowerCase()
            
            if tagname == 'table'
                setupTable.call $next, settings
            else if tagname == 'ul'
                setupList.call $next, settings
            else
                console.error 'Orderly: DOM element not supported.'
        
        # Return the target elements to maintain chainability.
        $target
    
    setupList = (settings) => #TODO: Does this need to be a fat arrow?
        # Sets up a list for ordering.
        
        # Housekeeping on the list, add classes and record the type (ex: 
        # 'list', 'table').
        $list = this
            .addClass settings.listclass
            .data 'orderly.type', 'list'
        
        if settings.toolbar
            # Toolbar container
            $toolbar = $('<div>')
                .addClass settings.toolbarclass
            
            # Filter box
            $filter = $('<input>')
                .attr 'type', 'text'
                .attr 'value', settings.filterlabel
                .addClass settings.filterclass
                .keyup () =>
                    filterList.call $list, $filter.val()
                .focus () =>
                    if $filter.val() is settings.filterlabel
                        $filter.val ''
                .blur () =>
                    if $filter.val() is ''
                        $filter.val settings.filterlabel
        
            # Ascending and descending buttons
            $asc = $('<img>')
                .addClass 'orderly-button'
                .attr 'src', settings.ascbtnsrc
                .click () =>
                    sortList.call $list, 'ascending'
            
            $desc = $('<img>')
                .addClass 'orderly-button'
                .attr 'src', settings.descbtnsrc
                .click () =>
                    sortList.call $list, 'descending'
            
            # Add everything to the actual toolbar
            $toolbar
                .append $filter
                .append $asc
                .append $desc
        
            # Show / hide button
            $toggle = $('<img>')
                .addClass 'orderly-button'
                .addClass 'orderly-visible'
                .click () =>
                    if $toolbar.is ':visible'
                        $toolbar.slideUp()
                        $(this).attr 'src', settings.showbtnsrc
                    else
                        $toolbar.slideDown()
                        $(this).attr 'src', settings.hidebtnsrc
        
            $list
                .before $toolbar
                .before $toggle
        
        # Sort the list
        sortList.call $list, settings.direction
        
        # Return the list
        $list
    
    sortList = (direction) =>
        # Sorts a list in the given `direction`.
        
        $list = this
        $list.data 'ordering.direction', direction
        
        items = $list.children('li').get()
        items.sort (a, b) ->
            compA = $(a).text().toLowerCase()
            compB = $(b).text().toLowerCase()
            (compA < compB) ? -1 : (compA > compB) ? 1 : 0
        
        if direction is 'descending'
            items.reverse()
        
        # Rebuild the list now that it is sorted
        $.each items, (id, item) ->
            $list.append(item)
        
        # Return list
        $list
    
    filterList = (str) =>
        # Filters a list based on a search string `str`.
        
        $list = this
        query = str.toLowerCase()
        
        $list.children('li').each () =>
            $item = $(this)
            if $item.text().toLowerCase().indexOf(query) is -1
                $item.hide()
            else
                $item.show()
        
        # Return list
        $list
    
    methods = 
        init        : init
        # Lists (<ul>)
        setupList   : setupList
        sortList    : sortList
        filterList  : filterList
    
    $.fn.orderly = (method, options) =>
        methods[method](options)
    
)(jQuery)

###

###


