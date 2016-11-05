const getAllTerminals = () => {
    var that = this;
    $.get(`${ServerIp}/terminals`, {
        s: 10000
    }, repo => {
        that.$set(that, 'terminalsAll', repo.list);
        setTimeout(() => {
            //  Select2
            var $select2 = $(".select2_single_terminals_all");
            if ($($select2[0])) {
                $select2.select2({
                    placeholder: "选择厂商",
                    allowClear: true
                });
                $select2.on('change', evt => {
                    that.getTerminals($select2.val());
                    that.$set(that, 'terminalId', $select2.val())
                });
                that.getTerminals();
            }
        });
    });
}