(function drawBoard(window) {
    var board = new Konva.Stage({
        container: '.board',
        width: window.innerWidth,
        height: window.innerHeight
    });
    var rig = new Konva.Layer({});

    board.add(rig);

    function Program(dbId) {
        this.install = function install(layer) {
            var card = new Konva.Group({
                clip: {
                    x: 0,
                    y: 0,
                    width: 300,
                    height: 212
                },
                draggable: true
            });

            var image = new Image();
            image.onload = function drawImage() {
                var raster = new Konva.Image({
                    image: image,
                    width: image.width,
                    height: image.height
                });
                card.add(raster);
                layer.add(card);
                card.draw();
            };
            card.on(
              "mouseover",
                function zoom() {
                    card.moveToTop();
                    card.draw();
                }
            );
            image.src = ("https://netrunnerdb.com/card_image/" + dbId + ".png");
        }
    }

    new Program(13006).install(rig);
    new Program(10005).install(rig);

})(window);