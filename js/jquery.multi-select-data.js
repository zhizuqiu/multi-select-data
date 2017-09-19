/**
 * Created by zhizuqiu on 2017/8/29.
 */

function MultiSelect(elem, index, textField, selectFlag) {
    this.RESULT_ALL = [];
    this.RESULT_SELECT = [];
    this.YUAN_ALL = [];
    this.YUAN_SELECT = [];
    this.events = [];
    this.elem = elem;
    this.index = index;
    this.selectFlag = selectFlag;
    this.textField = textField;
}

MultiSelect.prototype = {
    _initSelect: function (sup) {
        sup.elem.multiSelect({
            selectableHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='search...'>",
            selectionHeader: "<input type='text' class='form-control search-input' autocomplete='off' placeholder='search...'>",
            afterInit: function (ms) {
                var that = this,
                    $selectableSearch = that.$selectableUl.prev(),
                    $selectionSearch = that.$selectionUl.prev(),
                    selectableSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selectable:not(.ms-selected)',
                    selectionSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selection.ms-selected';

                that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
                    .on('keydown', function (e) {
                        if (e.which === 40) {
                            that.$selectableUl.focus();
                            return false;
                        }
                    });

                that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
                    .on('keydown', function (e) {
                        if (e.which == 40) {
                            that.$selectionUl.focus();
                            return false;
                        }
                    });
            },
            afterSelect: function (values) {
                this.qs1.cache();
                this.qs2.cache();
                var arr = [];
                for (x in values) {
                    for (y in sup.RESULT_ALL) {
                        if (sup.RESULT_ALL.hasOwnProperty(y)) {
                            if (sup.RESULT_ALL[y][sup.index] == values[x]) {
                                arr.push(sup.RESULT_ALL[y]);
                                sup.RESULT_SELECT.push(sup.RESULT_ALL[y]);
                                sup.RESULT_ALL.splice(y, 1);
                            }
                        }
                    }
                }
                sup._fire('afterSelect', arr);
            },
            afterDeselect: function (values) {
                this.qs1.cache();
                this.qs2.cache();
                var arr = [];
                for (x in values) {
                    for (y in sup.RESULT_SELECT) {
                        if (sup.RESULT_SELECT.hasOwnProperty(y)) {
                            if (sup.RESULT_SELECT[y][sup.index] == values[x]) {
                                arr.push(sup.RESULT_SELECT[y]);
                                sup.RESULT_ALL.push(sup.RESULT_SELECT[y]);
                                sup.RESULT_SELECT.splice(y, 1);
                            }
                        }
                    }
                }
                sup._fire('afterDeselect', arr);
            }
        });
    },
    onEvent: function (type, fn) {
        if (typeof this.events[type] === 'undefined') {
            this.events[type] = [fn];
        } else {
            this.events[type].push(fn);
        }
    },
    _fire: function (type, event) {
        if (!this.events[type]) {
            return;
        }
        var i = 0,
            len = this.events[type].length;
        for (; i < len; i++) {
            this.events[type][i].call(this, event);
        }
    },
    init: function (RESULT_ALL) {

        this.empty();

        this.RESULT_ALL = RESULT_ALL;

        this.elem.multiSelect('destroy');
        this.elem.empty();
        this._initSelect(this);

        var selects = [], i = 0;
        for (x in this.RESULT_ALL) {
            this.elem.multiSelect('addOption', {
                value: this.RESULT_ALL[x][this.index],
                text: this.RESULT_ALL[x][this.textField]
            });
            if (this.RESULT_ALL[x][this.selectFlag.name] == this.selectFlag.select) {
                selects[i++] = this.RESULT_ALL[x][this.index];
            }
        }

        this.elem.multiSelect('select', selects);
        this.YUAN_ALL = jQuery.extend(true, {}, this.RESULT_ALL);
        this.YUAN_SELECT = jQuery.extend(true, {}, this.RESULT_SELECT);
        this.elem.multiSelect('refresh');    //让快速搜索功能生效
    },
    empty: function () {
        this.RESULT_ALL = [];
        this.RESULT_SELECT = [];
        this.YUAN_ALL = [];
        this.YUAN_SELECT = [];

        this.clear();
        this.elem.multiSelect('destroy');
        this.elem.empty();
        this._initSelect(this);
    },
    selectAll: function () {
        if (this.RESULT_ALL.length > 0) {
            this.elem.multiSelect('select_all');
        }
    },
    unSelectAll: function () {
        if (this.RESULT_SELECT.length > 0) {
            this.elem.multiSelect('deselect_all');
        }
    },
    clear: function () {
        this.RESULT_ALL.splice(0, this.RESULT_ALL.length);
        this.RESULT_SELECT.splice(0, this.RESULT_SELECT.length);
    },
    getOrigin: function () {
        var origin = [];
        origin.push(this.YUAN_ALL);
        origin.push(this.YUAN_SELECT);
        return origin;
    },
    getUpdate: function (filterName) {
        if (filterName == null) {
            filterName = this.index;
        }
        var arr = [];
        var select_map = [];
        for (x in this.RESULT_SELECT) {
            select_map[this.RESULT_SELECT[x][filterName]] = 1;
        }
        for (y in this.YUAN_SELECT) {
            if (select_map[this.YUAN_SELECT[y][filterName]] == 1) {
                arr.push(this.YUAN_SELECT[y]);
            }
        }
        return arr;
    },
    getDelete: function (filterName) {
        if (filterName == null) {
            filterName = this.index;
        }
        var arr = [];
        var select_map = [];
        for (x in this.YUAN_SELECT) {
            select_map[this.YUAN_SELECT[x][filterName]] = 1;
        }
        for (x in this.RESULT_SELECT) {
            if (select_map[this.RESULT_SELECT[x][filterName]] == 1) {
                select_map[this.RESULT_SELECT[x][filterName]] = 0;
            }
        }
        for (x in this.YUAN_SELECT) {
            if (select_map[this.YUAN_SELECT[x][filterName]] == 1) {
                arr.push(this.YUAN_SELECT[x]);
            }
        }
        return arr;
    },
    getAdd: function (filterName) {
        if (filterName == null) {
            filterName = this.index;
        }
        var arr = [];
        var select_map = [];
        for (x in this.RESULT_SELECT) {
            select_map[this.RESULT_SELECT[x][filterName]] = 1;
        }
        for (x in this.YUAN_SELECT) {
            if (select_map[this.YUAN_SELECT[x][filterName]] == 1) {
                select_map[this.YUAN_SELECT[x][filterName]] = 0;
            }
        }
        for (x in this.RESULT_SELECT) {
            if (select_map[this.RESULT_SELECT[x][filterName]] == 1) {
                arr.push(this.RESULT_SELECT[x]);
            }
        }
        return arr;
    }
};