var apiUrl = "http://47.94.159.88:26666/dwxk/api/"

var vm = new Vue({
	el: '#category-single',
	data: {
		items: [],
		brand_id: "1",
		brand_name: "",
		page: 1,
	}
});

mui.init({
	pullRefresh: {
		container: '#category-single',
		up: {
			auto: true,
			contentrefresh: '正在加载...',
			callback: getBrandSingle
		}
	}
});

mui.plusReady(function() {
	plus.webview.currentWebview().setStyle({
		scrollIndicator: 'none'
	});
	var self = plus.webview.currentWebview();
	this.vm.brand_id = self.brand_id;
	this.vm.brand_name = self.brand_name;
});

function getBrandSingle() {
	setTimeout(function() {
		var _this = this
		mui('#category-single').pullRefresh().endPullup((_this.vm.page > 100));
		mui.ajax(apiUrl + 'get_brand_items/' + _this.vm.brand_id + '/' + _this.vm.page, {
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
				_this.vm.items = this.vm.items.concat(data);
				if(data.length < 10) _this.vm.page = 1000
				else _this.vm.page = this.vm.page + 1
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

mui('.active-input').on('tap', '#img-btn', function(e) {
	var keyword = document.querySelector('input[name="keyword"]').value;
	if(keyword != "") {
		var newWv = plus.webview.create('search.html', 'serach', {
			bottom: '0px',
			top: '0px'
		}, {
			keyword: keyword
		})
		newWv.show();
	}
});

function enterSearch(e) {
	if(e.keyCode == 13) {
		var keyword = document.querySelector('input[name="keyword"]').value;
		if(keyword != "") {
			var newWv = plus.webview.create('search.html', 'serach', {
				bottom: '0px',
				top: '0px'
			}, {
				keyword: keyword
			})
			newWv.show();
		}
	}
}