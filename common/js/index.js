var apiUrl = "http://47.94.159.88:26666/dwxk/api/"

var vm = new Vue({
	el: '#index',
	data: {
		banners: [],
		start_banner_url: "",
		end_banner_url: "",
		brands: [],
		init_items: [],
		items: [],
		page: 1,
		current_version: 0,
	}
});

mui.init({
	pullRefresh: {
		container: '#index',
		up: {
			auto: true,
			contentrefresh: '正在加载...',
			callback: getBrandItems
		}
	}
});

mui.plusReady(function() {
	plus.webview.currentWebview().setStyle({
		scrollIndicator: 'none'
	});
	mui('.mui-scroll-wrapper').scroll({
		scrollX: false,
		startX: 0,
		bounce: false,
	});
	mui('.banner-slider').slider({
		interval: 3000
	});
	mui('.brand-slider').slider({
		interval: 2000
	});
	updateVersion();
	getBannerInfo();
	getBrandInfo();
})

function updateVersion() {
	var the_last_version = ''
	var _this = this
	mui.ajax(apiUrl + 'get_last_version/', {
		dataType: 'json',
		type: 'get',
		timeout: 10000,
		headers: {
			'Content-Type': 'application/json'
		},
		success: function(data) {
			the_last_version = data
			if(the_last_version > _this.vm.current_version) download()
		}
	})
}

function download() {
	plus.nativeUI.confirm("您当前不是最新版本，是否需要升级", function(e) {
		if(e.index == 0) {
			plus.nativeUI.showWaiting("正在下载最新版本的安装包...")
			var url = "http://47.94.159.88:26666/static/quankaixin.apk"
			plus.downloader.createDownload(url, {
				filename: "quankaixin/version/"
			}, function(d, status) {
				if(status == 200) {
					plus.nativeUI.confirm("最新版本的安装包已经下载完成，是否立即安装", function(e) {
						if(e.index == 0) {
							install(d.filename)
						} else {
							plus.nativeUI.alert("下载失败！");
						}
					})
				}
				plus.nativeUI.closeWaiting()
			}).start()
		}
	})
}

function install(path) {
	plus.nativeUI.showWaiting("正在安装最新版本...")
	plus.runtime.install(path, {}, function() {
		plus.nativeUI.closeWaiting()
		plus.nativeUI.alert("应用资源更新完成!\n点击确定按钮重启完成升级", function() {
			plus.runtime.restart();
		});
	}, function(e) {
		plus.nativeUI.closeWaiting()
		plus.nativeUI.alert("安装文件失败[" + e.code + "]：" + e.message);
	})
}

function getBannerInfo() {
	setTimeout(function() {
		var _this = this
		mui.ajax(apiUrl + 'get_banner_info/', {
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
				_this.vm.banners = this.vm.banners.concat(data)
				size = data.length
				_this.vm.start_banner_url = data[0].fields.img_url
				_this.vm.end_banner_url = data[size - 1].fields.img_url
			}
		})
	}, 1500);
};

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

function getBrandItems() {
	setTimeout(function() {
		var _this = this
		mui('#index').pullRefresh().endPullup((_this.vm.page > 100));
		mui.ajax(apiUrl + 'get_brand_items/0/' + _this.vm.page, {
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json'
			},
			success: function(data) {
				if(_this.vm.page <= 2) _this.vm.init_items = this.vm.init_items.concat(data)
				else _this.vm.items = this.vm.items.concat(data)
				if(data.length < 10) _this.vm.page = 1000
				else _this.vm.page = this.vm.page + 1
			}
		})
	}, 1500);
};

mui('.mui-slider-group').on('tap', '#banner', function(e) {
	var newWv = plus.webview.create('banner-single.html', 'banner-single', {
		bottom: '0px',
		top: '0px'
	}, {
		keyword: this.dataset.keyword,
		img_url: this.dataset.img_url,
	})
	newWv.show();
});

mui('.mui-slider-item').on('tap', '#brand', function(e) {
	var newWv = plus.webview.create('brand-single.html', 'brand-single', {
		bottom: '0px',
		top: '0px'
	}, {
		brand_id: this.dataset.brand_id,
		brand_name: this.dataset.brand_name,
	})
	newWv.show();
});

mui('.mui-scroll').on('tap', '#brand', function(e) {
	var newWv = plus.webview.create('brand-single.html', 'brand-single', {
		bottom: '0px',
		top: '0px'
	}, {
		brand_id: this.dataset.brand_id,
		brand_name: this.dataset.brand_name,
	})
	newWv.show();
});

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