var apiUrl = "http://47.94.159.88:26666/dwxk/api/"

var vm = new Vue({
	el: '#search',
	data: {
		items: [],
		page: 1,
		keyword: "",
		no_result: false
	}
});

mui.init({
	pullRefresh: {
		container: '#search',
		up: {
			auto: false,
			contentrefresh: '正在加载...',
			contentup: '',
			callback: getSearchItems
		}
	}
});

mui.plusReady(function() {
	plus.webview.currentWebview().setStyle({
		scrollIndicator: 'none'
	});
	var self = plus.webview.currentWebview()
	this.vm.keyword = self.keyword
	initSearchItems();
});

function getSearchItems() {
	setTimeout(function() {
		var _this = this
		var postUrl = ""
		if(_this.vm.keyword) {
			postUrl = apiUrl + 'get_search_items/' + _this.vm.keyword + '/' + _this.vm.page
		} else {
			postUrl = apiUrl + 'get_category_items/' + _this.vm.page
		}
		mui.ajax(postUrl, {
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
				_this.vm.items = this.vm.items.concat(data);
				_this.vm.page = (data.length < 10) ? 1000 : (this.vm.page + 1)
			}
		})
		mui('#search').pullRefresh().endPullup((_this.vm.page > 100));
	}, 1500);
};

function initSearchItems() {
	setTimeout(function() {
		var _this = this
		var postUrl = ""
		if(_this.vm.keyword) {
			postUrl = apiUrl + 'get_search_items/' + _this.vm.keyword + '/' + _this.vm.page
		} else {
			postUrl = apiUrl + 'get_category_items/-0/' + _this.vm.page
		}
		mui.ajax(postUrl, {
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
				_this.vm.items = this.vm.items.concat(data)
				_this.vm.page = (data.length < 10) ? 1000 : (this.vm.page + 1)
				if(data.length == 0) {
					_this.vm.no_result = true
					_this.vm.keyword = ""
					_this.vm.page = 1
					mui.ajax(apiUrl + 'get_category_items/-0/' + _this.vm.page, {
						dataType: 'json',
						type: 'get',
						timeout: 10000,
						headers: {
							'Content-Type': 'application/json'
						},
						success: function(data) {
							_this.vm.items = this.vm.items.concat(data);
							_this.vm.page = this.vm.page + 1
						}
					})
				}
			}
		})
	})
}

mui('.item-list').on('tap', '#category-items', function(e) {
	var newWv = plus.webview.create('detail.html', 'detail', {
		bottom: '0px',
		top: '0px'
	}, {
		url: this.dataset.url
	})
	newWv.show();
});

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