var sw_anchors = {};
var urlSearchParams = new URLSearchParams(window.location.search);
var sw_timer;

$(document).ready(function() {
    init_col_sections();
    init_switchers();
    handleSwitcherParam();
    initViewerJS();
    var TABLE_SORT = window.TABLE_SORT;
    if (TABLE_SORT) {
        addTableSort();
    }
});


function addTableSort() {
    var tables = $('table.table');
    tables.each(function() {
        var table = $(this);
        var headings = table.find('th');
        headings.each(function() {
            var th = $(this);
            var index = th.index();
            var sortBtn = $('<span class="sort-btn"></span>');
            th.addClass('sort-header');
            th.click(function(){
                var counter = 0;
                sortBtn.addClass('sort-active');
                sortBy = sortBtn.data('sortby');
                var trs = table.find('tbody tr');
                sortBtn.toggleClass('ascending');
                trs.sort(function(item1, item2) {
                    
                    if (sortBtn.hasClass('ascending')) {
                        var text1 = $(item1).find('td').eq(index).text();
                        var text2 = $(item2).find('td').eq(index).text();
                    }
                    else {
                        var text1 = $(item2).find('td').eq(index).text();
                        var text2 = $(item1).find('td').eq(index).text();
                    }
                    // try converting to num
                    var _text1 = parseFloat(text1);
                    var _text2 = parseFloat(text2);

                    if (!isNaN(_text1) && !isNaN(_text2)) {
                        text1 = _text1;
                        text2 = _text2;
                    }
                    if (text1 > text2) {
                        return 1;
                    }
                    else if (text1 < text2) {
                        return -1;
                    }
                    else {
                        return 0;
                    }
                }).map(function() {
                    var row = $(this);
                    if (counter % 2 === 0) {
                        row.removeClass('row-odd');
                        row.addClass('row-even');
                    }
                    else {
                        row.removeClass('row-even');
                        row.addClass('row-odd');
                    }
                    counter++;
                    table.find('tbody').append(row);
                });

                headings.each(function() {
                    if ($(this).index() !== index) {
                        $(this).find('.sort-btn').removeClass('ascending');
                        $(this).find('.sort-btn').removeClass('sort-active');
                    }
                });
            });
            th.find('p').append(sortBtn);
        });
    });
}

function initViewerJS() {
    try {
        var images =$('main img[src*="_images"]');
        images.each(function() {
            try{
                new Viewer($(this).get(0));
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    catch(err) {
        console.log(err);
    }
}

function init_col_sections() {
    var collapsible_sections = $('div.collapsible-section');
    collapsible_sections.each(function() {
        try {
            var title = $(this).data('title') || 'Click to expand';
            var summary = $('<summary>' + title + '</summary>');
            // summary.html(title);
            var details = $('<details class="col-sect-details"></details>');
            $(this).wrap(details);
            summary.insertBefore($(this));
        }
        catch(err) {
            console.log(err);
        }
    });
}

function handleSwitcherParam() {
    var sw_type = urlSearchParams.get('sw_type');
    var section_id;
    if (sw_type && sw_type in sw_anchors) {
        section_id = sw_anchors[sw_type];
    }
    else {
        section_id = sw_anchors['default'];
    }
    $('.reference.internal.nav-link[href="#' + section_id + '"]').parent('li').css('display', 'block');
    $('#' + section_id).css('display', 'block');
    $('#button-' + section_id).removeClass('bttn-prm')
    $('#button-' + section_id).addClass('bttn-act');
    $('#button-' + section_id).attr('style', 'color: #fff !important');
}

function init_switchers() {
    var switcherAnchors = $('.switcher-anchor');
    if (switcherAnchors.length === 0) {
        return
    }
    var switcherPanel = $('<div></div>');
    switcherPanel.addClass('switcher-set');
    for (var i = 0; i < switcherAnchors.length; i++) {
        var anchor = $(switcherAnchors[i]);
        var option = $(anchor).text();
        var id = $(anchor).attr('id');
        var link = $('<a></a>');
        link.text(option);
        link.attr('href', '?sw_type=' + id);
        link.addClass('button bttn-prm button-size-m');
        switcherPanel.append(link);
        var section = $(anchor).parent('div.section');
        section.css('display', 'none');
        var section_id = section.attr('id');
        link.attr('id', 'button-' + section_id);
        $('.reference.internal.nav-link[href="#' + section_id + '"]').parent('li').css('display', 'none');
        section.addClass('switcher-content');
        sw_anchors[id] = section_id;
        if (i === 0) {
            sw_anchors['default'] = section_id;
        }
    }

    $('main').prepend(switcherPanel);
    switcherAnchors.remove();
}
