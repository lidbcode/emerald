var apiUrl = "http://47.94.159.88:26666/dwxk/api/"

var vm = new Vue({
	el: '#index',
	data: {
		brands: [],
		items: [],
		page: 1,
	}
});

//mui.init({
//	pullRefresh: {
//		container: '#index',
//		up: {
//			auto: false,
//			contentrefresh: '正在加载...',
//			callback: getIndexData
//		}
//	}
//});

mui.init()

mui.plusReady(function(){
	mui('.mui-scroll-wrapper').scroll({
		 scrollX: false,
		 startX: 0,
		 bounce: false,
	});
	getBrandInfo()
})

function getBrandInfo() {
	setTimeout(function() {
		var _this = this
		mui.ajax(apiUrl + 'get_brand_info/', {
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
				_this.vm.brands = this.vm.brands.concat(data)
			}
		})
	}, 1500);
};

function getIndexData() {
	setTimeout(function() {
		var _this = this
		mui('#index').pullRefresh().endPullup((_this.vm.page > 20));
		mui.ajax(apiUrl + 'get_brand_info/', {
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
				alert(data)
				_this.vm.brands = this.vm.brands.concat(data)
				_this.vm.page = this.vm.page + 1;
			}
		})
	}, 1500);
};