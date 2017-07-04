var apiUrl = "http://47.94.159.88:26666/dwxk/api/"

var vm = new Vue({
	el: '#index',
	data: {
		brands:[],
		items: [],
		page: 1,
	}
});

mui.init({
	pullRefresh: {
		container: '#index',
		up: {
			auto: true,
			contentrefresh: '正在加载...',
			callback: getIndexData
		}
	}
});

function getIndexData() {
	setTimeout(function() {
		var _this = this
		mui('#index').pullRefresh().endPullup((_this.vm.page > 20));
		mui.ajax(apiUrl + 'get_brand_info/' + _this.vm.page, {
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
//				alter(_this.vm.page)
				_this.vm.brands = data;
				_this.vm.page = this.vm.page + 1;
			}
		})
	}, 1500);
};