self.addEventListener('activate', function (event) {
	console.log(event);
});

self.addEventListener('fetch', function (event) {
	console.log(event);
});

self.addEventListener('push', function (event) {
	console.log(event);
});