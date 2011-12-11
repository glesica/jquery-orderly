#  Project: jQuery-Orderly
#  Description: A jQuery plugin for sorting lists and tables.
#  Author: George Lesica <glesica@gmail.com>
#  License: MIT

``

(($, window, document) ->
    # window and document are passed through as local variables rather than globals
    # as this (slightly) quickens the resolution process and can be more efficiently
    # minified (especially when both are regularly referenced in your plugin).

    # Create the defaults once
    pluginName = 'orderly'
    defaults =
        direction   : 'ascending' # Initial sort direction

        listclass   : 'orderly' # Class(es) to add to sorted lists
        tableclass  : 'orderly' # Class(es) to add to sorted tables
        
        buttonclass : 'orderly-button' # Class(es) to apply to buttons

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

    # The actual plugin constructor
    class Plugin
        constructor: (@element, options) ->
            @options = $.extend({}, defaults, options)

            @_defaults = defaults
            @_name = pluginName

            @init()

        init: () ->
            switch $(@element).get(0).nodeName.toLowerCase()
                when 'table'
                    @setupTable()
                when 'ul'
                    @setupList()
                else
                    $.error 'Orderly: DOM element not supported.'
        
        setupList: () ->
            # Initializes a list for ordering.
            
            if @options.toolbar
                # Toolbar container. The toolbar contains buttons 
                # to re-order the list and a textbox that allows 
                # the list to be filtered based on text entered 
                # by the user.
                $toolbar = $('<div>')
                    .addClass(@options.toolbarclass)
                
                # Filter box
                $filter = $("""
                    <input 
                        type="text" 
                        value="#{@options.filterlabel}"
                        class="#{@options.filterclass}"
                    />
                """)
                    .keyup () =>
                        @filterList($filter.val())
                    .focus () =>
                        if $filter.val() is @options.filterlabel
                            $filter.val('')
                    .blur () ->
                        if $filter.val() is ''
                            $filter.val(@options.filterlabel)
            
                # Ascending and descending buttons
                $asc = $("""
                    <button class="#{@options.buttonclass}">
                        <img src="#{@options.ascbtnsrc}" />
                    </button>
                """)
                    .click () =>
                        @sortList('ascending')
                
                $desc = $("""
                    <button class="#{@options.buttonclass}">
                        <img src="#{@options.descbtnsrc}" />
                    </button>
                """)
                    .click () =>
                        @sortList('descending')
                
                # Add everything to the actual toolbar
                $toolbar
                    .append($filter)
                    .append(' ')
                    .append($asc)
                    .append(' ')
                    .append($desc)
            
                # Show / hide button
                $toggle = $("""
                    <button class="#{@options.buttonclass} orderly-visible">
                        <img src="" />
                    </button>
                """)
                    .click () =>
                        if $toolbar.is(':visible')
                            $toolbar.slideUp()
                            $toggle.children('img').attr('src', @options.showbtnsrc)
                        else
                            $toolbar.slideDown()
                            $toggle.children('img').attr('src', @options.hidebtnsrc)
                            
                # Show the tab bar if necessary
                if @options.showtoolbar
                    $toolbar.show()
                    $toggle.children('img').attr('src', @options.hidebtnsrc)
                else
                    $toolbar.hide()
                    $toggle.children('img').attr('src', @options.showbtnsrc)
            
            # Sort the list
            @sortList(@options.direction)
            
            # Return the list
            $(@element)
                .before($toggle)
                .before($toolbar)
                .addClass(@options.listclass)
                
        sortList: (direction) ->
            # Sorts a list in the given `direction`, either 'ascending' 
            # or 'descending'.
            
            $list = $(@element)
            
            items = $list.children('li').get()
            items.sort (a, b) ->
                compA = $(a).text().toLowerCase()
                compB = $(b).text().toLowerCase()
                if compA < compB
                    -1
                else if compA > compB
                    1
                else
                    0
            
            if direction is 'descending'
                items.reverse()
            
            # Rebuild the list now that it is sorted
            $.each(items, (id, item) ->
                $list.append(item)
            )

            $list
        
        filterList: (query) ->
            # Filters a list based on a search string `query`.
    
            $list = $(@element)
            
            $list.children('li').each () ->
                $item = $(@)
                if $item.text().toLowerCase().indexOf(query.toLowerCase()) is -1
                    $item.hide()
                else
                    $item.show()
        
        setupTable: () ->
            # Initial setup for a table

            @sortColumn = @options.sortcolumn
            @sortDirection = @options.direction

            # Add classes and data to keep track of sort column and 
            # direction for subsequent calls.
            $table = $(@element)
                .addClass(@options.tableclass)

            # Add interface stuff to table so clicking on a column 
            # sorts by that column and such and such.
            $.each $table.find('th'), (id, item) =>
                $(item).click () =>
                    if @sortColumn is id
                        if @sortDirection is 'ascending'
                            dir = 'descending'
                        else
                            dir = 'ascending'
                    else
                        dir = 'ascending'
                    
                    @sortTable(dir, id)
            
            @sortTable(@options.ordering, @options.sortcolumn)
        
        sortTable: (direction, column) ->
            # Sorts the table in `direction` using `column`.
        
            @sortColumn = column
            @sortDirection = direction
            
            $tbody = $(@element).children('tbody')
            
            items = $tbody.children('tr').get()
            items.sort (a, b) ->
                compA = $(a).children('td').get(column).innerHTML
                compB = $(b).children('td').get(column).innerHTML
                if compA < compB
                    -1
                else if compA > compB
                    1
                else
                    0
            
            if direction is 'descending'
                items.reverse()
            
            $.each items, (id, item) ->
                $tbody.append(item)
            
            if @options.callback?
                @options.callback(@)
            
            $(@element)

        filterTable: (query) ->
            # Filter a table: `query` is a search string to look for. 
            # Rows that do not contain the search string (case-insensitive) 
            # will be hidden.
            
            query = query.toLowerCase()
            $.each $(@element).find('tbody tr'), (row_id, row) =>
                $row = $(row)
                $.each $row.children('td'), (col_id, cell) =>
                    value = $(cell).text().toLowerCase()
                    if value.indexOf(query) == -1
                        $row.hide()
                    else
                        $row.show()

    # A really lightweight plugin wrapper around the constructor,
    # preventing against multiple instantiations
    $.fn[pluginName] = (options) ->
        @each ->
            if not $.data(this, "plugin_#{pluginName}")
                $.data(@, "plugin_#{pluginName}", new Plugin(@, options))
)(jQuery, window, document)



