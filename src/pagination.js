/*
 * pagination.js 2.1.0
 * A jQuery plugin to provide simple yet fully customisable pagination.
 * https://github.com/superRaytin/paginationjs
 *
 * Homepage: http://pagination.js.org
 *
 * Copyright 2014-2100, superRaytin
 * Released under the MIT license.
 */

(function (global, $) {

    if (typeof $ === 'undefined') {
        throwError('Pagination requires jQuery.');
    }

    var pluginName = 'pagination';

    // Conflict, use backup
    if ($.fn.pagination) {
        pluginName = 'pagination2';
    }

    $.fn[pluginName] = function (options) {

        if (typeof options === 'undefined') {
            return this;
        }

        var container = $(this);
        var attributes = $.extend({}, $.fn[pluginName].defaults, options);

        var pagination = {
            initialize: function () {
                var self = this;

                // Cache attributes of current instance
                if (!container.data('pagination')) {
                    container.data('pagination', {});
                }

                // Pagination has been initialized, destroy it
                if (container.data('pagination').initialized) {
                    $('.paginationjs', container).remove();
                }

                // Will be passed to the callback function
                var model = self.model = {
                    pageRange: attributes.pageRange,
                    pageSize: attributes.pageSize
                };

                model.totalNumber = attributes.totalNumber;

                // Have only one page
                if (attributes.hideWhenLessThanOnePage) {
                    if (self.getTotalPage() <= 1) return;
                }

                var el = self.render(true);

                // Add extra className
                if (attributes.className) {
                    el.addClass(attributes.className);
                }

                model.el = el;

                // Append pagination element to container
                container[attributes.position === 'bottom' ? 'append' : 'prepend'](el);

                // Add initialization flag
                container.data('pagination').initialized = true;
            },

            render: function () {
                var self = this;
                var model = self.model;
                var el = model.el || $('<div class="paginationjs"></div>');

                var currentPage = model.pageNumber || attributes.pageNumber;
                var pageRange = attributes.pageRange;
                var totalPage = self.getTotalPage();

                var rangeStart = currentPage - pageRange;
                var rangeEnd = currentPage + pageRange;

                if (rangeEnd > totalPage) {
                    rangeEnd = totalPage;
                    rangeStart = totalPage - pageRange * 2;
                    rangeStart = rangeStart < 1 ? 1 : rangeStart;
                }

                if (rangeStart <= 1) {
                    rangeStart = 1;
                    rangeEnd = Math.min(pageRange * 2 + 1, totalPage);
                }

                el.html(self.createTemplate({
                    currentPage: currentPage,
                    pageRange: pageRange,
                    rangeStart: rangeStart,
                    rangeEnd: rangeEnd
                }));

                return el;
            },

            // Create template
            createTemplate: function (args) {
                var self = this;
                var currentPage = args.currentPage;
                var totalPage = self.getTotalPage();
                var rangeStart = args.rangeStart;
                var rangeEnd = args.rangeEnd;

                var pageLink = attributes.pageLink;
                var prevText = attributes.prevText;
                var nextText = attributes.nextText;

                var ulClassName = attributes.ulClassName;

                var html = '';
                var i;

                html += '<nav class="pagination ' + attributes.navClassName + '" role="navigation" aria-label="pagination">';

                // Previous page button
                // noinspection EqualityComparisonWithCoercionJS
                if (currentPage == 1) {
                    html += '<a class="pagination-previous" disabled="disabled">' + prevText + '<\/a>';
                } else {
                    html += '<a class="pagination-previous" href="' + pageLink + (Number(currentPage) - 1) + '">' + prevText + '<\/a>';
                }

                if (ulClassName) {
                    html += '<ul class="' + ulClassName + '">';
                } else {
                    html += '<ul>';
                }

                // Page numbers
                if (rangeStart <= 3) {
                    for (i = 1; i < rangeStart; i++) {
                        // noinspection EqualityComparisonWithCoercionJS
                        if (i == currentPage) {
                            html += '<li data-num="' + i + '"><a class="pagination-link is-current">' + i + '<\/a><\/li>';
                        } else {
                            html += '<li data-num="' + i + '"><a class="pagination-link" href="' + pageLink + (i) + '">' + i + '<\/a><\/li>';
                        }
                    }
                } else {
                    if (attributes.showFirstOnEllipsisShow) {
                        html += '<li data-num="1"><a class="pagination-link" href="' + pageLink + '1">1<\/a><\/li>';
                    }
                    html += '<li><span class="pagination-ellipsis">&hellip;<\/span><\/li>';
                }

                // Main loop
                for (i = rangeStart; i <= rangeEnd; i++) {
                    // noinspection EqualityComparisonWithCoercionJS
                    if (i == currentPage) {
                        html += '<li data-num="' + i + '"><a class="pagination-link is-current">' + i + '<\/a><\/li>';
                    } else {
                        html += '<li data-num="' + i + '"><a class="pagination-link" href="' + pageLink + +(i) + '">' + i + '<\/a><\/li>';
                    }
                }

                if (rangeEnd >= totalPage - 2) {
                    for (i = rangeEnd + 1; i <= totalPage; i++) {
                        html += '<li data-num="' + i + '"><a class="pagination-link" href="' + pageLink + (i) + '">' + i + '<\/a><\/li>';
                    }
                } else {
                    html += '<li><span class="pagination-ellipsis">&hellip;<\/span><\/li>';

                    if (attributes.showLastOnEllipsisShow) {
                        html += '<li data-num="' + totalPage + '"><a class="pagination-link" href="' + pageLink + totalPage + '">' + totalPage + '<\/a><\/li>';
                    }
                }

                html += '<\/ul>';

                // Next page button
                // noinspection EqualityComparisonWithCoercionJS
                if (currentPage == totalPage) {
                    html += '<a class="pagination-next" disabled="disabled">' + nextText + '<\/a>';
                } else {
                    html += '<a class="pagination-next" href="' + pageLink + (Number(currentPage) + 1) + '">' + nextText + '<\/a>';
                }

                html += '<\/nav>';

                return html;
            },

            // Get total number
            getTotalNumber: function () {
                return this.model.totalNumber || attributes.totalNumber || 1;
            },

            // Get total page
            getTotalPage: function () {
                return Math.ceil(this.getTotalNumber() / attributes.pageSize);
            }
        };

        pagination.initialize();

        return this;
    };

    // Instance defaults
    $.fn[pluginName].defaults = {

        // Total entries
        totalNumber: 1,

        // Default page
        pageNumber: 1,

        // entries of per page
        pageSize: 10,

        // Page range (pages on both sides of the current page)
        pageRange: 2,

        // Page link
        pageLink: '',

        // 'Previous' text
        prevText: '&laquo;',

        // 'Next' text
        nextText: '&raquo;',

        // Additional className for Pagination element
        className: '',

        // Default active class
        activeClassName: '',

        // Default disable class
        disableClassName: '',

        ulClassName: '',

        // Pagination element's position in the container
        // position: 'bottom',

        //Nav-Tag additional css classes
        navClassName: '',

        // Whether to hide pagination when less than one page
        hideWhenLessThanOnePage: false,

        showFirstOnEllipsisShow: true,

        showLastOnEllipsisShow: true,
    };

    // ============================================================
    // helpers
    // ============================================================

    // Throw error
    function throwError(content) {
        throw new Error('Pagination: ' + content);
    }

    /*
     * export via AMD or CommonJS
     * */
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return $;
        });
    }

})(this, window.jQuery);