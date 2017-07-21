var apiUrl = "http://47.94.159.88:26666/dwxk/api/"

var vm = new Vue({
	el: '#packet',
	data: {
		items: [],
		page: 1,
	}
});

mui.init({
	pullRefresh: {
		container: '#packet',
		up: {
			auto: true,
			contentrefresh: '正在加载...',
			callback: getPacketSingle
		}
	}
});

mui.plusReady(function() {
	plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
});

function getPacketSingle() {
	setTimeout(function() {
		var _this = this
		mui('#packet').pullRefresh().endPullup((_this.vm.page > 10));
		mui.ajax(apiUrl + 'get_packet_items/' + _this.vm.page, {
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
				_this.vm.items = this.vm.items.concat(data);
				_this.vm.page = this.vm.page + 1;
			}
		})
	}, 1500);
};

mui('.item-list').on('tap', '#category-items', function(e) {
	var newWv = plus.webview.create('detail.html', 'detail', {
		bottom: '50px',
		top: '0px'
	}, {
		url: this.dataset.url
	})
	newWv.show()
})