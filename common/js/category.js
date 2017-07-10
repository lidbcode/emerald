var apiUrl = "http://47.94.159.88:26666/dwxk/api/"

var category = new Vue({
	el: '#category',
	data: {
		cates: [],
		items: [],
		page: 1,
		is_end: false
		
	}
});

mui.init({
	pullRefresh: {
		container: '#category',
		up: {
			auto: true,
			contentrefresh: '正在加载...',
			callback: getCategoryItems
		}
	}
});

mui.plusReady(function() {
	getCategorInfo();
});

function getCategorInfo() {
	mui.ajax(apiUrl + 'get_category_info', {
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		headers: {
			'Content-Type': 'application/json'
		},
		success: function(data) {
			category.cates = data;
		}
	});
}

function getCategoryItems() {
	setTimeout(function() {
		var _this = this
		mui('#category').pullRefresh().endPullup((_this.category.page > 10));
		mui.ajax(apiUrl + 'get_category_items/-0/' + _this.category.page, {
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
				_this.category.items = this.category.items.concat(data);
				_this.category.page = data?this.category.page + 1:100	
			}
		})
	}, 1500);
};

mui('.item-list').on('tap', '#category-items', function(e) {
	var newWv = plus.webview.create('detail.html', 'detail', {
		bottom: '0px',
		top: '0px'
	}, {
		url: this.dataset.url
	})
	newWv.show();
});

mui('.category-box').on('tap', '#category-info', function(e) {
	var newWv = plus.webview.create('category-single.html', 'category-single', {
		bottom: '0px',
		top: '0px'
	}, {
		cid: this.dataset.cid,
		cname: this.dataset.cname
	})
	newWv.show();
});

mui('.search-btn').on('tap','#btn',function(e){
	var keyword = document.querySelector('input[name="keyword"]').value;
	var newWv = plus.webview.create('search.html','serach',{
		bottom:'0px',
		top:'0px'
	},{
		keyword:keyword
	})
	newWv.show();
});